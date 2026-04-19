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

/** UI에서 keyword → 포인트 컬러·볼드 매핑 */
export type SummaryPart = {
  text: string;
  emphasis?: "keyword";
};

export type SummaryLine = SummaryPart[];

export type SummaryBullet = {
  label: string;
  parts: SummaryPart[];
};

export type DemoSummarySection = {
  key: SummarySectionKey;
  title: string;
  bullets: SummaryBullet[];
};

export type AiThreeLineSummary = {
  lines: readonly [SummaryLine, SummaryLine, SummaryLine];
};

function kw(text: string): SummaryPart {
  return { text, emphasis: "keyword" };
}

function tx(text: string): SummaryPart {
  return { text };
}

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

/** 패널 헤더 칩용 — 실제 메타만 (가짜 지역·유형 라벨 없음) */
export function getSummaryHeaderBadges(notice: PublicSupportNotice): string[] {
  return [notice.field, notice.ministry, "공공지원"];
}

/**
 * 메타데이터만 반영한 3줄 스냅샷 (데모)
 */
export function getAiThreeLineSummary(
  notice: PublicSupportNotice,
): AiThreeLineSummary {
  const headline = titleHeadline(notice.title);
  const idLine = formatPublicNoticeId(notice.id);
  const period = formatApplicationPeriod(notice);

  return {
    lines: [
      [
        kw(`「${headline}」`),
        tx(` · `),
        kw(notice.field),
        tx(` 분야 공모. `),
        tx(`공고 ID `),
        kw(idLine),
        tx(`\.`),
      ],
      [
        tx(`주관 `),
        kw(notice.ministry),
        tx(` · 수행 `),
        kw(notice.agency),
        tx(`\. `),
        tx(`신청기간 `),
        kw(period),
        tx(`\.`),
      ],
      [
        tx(`신청 마감 `),
        kw(notice.deadline),
        tx(`\. `),
        tx(`세부 조건·서류는 `),
        kw("첨부 공고문"),
        tx(` 기준으로 확인하세요.`),
      ],
    ],
  };
}

/**
 * 실제 공고문 파싱 없이, 메타데이터만 반영한 7블록 데모 요약 (불릿)
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
      bullets: [
        {
          label: "사업·분야",
          parts: [
            kw(notice.field),
            tx(` · `),
            kw(`「${headline}」`),
            tx(` · `),
            tx(`ID `),
            kw(idLine),
          ],
        },
        {
          label: "주관 / 수행",
          parts: [kw(notice.ministry), tx(` · `), kw(notice.agency)],
        },
        {
          label: "신청기간",
          parts: [kw(period), tx(` · 프로그램 구성은 `), kw("첨부 공고문")],
        },
      ],
    },
    {
      key: "eligibility",
      title: "지원자격 및 요건",
      bullets: [
        {
          label: "대상",
          parts: [
            tx(`법인·개인사업자 등 `),
            kw("공고문 요건표"),
            tx(` 부합`),
          ],
        },
        {
          label: "결격 사유",
          parts: [
            kw("세금 체납"),
            tx(` 등 공고문 결격 조항 확인 (실제 적용은 공고문 기준)`),
          ],
        },
        {
          label: "세부 기준",
          parts: [
            tx(`규모·실적· `),
            kw(notice.field),
            tx(` 관련 증빙은 `),
            kw(`「${headline}」`),
            tx(` 별표·별지`),
          ],
        },
      ],
    },
    {
      key: "announcement",
      title: "사업공고 및 신청",
      bullets: [
        {
          label: "공고 채널",
          parts: [
            kw(notice.ministry),
            tx(` · `),
            kw(notice.agency),
            tx(` 공식 안내`),
          ],
        },
        {
          label: "접수 기간",
          parts: [kw(period)],
        },
        {
          label: "마감일",
          parts: [
            kw(notice.deadline),
            tx(` · 접수처·동의 사항은 공고문 `),
            kw("신청 방법"),
            tx(` 란`),
          ],
        },
      ],
    },
    {
      key: "documents",
      title: "신청서류",
      bullets: [
        {
          label: "기본",
          parts: [
            kw("사업신청서"),
            tx(` · `),
            kw("사업자등록증"),
            tx(` · `),
            kw("재무·신분"),
            tx(` 등 공고문 목록`),
          ],
        },
        {
          label: "추가·형식",
          parts: [
            kw(`「${headline}」`),
            tx(` 기준 추가 서류· `),
            kw("PDF/HWP"),
            tx(` 명시 양식 준수`),
          ],
        },
      ],
    },
    {
      key: "submission",
      title: "제출양식 및 제출본",
      bullets: [
        {
          label: "양식",
          parts: [
            kw("지정 서식"),
            tx(` 작성 · `),
            kw("서명·날인"),
            tx(` · 파일 용량 제한 준수`),
          ],
        },
        {
          label: "제출 경로",
          parts: [
            kw("온라인"),
            tx(` 스캔 화질·파일명 규칙 · `),
            kw("우편·방문"),
            tx(` 분기는 공고문 제출 안내`),
          ],
        },
      ],
    },
    {
      key: "targets",
      title: "사업대상",
      bullets: [
        {
          label: "분야·목적",
          parts: [
            kw(notice.field),
            tx(` 분야에서 사업 목적에 부합하는 `),
            kw("기업·기관"),
          ],
        },
        {
          label: "제한",
          parts: [
            kw("지역·업종·중복 지원"),
            tx(` 한도는 공고문 본문·별표`),
          ],
        },
      ],
    },
    {
      key: "selection",
      title: "업체 선정 기준",
      bullets: [
        {
          label: "평가",
          parts: [
            kw("서류·발표 심사"),
            tx(` 등 공고문 `),
            kw("배점·절차"),
            tx(` · 타당성·재무·수행 역량`),
          ],
        },
        {
          label: "문의·확정",
          parts: [
            kw(notice.agency),
            tx(` 공지 최종 반영 · 세부는 `),
            kw("첨부 공고문"),
          ],
        },
      ],
    },
  ];
}
