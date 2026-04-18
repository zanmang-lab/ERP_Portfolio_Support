export type CompletionProjectRow = {
  id: string;
  name: string;
  /** 공모/산업 분야 */
  field: string;
  /** true: 발탁, false: 미발탁 */
  selected: boolean;
};

/** 데모: 전체·발탁·미발탁이 골고루 나오도록 구성 */
export const COMPLETION_PROJECT_ROWS: CompletionProjectRow[] = [
  { id: "bc-01", name: "중소기업 혁신바우처(디지털 전환)", field: "금융", selected: true },
  { id: "bc-02", name: "R&D 기술개발 지원(민·관 협력)", field: "기술", selected: false },
  { id: "bc-03", name: "청년 일자리 도약 장려금", field: "인력", selected: true },
  { id: "bc-04", name: "해외시장 개척 지원(수출 바우처)", field: "수출", selected: true },
  { id: "bc-05", name: "탄소중립 이행 지원(에너지 효율)", field: "환경", selected: false },
  { id: "bc-06", name: "소상공인 정책자금 이자 환급", field: "금융", selected: false },
  { id: "bc-07", name: "스마트제조 혁신기술 실증", field: "기술", selected: true },
  { id: "bc-08", name: "장애인 고용장려금(추가 지원)", field: "인력", selected: false },
  { id: "bc-09", name: "K-중소기업 브랜드 육성", field: "수출", selected: false },
  { id: "bc-10", name: "AI·데이터 서비스 고도화", field: "기술", selected: true },
  { id: "bc-11", name: "의료기기 개발 실증 지원", field: "의료", selected: true },
  { id: "bc-12", name: "건설 안전·품질 혁신 지원", field: "건설", selected: false },
  { id: "bc-13", name: "예비창업 패키지(초기 자금)", field: "창업", selected: true },
  { id: "bc-14", name: "기업부설연구소 인증 컨설팅", field: "기술", selected: false },
  { id: "bc-15", name: "녹색융자 특별금리 지원", field: "금융", selected: true },
  { id: "bc-16", name: "지역 인재 양성(산학연)", field: "인력", selected: false },
  { id: "bc-17", name: "스마트팜 수출 패키지", field: "수출", selected: true },
  { id: "bc-18", name: "폐자원 순환 시설 보조", field: "환경", selected: false },
  { id: "bc-19", name: "원격 진료 인프라 구축", field: "의료", selected: false },
  { id: "bc-20", name: "건설현장 디지털 전환", field: "건설", selected: true },
  { id: "bc-21", name: "창업기업 R&D 바우처", field: "창업", selected: false },
  { id: "bc-22", name: "중소기업 ESG 경영 인증", field: "환경", selected: true },
];

/** 차트·버튼에서 동일 색을 쓰기 위한 분야 목록(표시 순) */
export const COMPLETION_FIELD_ORDER: string[] = [
  "금융",
  "기술",
  "인력",
  "수출",
  "환경",
  "의료",
  "건설",
  "창업",
];

export type PieDatum = { name: string; value: number };

export function aggregateFieldCounts(
  rows: CompletionProjectRow[],
): Record<string, number> {
  const acc: Record<string, number> = {};
  for (const r of rows) {
    acc[r.field] = (acc[r.field] ?? 0) + 1;
  }
  return acc;
}

export function countsToPieData(counts: Record<string, number>): PieDatum[] {
  return COMPLETION_FIELD_ORDER.filter((f) => (counts[f] ?? 0) > 0).map(
    (name) => ({ name, value: counts[name]! }),
  );
}

export function pieDataForSubset(
  rows: CompletionProjectRow[],
  selected: boolean | null,
): PieDatum[] {
  const filtered =
    selected === null
      ? rows
      : rows.filter((r) => r.selected === selected);
  return countsToPieData(aggregateFieldCounts(filtered));
}

export type FieldSelectionStats = {
  field: string;
  selectedCount: number;
  notSelectedCount: number;
  total: number;
  /** 발탁 비율 % (해당 분야 내) */
  selectedPct: number;
};

export function statsForField(
  rows: CompletionProjectRow[],
  field: string,
): FieldSelectionStats {
  const inField = rows.filter((r) => r.field === field);
  let selectedCount = 0;
  let notSelectedCount = 0;
  for (const r of inField) {
    if (r.selected) selectedCount += 1;
    else notSelectedCount += 1;
  }
  const total = selectedCount + notSelectedCount;
  const selectedPct =
    total === 0 ? 0 : Math.round((selectedCount / total) * 1000) / 10;
  return {
    field,
    selectedCount,
    notSelectedCount,
    total,
    selectedPct,
  };
}
