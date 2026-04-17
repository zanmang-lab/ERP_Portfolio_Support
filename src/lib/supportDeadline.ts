function ymdPartsFromIso(iso: string): [number, number, number] {
  const datePart = (iso.includes("T") ? iso.split("T")[0] : iso).slice(0, 10);
  const [y, m, d] = datePart.split("-").map(Number);
  return [y, m, d];
}

/** 배포 서버가 UTC여도 한국 달력 기준으로 오늘 날짜(YYYY-MM-DD) */
function todayYmdSeoul(reference: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(reference);
}

/**
 * 마감일(날짜만)을 기준으로 오늘과의 달력 일수 차이를 반환합니다.
 * - 양수: 마감까지 남은 일수
 * - 0: 오늘이 마감일(D-Day)
 * - 음수: 마감 경과
 * - "오늘"은 Asia/Seoul 달력 기준(배포 환경 UTC와 무관)
 */
export function getDaysUntilDeadline(
  deadlineIso: string,
  reference: Date = new Date(),
): number {
  const [dy, dm, dd] = ymdPartsFromIso(deadlineIso);
  const todayStr = todayYmdSeoul(reference);
  const [ty, tm, td] = todayStr.split("-").map(Number);
  const end = Date.UTC(dy, dm - 1, dd);
  const start = Date.UTC(ty, tm - 1, td);
  return Math.round((end - start) / 86_400_000);
}

/** 예: D-7, D-Day, D+3 */
export function formatDdayLabel(daysUntil: number): string {
  if (daysUntil === 0) return "D-Day";
  if (daysUntil > 0) return `D-${daysUntil}`;
  return `D+${Math.abs(daysUntil)}`;
}

/** 마감 전이며 남은 일수가 3일 이하(0~3)일 때 강조 스타일 적용 */
export function isDeadlineWithinThreeDays(daysUntil: number): boolean {
  return daysUntil >= 0 && daysUntil <= 3;
}
