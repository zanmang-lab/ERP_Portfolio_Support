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
      body: `본 공고(${idLine})는 ${notice.field} 분야 「${headline}」에 대한 지원입니다. 소관 ${notice.ministry}, 사업수행 ${notice.agency} 주관으로 운영되며, 컨설팅·자금·홍보 등 프로그램 구성은 첨부 공고문 및 세부 지침을 따릅니다. 신청 가능 기간은 ${period}이며, 세부 일정은 공고문을 확인하세요.`,
    },
    {
      key: "eligibility",
      title: "지원자격 및 요건",
      body: `중소기업 등 공고문에 명시된 법인·개인사업자가 대상입니다. 매출·종업원 수·업종 등 세부 기준과 결격사유(세금 체납 등)는 「${headline}」 공고문의 자격 요건표를 따릅니다. ${notice.field} 특성에 맞는 증빙이 요구될 수 있습니다.`,
    },
    {
      key: "announcement",
      title: "사업공고 및 신청",
      body: `공식 공고는 ${notice.ministry} 및 ${notice.agency} 안내 채널에서 확인합니다. 온라인 접수 기간은 ${period}로 안내되며, 신청 마감일은 ${notice.deadline}입니다. 접수 플랫폼·필수 동의 사항은 첨부 공고문의 신청 방법란을 따르세요.`,
    },
    {
      key: "documents",
      title: "신청서류",
      body: `사업신청서, 사업자등록증, 재무제표, 대표자 신분 확인, 참가 약정서 등 공고문 목록의 제출 서류를 준비합니다. 「${headline}」별로 추가 명세(실적·인력·장비 등)가 있을 수 있으니 PDF·HWP 명시 형식을 확인하세요.`,
    },
    {
      key: "submission",
      title: "제출양식 및 제출본",
      body: `지정 양식(엑셀·한글·PDF)에 맞춰 작성하고, 클릭 서명·날인·파일 용량 제한을 준수합니다. 온라인 제출 시 스캔본 해상도·파일명 규칙을 맞추고, 필요 시 우편·방문 제출 분기는 공고문의 제출 안내를 따릅니다.`,
    },
    {
      key: "targets",
      title: "사업대상",
      body: `${notice.field} 분야에서 사업 목적에 부합하는 기업·기관이 대상입니다. 「${headline}」의 모집 대상(지역·업종·규모)은 공고문 본문 및 별표를 기준으로 하며, 중복 지원 제한이 있으면 해당 조항을 확인하세요.`,
    },
    {
      key: "selection",
      title: "업체 선정 기준",
      body: `서류·발표 심사 등 공고문에 명시된 배점과 절차에 따라 선정합니다. 사업 타당성, 재무 안정성, 과제 수행 역량 등이 평가 항목에 포함될 수 있으며, ${notice.agency}의 최종 공지에 따릅니다. 세부 배점표는 첨부 공고문을 확인하세요.`,
    },
  ];
}
