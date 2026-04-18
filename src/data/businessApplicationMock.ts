/** 서류 유형(카탈로그) — 서류관리·사업신청 공통 ID */
export type DocumentTypeId = string;

export const DOCUMENT_CATALOG: { id: DocumentTypeId; name: string }[] = [
  { id: "doc-business-registration", name: "사업자등록증 사본" },
  { id: "doc-financial-3y", name: "최근 3개년 재무제표" },
  { id: "doc-vat-return", name: "부가가치세 과세표준증명" },
  { id: "doc-employment-insurance", name: "고용보험 가입자 명부" },
  { id: "doc-venture-cert", name: "벤처기업 확인서" },
  { id: "doc-research-lab", name: "기업부설연구소 인정서" },
  { id: "doc-export-plan", name: "수출계획서" },
  { id: "doc-privacy-consent", name: "개인정보 수집·이용 동의서" },
];

const catalogIds = new Set(DOCUMENT_CATALOG.map((d) => d.id));

function docNames(ids: DocumentTypeId[]): DocumentTypeId[] {
  return ids.filter((id) => catalogIds.has(id));
}

/**
 * 공고(ps-xxx)별 제출 필요 서류 유형 ID.
 * 목에 없는 공고는 기본 3종으로 폴백.
 */
export const REQUIRED_DOC_IDS_BY_NOTICE_ID: Record<string, DocumentTypeId[]> = {
  "ps-001": docNames([
    "doc-business-registration",
    "doc-financial-3y",
    "doc-vat-return",
    "doc-venture-cert",
  ]),
  "ps-002": docNames([
    "doc-business-registration",
    "doc-research-lab",
    "doc-financial-3y",
    "doc-privacy-consent",
  ]),
  "ps-003": docNames([
    "doc-business-registration",
    "doc-employment-insurance",
    "doc-financial-3y",
  ]),
  "ps-004": docNames([
    "doc-business-registration",
    "doc-export-plan",
    "doc-financial-3y",
  ]),
  "ps-005": docNames([
    "doc-business-registration",
    "doc-financial-3y",
    "doc-vat-return",
  ]),
  "ps-006": docNames([
    "doc-business-registration",
    "doc-financial-3y",
  ]),
  "ps-007": docNames([
    "doc-business-registration",
    "doc-research-lab",
    "doc-financial-3y",
    "doc-privacy-consent",
  ]),
  "ps-008": docNames([
    "doc-business-registration",
    "doc-employment-insurance",
  ]),
  "ps-009": docNames([
    "doc-business-registration",
    "doc-export-plan",
    "doc-vat-return",
  ]),
  "ps-010": docNames([
    "doc-business-registration",
    "doc-financial-3y",
    "doc-research-lab",
  ]),
};

export const DEFAULT_REQUIRED_DOC_IDS: DocumentTypeId[] = docNames([
  "doc-business-registration",
  "doc-financial-3y",
  "doc-vat-return",
]);

/** [서류관리]에 이미 등록되어 있다고 가정하는 서류 유형(데모 시드) */
export const INITIAL_DOCUMENT_REGISTRY_IDS: DocumentTypeId[] = [
  "doc-business-registration",
  "doc-financial-3y",
];

export function getRequiredDocIdsForNotice(noticeId: string): DocumentTypeId[] {
  return REQUIRED_DOC_IDS_BY_NOTICE_ID[noticeId] ?? DEFAULT_REQUIRED_DOC_IDS;
}

export function documentTypeName(id: DocumentTypeId): string {
  return DOCUMENT_CATALOG.find((d) => d.id === id)?.name ?? id;
}
