import dns from "node:dns";
import { NextResponse } from "next/server";
import {
  extractBizinfoJsonArray,
  isOngoingPublicNotice,
  mapBizinfoItemToNotice,
} from "@/lib/bizinfo-map";
import type { PublicSupportNotice } from "@/data/publicSupportMock";

/** Vercel 등에서 IPv6 우선 해석으로 인한 undici `fetch failed` 완화 */
dns.setDefaultResultOrder("ipv4first");

export const dynamic = "force-dynamic";
/** 기업마당 쪽으로 여러 페이지 fetch — Node 런타임 권장 */
export const runtime = "nodejs";
/** Vercel Pro 등에서 재시도·다중 페이지 여유 (무료 플랜은 10초 한도로 일부 시나리오에서 제한될 수 있음) */
export const maxDuration = 30;

const BIZINFO_LIST_URL = "https://www.bizinfo.go.kr/uss/rss/bizinfoApi.do";
/** 한 번에 읽는 바이트를 줄여 ECONNRESET(응답 도중 끊김) 완화. 페이지 수는 서버리스 시간 한도 고려 */
const MAX_PAGES = 2;
const PAGE_UNIT = 200;
const FETCH_MS = 10_000;
const FETCH_RETRIES = 3;
const MS_BETWEEN_PAGES = 450;

/** 빌드 시점에 비어 있으면 env 가 undefined 로 박히는 경우를 피하려고 런타임 조회 */
function readServerEnv(name: string): string | undefined {
  const v = process.env[name];
  return typeof v === "string" ? v : undefined;
}

function describeFetchError(e: unknown): string {
  if (!(e instanceof Error)) return String(e);
  const parts = [e.message];
  if ("cause" in e && e.cause instanceof Error && e.cause.message) {
    parts.push(`원인: ${e.cause.message}`);
  }
  return parts.join(" ");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** ECONNRESET 등은 재시도로 종종 성공. keep-alive 풀 이슈 완화에 Connection: close 사용 */
async function fetchBizinfoBody(url: URL): Promise<string> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= FETCH_RETRIES; attempt++) {
    try {
      const res = await fetch(url.toString(), {
        cache: "no-store",
        signal: AbortSignal.timeout(FETCH_MS),
        headers: {
          Accept: "application/json",
          Connection: "close",
          "User-Agent":
            "Mozilla/5.0 (compatible; ERP-Portfolio/1.0; +https://github.com/zanmang-lab)",
        },
      });
      const text = await res.text();
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      return text;
    } catch (e) {
      lastError = e;
      if (attempt < FETCH_RETRIES) {
        await sleep(280 * 2 ** (attempt - 1));
      }
    }
  }
  throw lastError;
}

export async function GET() {
  const crtfcKey = readServerEnv("BIZINFO_CRTFC_KEY")?.trim();
  if (!crtfcKey) {
    return NextResponse.json(
      {
        ok: false,
        code: "missing_key",
        message:
          "서버 환경변수 BIZINFO_CRTFC_KEY 가 설정되지 않았습니다. 로컬은 프로젝트 루트의 .env.local, Vercel 등 배포는 프로젝트 Settings → Environment Variables에 동일 이름으로 키를 넣은 뒤 재배포하세요.",
        items: [] as PublicSupportNotice[],
      },
      { status: 503 },
    );
  }

  const merged: PublicSupportNotice[] = [];
  const seen = new Set<string>();

  try {
    for (let pageIndex = 1; pageIndex <= MAX_PAGES; pageIndex++) {
      if (pageIndex > 1) await sleep(MS_BETWEEN_PAGES);

      const url = new URL(BIZINFO_LIST_URL);
      url.searchParams.set("crtfcKey", crtfcKey);
      url.searchParams.set("dataType", "json");
      url.searchParams.set("pageUnit", String(PAGE_UNIT));
      url.searchParams.set("pageIndex", String(pageIndex));

      const text = await fetchBizinfoBody(url);
      let data: unknown;
      try {
        data = JSON.parse(text) as unknown;
      } catch {
        return NextResponse.json(
          {
            ok: false,
            code: "invalid_json",
            message: "기업마당 응답이 JSON이 아닙니다.",
            detail: text.slice(0, 400),
            items: [],
          },
          { status: 502 },
        );
      }

      if (data && typeof data === "object" && "reqErr" in data) {
        return NextResponse.json(
          {
            ok: false,
            code: "bizinfo_error",
            message: String((data as { reqErr: unknown }).reqErr),
            items: [],
          },
          { status: 401 },
        );
      }

      const rawRows = extractBizinfoJsonArray(data);
      if (rawRows.length === 0) break;

      for (const raw of rawRows) {
        const mapped = mapBizinfoItemToNotice(raw);
        if (!mapped || !isOngoingPublicNotice(mapped)) continue;
        if (seen.has(mapped.id)) continue;
        seen.add(mapped.id);
        merged.push(mapped);
      }

      if (rawRows.length < PAGE_UNIT) break;
    }

    return NextResponse.json({
      ok: true,
      items: merged,
    });
  } catch (e) {
    const message = describeFetchError(e);
    const isReset =
      /ECONNRESET|ECONNREFUSED|ETIMEDOUT|EPIPE/i.test(message) ||
      message.includes("read ECONNRESET");
    return NextResponse.json(
      {
        ok: false,
        code: "fetch_failed",
        message: isReset
          ? "기업마당과의 연결이 중간에 끊겼습니다(ECONNRESET 등). 클라우드 IP 차단·일시 장애일 수 있어 잠시 후 새로고침하거나, 같은 증상이 반복되면 Vercel 유료 플랜(함수 실행 시간 여유) 또는 로컬에서 호출을 검토해 주세요."
          : message === "fetch failed"
            ? "기업마당 서버 연결에 실패했습니다. 잠시 후 다시 시도해 주세요."
            : message,
        items: [] as PublicSupportNotice[],
      },
      { status: 500 },
    );
  }
}
