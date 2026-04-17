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

/** 기업마당 지원사업 `searchLclasId` 대분류와 동일 체계(문서 기준) */
const BIZINFO_LCLAS_CODE_LABEL: Record<string, string> = {
  "01": "금융",
  "02": "기술",
  "03": "인력",
  "04": "수출",
  "05": "내수",
  "06": "창업",
  "07": "경영",
  "08": "제도",
  "09": "기타",
};

function normalizeLclasCode(raw: string): string | null {
  const t = raw.trim();
  if (!/^\d{1,2}$/.test(t)) return null;
  return t.padStart(2, "0");
}

/** 응답에 분야명 문자열이 없고 대분류 코드만 있을 때 */
function pickSupportFieldFromLclasCode(row: Record<string, unknown>): string {
  const codeKeys = [
    "pldirSportRealmLclasId",
    "pldir_sport_realm_lclas_id",
    "sportRealmLclasId",
    "sport_realm_lclas_id",
    "lclasId",
    "lclas_id",
    "searchLclasId",
    "search_lclas_id",
  ];
  for (const k of codeKeys) {
    const v = row[k];
    if (v === undefined || v === null) continue;
    const code = normalizeLclasCode(String(v));
    if (code && BIZINFO_LCLAS_CODE_LABEL[code]) {
      return BIZINFO_LCLAS_CODE_LABEL[code]!;
    }
  }
  return "";
}

/** 알려진 키 외에 필드명 패턴으로 지원분야 후보 문자열 찾기 */
function pickSupportFieldByKeyPattern(row: Record<string, unknown>): string {
  for (const [key, val] of Object.entries(row)) {
    if (typeof val !== "string") continue;
    const t = val.trim();
    if (t.length < 2 || t.length > 80) continue;
    const kl = key.toLowerCase();
    if (/url|id$/i.test(key) && !/clnm|nm$/i.test(key)) continue;
    if (
      /lclas.*nm|sportrealm.*nm|sprtrealm|indstrl.*nm|pblancclnm|bsnslclas|realm.*nm|지원분야|분야명/i.test(
        kl,
      )
    ) {
      return t;
    }
  }
  return "";
}

function pickSupportField(row: Record<string, unknown>): string {
  const direct = pickStr(row, [
    "lclasClNm",
    "lclas_nm",
    "lclasNm",
    "LclasClNm",
    "typeNm",
    "type_nm",
    "indstrlClNm",
    "indstrl_cl_nm",
    "pldirSportRealmLclasIdNm",
    "pldir_sport_realm_lclas_id_nm",
    "pldirSportRealmNm",
    "pldir_sport_realm_nm",
    "pldirSportRealmMlsfcNm",
    "sportRealmNm",
    "sport_realm_nm",
    "sportRealmLclasNm",
    "pblancClNm",
    "pblanc_cl_nm",
    "sprtArNm",
    "sprt_ar_nm",
    "jdgmnIndstryNm",
    "jdgmn_indstry_nm",
    "bsnsLclasNm",
    "bsns_lclas_nm",
    "dasfnSportRealmNm",
    "demandSprtRealmNm",
    "clssNm",
    "clss_nm",
    "realmLclasNm",
    "deptSportRealmNm",
  ]);
  if (direct) return direct;
  const fromCode = pickSupportFieldFromLclasCode(row);
  if (fromCode) return fromCode;
  return pickSupportFieldByKeyPattern(row);
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

  const field = pickSupportField(row);
  const ministry = pickStr(row, [
    "jrsdInsttNm",
    "jrsd_instt_nm",
    "insttNm",
    "instt_nm",
    "sprvInsttNm",
    "sprv_instt_nm",
  ]);
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
