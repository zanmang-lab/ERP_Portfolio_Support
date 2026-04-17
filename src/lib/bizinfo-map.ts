import type { PublicSupportNotice } from "@/data/publicSupportMock";

/** 기업마당 bizinfoApi.do JSON 루트에서 배열 추출 */
export function extractBizinfoJsonArray(root: unknown): Record<string, unknown>[] {
  if (!root || typeof root !== "object") return [];
  const o = root as Record<string, unknown>;
  if (Array.isArray(o.jsonArray)) {
    return o.jsonArray.filter(
      (x): x is Record<string, unknown> => x !== null && typeof x === "object",
    );
  }
  for (const v of Object.values(o)) {
    if (Array.isArray(v) && v.length && typeof v[0] === "object" && v[0] !== null) {
      return v as Record<string, unknown>[];
    }
  }
  return [];
}

function pickStr(row: Record<string, unknown>, keys: string[]): string {
  for (const k of keys) {
    const v = row[k];
    if (v !== undefined && v !== null && String(v).trim() !== "") {
      return String(v).trim();
    }
  }
  return "";
}

/** YYYYMMDD 또는 YYYY-MM-DD → YYYY-MM-DD */
export function normalizeBizinfoDate(raw: string): string | null {
  const s = raw.replace(/\./g, "").replace(/-/g, "").trim();
  if (/^\d{8}$/.test(s)) {
    return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw.trim())) return raw.trim();
  return null;
}

/** "YYYYMMDD~YYYYMMDD" 또는 "YYYY-MM-DD ~ YYYY-MM-DD" 등 */
function parseBeginEndFromCombined(raw: string): { start: string | null; end: string | null } {
  const tilde = raw.split("~").map((p) => p.trim()).filter(Boolean);
  if (tilde.length >= 2) {
    return {
      start: normalizeBizinfoDate(tilde[0]!.replace(/\s/g, "")),
      end: normalizeBizinfoDate(tilde[1]!.replace(/\s/g, "")),
    };
  }
  const parts = raw.split(/[–-]/).map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 2) {
    return {
      start: normalizeBizinfoDate(parts[0]!.replace(/\s/g, "")),
      end: normalizeBizinfoDate(parts[1]!.replace(/\s/g, "")),
    };
  }
  return { start: null, end: null };
}

/** 신청기간이 임의 필드 문자열로만 올 때 (예: 상세문구 안의 20250101~20250331) */
function inferPeriodFromRowStrings(
  row: Record<string, unknown>,
): { start: string | null; end: string | null } {
  for (const v of Object.values(row)) {
    if (typeof v !== "string") continue;
    const t = v.trim();
    if (t.length < 17 || !t.includes("~")) continue;
    const parsed = parseBeginEndFromCombined(t);
    if (parsed.start && parsed.end) return parsed;
  }
  return { start: null, end: null };
}

export function mapBizinfoItemToNotice(
  row: Record<string, unknown>,
): PublicSupportNotice | null {
  const id = pickStr(row, ["pblancId", "pblanc_id", "pbancSn", "pbanc_sn", "id"]);
  const title = pickStr(row, [
    "pblancNm",
    "pblanc_nm",
    "pbancNm",
    "pbanc_nm",
    "sportTitle",
    "sport_title",
    "title",
  ]);
  if (!id || !title) return null;

  const beginKeys = [
    "reqstBeginDe",
    "reqst_begin_de",
    "reqstBeginDt",
    "reqst_begin_dt",
    "rceptBeginDe",
    "rcept_begin_de",
    "rceptBeginDt",
    "applBeginDe",
    "appl_begin_de",
    "applBeginDt",
    "appl_begin_dt",
    "pbancRgstBgnDe",
    "pbanc_rgst_bgn_de",
    "rceptBgnde",
  ];
  const endKeys = [
    "reqstEndDe",
    "reqst_end_de",
    "reqstEndDt",
    "reqst_end_dt",
    "rceptEndDe",
    "rcept_end_de",
    "rceptEndDt",
    "applEndDe",
    "appl_end_de",
    "applEndDt",
    "appl_end_dt",
    "pbancRgstEndDe",
    "pbanc_rgst_end_de",
    "rceptEndde",
  ];
  let periodStart = normalizeBizinfoDate(pickStr(row, beginKeys)) ?? null;
  let periodEnd = normalizeBizinfoDate(pickStr(row, endKeys)) ?? null;

  const combined = pickStr(row, [
    "reqstBeginEndDe",
    "reqst_begin_end_de",
    "applDt",
    "rceptPd",
    "rcept_pd",
    "reqstPd",
    "pbancDt",
    "bsnsOperDe",
  ]);
  if ((!periodStart || !periodEnd) && combined) {
    const parsed = parseBeginEndFromCombined(combined);
    periodStart = periodStart ?? parsed.start;
    periodEnd = periodEnd ?? parsed.end;
  }

  if (!periodEnd) {
    const inferred = inferPeriodFromRowStrings(row);
    periodStart = periodStart ?? inferred.start;
    periodEnd = inferred.end ?? null;
  }

  if (!periodEnd) return null;
  if (!periodStart) periodStart = periodEnd;

  const field = pickStr(row, [
    "lclasClNm",
    "typeNm",
    "indstrlClNm",
    "pldirSportRealmLclasIdNm",
    "pblancClNm",
  ]);
  const ministry = pickStr(row, ["jrsdInsttNm", "jrsd_instt_nm", "insttNm"]);
  const agency = pickStr(row, [
    "excInsttNm",
    "exc_instt_nm",
    "rdcorInsttNm",
    "atnrNm",
    "insttNm",
  ]);
  const fileUrl = pickStr(row, [
    "atchFileUrl",
    "atch_file_url",
    "fileUrl",
    "pblancUrl",
    "pblanc_url",
    "detailUrl",
  ]);
  const hasFile = !!fileUrl || pickStr(row, ["hasAtchFile", "atchFileId"]) === "Y";

  return {
    id,
    field: field || "—",
    title,
    periodStart,
    periodEnd,
    deadline: periodEnd,
    ministry: ministry || "—",
    agency: agency || ministry || "—",
    hasFile,
    fileUrl: fileUrl || undefined,
  };
}

/** Vercel(UTC) 등에서도 한국 달력 기준으로 진행 여부 판정 */
function todayYmdSeoul(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/** 신청 시작일 이전이 아니고, 신청 마감일이 오늘 이후(당일 포함)인 공고 — 날짜는 YYYY-MM-DD 문자열 비교 */
export function isOngoingPublicNotice(row: PublicSupportNotice): boolean {
  const today = todayYmdSeoul();
  const end = normalizeBizinfoDate(row.periodEnd);
  const begin = normalizeBizinfoDate(row.periodStart);
  if (!end) return false;
  if (end < today) return false;
  if (begin && begin > today) return false;
  return true;
}
