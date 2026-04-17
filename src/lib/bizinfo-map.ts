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
  const parts = raw.split(/[~\-–]/).map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 2) {
    return {
      start: normalizeBizinfoDate(parts[0]!.replace(/\s/g, "")),
      end: normalizeBizinfoDate(parts[1]!.replace(/\s/g, "")),
    };
  }
  return { start: null, end: null };
}

export function mapBizinfoItemToNotice(
  row: Record<string, unknown>,
): PublicSupportNotice | null {
  const id = pickStr(row, ["pblancId", "pblanc_id", "id"]);
  const title = pickStr(row, ["pblancNm", "pblanc_nm", "title"]);
  if (!id || !title) return null;

  let periodStart =
    normalizeBizinfoDate(pickStr(row, ["reqstBeginDe", "reqst_begin_de", "applBeginDt"])) ??
    null;
  let periodEnd =
    normalizeBizinfoDate(pickStr(row, ["reqstEndDe", "reqst_end_de", "applEndDt"])) ?? null;

  const combined = pickStr(row, ["reqstBeginEndDe", "reqst_begin_end_de", "applDt"]);
  if ((!periodStart || !periodEnd) && combined) {
    const parsed = parseBeginEndFromCombined(combined);
    periodStart = periodStart ?? parsed.start;
    periodEnd = periodEnd ?? parsed.end;
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

function startOfToday(): Date {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function parseYmd(ymd: string): Date | null {
  const n = normalizeBizinfoDate(ymd);
  if (!n) return null;
  const [y, m, d] = n.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** 신청 시작일 이전이 아니고, 신청 마감일이 오늘 이후(당일 포함)인 공고 */
export function isOngoingPublicNotice(row: PublicSupportNotice): boolean {
  const today = startOfToday();
  const end = parseYmd(row.periodEnd);
  const begin = parseYmd(row.periodStart);
  if (!end) return false;
  if (end < today) return false;
  if (begin && begin > today) return false;
  return true;
}
