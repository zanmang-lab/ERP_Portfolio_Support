/** 매사업 갱신 — 사업계획서 양식 미리보기용 더미 */

export const RENEWAL_TEMPLATE_PREVIEW_TITLE = "사업계획서 양식";

export type RenewalTemplateField = {
  label: string;
  /** 표시용 샘플 값 */
  sampleValue: string;
};

export const RENEWAL_TEMPLATE_FIELDS: RenewalTemplateField[] = [
  { label: "사업명", sampleValue: "○○ 지원사업 매사업 갱신" },
  { label: "기업명", sampleValue: "데모 주식회사" },
  { label: "날짜", sampleValue: "2026-04-19" },
  { label: "사업규모", sampleValue: "중소 규모 (직원 50명 내외)" },
  { label: "투자계획", sampleValue: "설비 2억 / 운영 5천만 원" },
  { label: "인력투자", sampleValue: "전담 2명, 파트타임 1명" },
];

export type RenewalDownloadFormat = {
  ext: string;
  /** UI 라벨 (예: .docx로 다운받기) */
  label: string;
};

export const RENEWAL_DOWNLOAD_FORMATS: RenewalDownloadFormat[] = [
  { ext: "docx", label: ".docx로 다운받기" },
  { ext: "pdf", label: ".pdf로 다운받기" },
  { ext: "hwpx", label: ".hwpx로 다운받기" },
  { ext: "pptx", label: ".pptx로 다운받기" },
];

/** Blob 본문에 넣을 데모 텍스트 (실제 Office 바이너리 아님) */
export function buildRenewalPlaceholderBody(ext: string): string {
  return [
    "[데모] 매사업 갱신 서류 초안 플레이스홀더",
    `형식 확장자: .${ext}`,
    "",
    "표준화된 정보 구조를 기반으로 한 초안입니다.",
    "수정 후 [서류관리] 또는 [사업관리]에서 업로드하여 활용할 수 있습니다.",
    "",
    "---",
    ...RENEWAL_TEMPLATE_FIELDS.map(
      (f) => `${f.label}: ${f.sampleValue}`,
    ),
  ].join("\n");
}
