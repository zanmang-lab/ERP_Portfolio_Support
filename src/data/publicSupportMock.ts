export interface PublicSupportNotice {
  id: string;
  /** 지원분야 */
  field: string;
  /** 공고사업명 (줄바꿈 허용) */
  title: string;
  periodStart: string;
  periodEnd: string;
  /** 마감일 (신청 마감, D-DAY 계산용 YYYY-MM-DD) */
  deadline: string;
  ministry: string;
  agency: string;
  hasFile: boolean;
  /** 기업마당 등에서 내려주는 첨부/상세 URL */
  fileUrl?: string;
}

export function formatApplicationPeriod(row: PublicSupportNotice): string {
  return `${row.periodStart} ~ ${row.periodEnd}`;
}

/** 기업마당(Bizinfo) API 응답 매핑에 가정한 형태의 데모 목록 */
export const publicSupportMockList: PublicSupportNotice[] = [
  {
    id: "ps-001",
    field: "금융",
    title:
      "2026년 중소기업 혁신바우처 지원사업(디지털 전환·스마트공장)\n1차 추가 모집",
    periodStart: "2026-04-01",
    periodEnd: "2026-04-18",
    deadline: "2026-04-18",
    ministry: "중소벤처기업부",
    agency: "중소기업진흥공단",
    hasFile: true,
  },
  {
    id: "ps-002",
    field: "기술",
    title: "R&D 기술개발 지원(민·관 협력형) 공고",
    periodStart: "2026-03-15",
    periodEnd: "2026-04-16",
    deadline: "2026-04-16",
    ministry: "과학기술정보통신부",
    agency: "한국산업기술진흥원",
    hasFile: true,
  },
  {
    id: "ps-003",
    field: "인력",
    title: "청년 일자리 도약 장려금(중소기업 채용 지원)",
    periodStart: "2026-04-10",
    periodEnd: "2026-04-25",
    deadline: "2026-04-25",
    ministry: "고용노동부",
    agency: "한국산업인력공단",
    hasFile: false,
  },
  {
    id: "ps-004",
    field: "수출",
    title:
      "2026년 해외시장 개척 지원(온라인 수출 바우처)\n동남아·중동 대상",
    periodStart: "2026-04-05",
    periodEnd: "2026-04-30",
    deadline: "2026-04-30",
    ministry: "산업통상자원부",
    agency: "대한무역투자진흥공사",
    hasFile: true,
  },
  {
    id: "ps-005",
    field: "환경",
    title: "탄소중립 이행 지원(에너지 효율 개선 설비)",
    periodStart: "2026-04-12",
    periodEnd: "2026-05-10",
    deadline: "2026-05-10",
    ministry: "환경부",
    agency: "한국환경산업기술원",
    hasFile: true,
  },
  {
    id: "ps-006",
    field: "금융",
    title: "소상공인 정책자금(대출) 이자 환급 지원",
    periodStart: "2026-04-01",
    periodEnd: "2026-04-18",
    deadline: "2026-04-18",
    ministry: "중소벤처기업부",
    agency: "소상공인시장진흥공단",
    hasFile: true,
  },
  {
    id: "ps-007",
    field: "기술",
    title: "스마트제조 혁신기술 실증 지원(제조 데이터 표준)",
    periodStart: "2026-04-08",
    periodEnd: "2026-04-22",
    deadline: "2026-04-22",
    ministry: "산업통상자원부",
    agency: "한국산업기술평가관리원",
    hasFile: true,
  },
  {
    id: "ps-008",
    field: "인력",
    title: "장애인 고용장려금(중소기업 추가 지원) 공고",
    periodStart: "2026-04-02",
    periodEnd: "2026-04-28",
    deadline: "2026-04-28",
    ministry: "고용노동부",
    agency: "한국장애인고용공단",
    hasFile: false,
  },
  {
    id: "ps-009",
    field: "수출",
    title: "K-중소기업 브랜드 육성(패키지 디자인·마케팅) 지원",
    periodStart: "2026-04-14",
    periodEnd: "2026-05-05",
    deadline: "2026-05-05",
    ministry: "산업통상자원부",
    agency: "중소벤처기업진흥공단",
    hasFile: true,
  },
  {
    id: "ps-010",
    field: "기술",
    title: "AI·데이터 기반 서비스 고도화 사업(클라우드 전환 포함)",
    periodStart: "2026-04-10",
    periodEnd: "2026-04-25",
    deadline: "2026-04-25",
    ministry: "과학기술정보통신부",
    agency: "정보통신산업진흥원",
    hasFile: true,
  },
];
