/**
 * 마감일(날짜만)을 기준으로 오늘과의 달력 일수 차이를 반환합니다.
 * - 양수: 마감까지 남은 일수
 * - 0: 오늘이 마감일(D-Day)
 * - 음수: 마감 경과
 */
export function getDaysUntilDeadline(
  deadlineIso: string,
  reference: Date = new Date(),
): number {
  const deadline = parseLocalDate(deadlineIso);
  const ref = new Date(
    reference.getFullYear(),
    reference.getMonth(),
    reference.getDate(),
  );
  const diffMs = deadline.getTime() - ref.getTime();
  return Math.round(diffMs / 86_400_000);
}

function parseLocalDate(iso: string): Date {
  const datePart = iso.includes("T") ? iso.split("T")[0] : iso;
  const [y, m, d] = datePart.split("-").map(Number);
  return new Date(y, m - 1, d);
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
