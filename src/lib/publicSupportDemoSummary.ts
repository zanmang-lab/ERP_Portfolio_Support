import type { PublicSupportNotice } from "@/data/publicSupportMock";
import { formatApplicationPeriod } from "@/data/publicSupportMock";

export type SummarySectionKey =
  | "overview"
  | "eligibility"
  | "announcement"
  | "documents"
  | "submission"
  | "targets"
  | "selection";

export type DemoSummarySection = {
  key: SummarySectionKey;
  title: string;
  body: string;
};

/** 데모용 공고 ID 표시 (기업마당 스타일 PBLN_ + 15자리 느낌) */
export function formatPublicNoticeId(id: string): string {
  const t = id.trim();
  if (/^PBLN_/i.test(t)) {
    const rest = t.slice(5);
    if (/^\d+$/.test(rest)) {
      return `PBLN_${rest.padStart(15, "0")}`;
    }
    return `PBLN_${rest}`;
  }
  const digits = t.replace(/\D/g, "");
  if (digits.length > 0) {
    const tail = digits.slice(-15).padStart(15, "0");
    return `PBLN_${tail}`;
  }
  let n = 0;
  for (let i = 0; i < t.length; i++) n = (n * 31 + t.charCodeAt(i)) >>> 0;
  const pseudo = String(n % 10 ** 15).padStart(15, "0");
  return `PBLN_${pseudo}`;
}

function titleHeadline(title: string): string {
  const i = title.indexOf("\n");
  return i === -1 ? title : title.slice(0, i);
}

/**
 * 실제 공고문 파싱 없이, 메타데이터만 반영한 7블록 데모 요약
 */
export function getDemoSummarySections(
  notice: PublicSupportNotice,
): DemoSummarySection[] {
  const period = formatApplicationPeriod(notice);
  const headline = titleHeadline(notice.title);
  const idLine = formatPublicNoticeId(notice.id);

  return [
    {
      key: "overview",
      title: "사업개요",
      body: `${notice.field} 「${headline}」(${idLine}). ${notice.ministry}·${notice.agency} 주관, 세부 프로그램은 공고문 기준. 신청 ${period}.`,
    },
    {
      key: "eligibility",
      title: "지원자격 및 요건",
      body: `공고문의 법인·개인사업자 요건·결격(체납 등)을 따름. 규모·실적 등 세부는 「${headline}」 별표 확인.`,
    },
    {
      key: "announcement",
      title: "사업공고 및 신청",
      body: `${notice.ministry}/${notice.agency} 채널 공고. 접수 ${period}, 마감 ${notice.deadline}. 접수처·동의는 공고문 신청란.`,
    },
    {
      key: "documents",
      title: "신청서류",
      body: `공고문 목록(신청서·사업자·재무·신분 등) 준비. 「${headline}」 추가 서류·양식 확장자는 공고문 참고.`,
    },
    {
      key: "submission",
      title: "제출양식 및 제출본",
      body: `지정 양식 준수, 서명·날인·용량 규칙 확인. 우편·방문 분기는 공고문 제출 안내 따름.`,
    },
    {
      key: "targets",
      title: "사업대상",
      body: `${notice.field} 분야 목적 부합 기업·기관. 지역·업종·중복 지원 한도는 공고문 본문·별표.`,
    },
    {
      key: "selection",
      title: "업체 선정 기준",
      body: `공고문 배점·절차(서류·발표 등). 타당성·재무·수행 역량 등 반영. 세부는 ${notice.agency} 공고 및 첨부 공고문.`,
    },
  ];
}
