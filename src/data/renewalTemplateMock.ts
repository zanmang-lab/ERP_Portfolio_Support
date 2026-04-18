/** 매사업 갱신 — 사업계획서 양식 필드 라벨(값은 비움) */

export const RENEWAL_TEMPLATE_PREVIEW_TITLE = "사업계획서 양식";

/** 입력란 라벨만 정의 (미리보기·다운로드 본문 모두 빈칸) */
export const RENEWAL_TEMPLATE_FIELD_LABELS: string[] = [
  "사업명",
  "기업명",
  "날짜",
  "사업규모",
  "투자계획",
  "인력투자",
];

export type RenewalDownloadFormat = {
  ext: string;
  label: string;
};

export const RENEWAL_DOWNLOAD_FORMATS: RenewalDownloadFormat[] = [
  { ext: "docx", label: ".docx로 다운받기" },
  { ext: "pdf", label: ".pdf로 다운받기" },
  { ext: "hwpx", label: ".hwpx로 다운받기" },
  { ext: "pptx", label: ".pptx로 다운받기" },
];

/** Blob 본문 (UTF-8 텍스트 초안, 실제 Office 바이너리 아님) */
export function buildRenewalPlaceholderBody(ext: string): string {
  return [
    `매사업 갱신 서류 양식 (초안) · 형식: .${ext}`,
    "",
    ...RENEWAL_TEMPLATE_FIELD_LABELS.map((label) => `${label}: `),
  ].join("\n");
}
