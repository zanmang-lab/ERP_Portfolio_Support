import { NextResponse } from "next/server";
import {
  extractBizinfoJsonArray,
  isOngoingPublicNotice,
  mapBizinfoItemToNotice,
} from "@/lib/bizinfo-map";
import type { PublicSupportNotice } from "@/data/publicSupportMock";

export const dynamic = "force-dynamic";
/** 기업마당 쪽으로 여러 페이지 fetch — Node 런타임 권장 */
export const runtime = "nodejs";

const BIZINFO_LIST_URL = "https://www.bizinfo.go.kr/uss/rss/bizinfoApi.do";
const MAX_PAGES = 12;
const PAGE_UNIT = 100;

/** 빌드 시점에 비어 있으면 env 가 undefined 로 박히는 경우를 피하려고 런타임 조회 */
function readServerEnv(name: string): string | undefined {
  const v = process.env[name];
  return typeof v === "string" ? v : undefined;
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
      const url = new URL(BIZINFO_LIST_URL);
      url.searchParams.set("crtfcKey", crtfcKey);
      url.searchParams.set("dataType", "json");
      url.searchParams.set("pageUnit", String(PAGE_UNIT));
      url.searchParams.set("pageIndex", String(pageIndex));

      const res = await fetch(url.toString(), {
        cache: "no-store",
        headers: {
          Accept: "application/json",
          "User-Agent": "ERP-Portfolio/1.0 (Next.js)",
        },
      });

      const text = await res.text();
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
    const message = e instanceof Error ? e.message : "unknown error";
    return NextResponse.json(
      {
        ok: false,
        code: "fetch_failed",
        message,
        items: [] as PublicSupportNotice[],
      },
      { status: 500 },
    );
  }
}
