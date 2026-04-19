import type { PublicSupportNotice } from "@/data/publicSupportMock";
import { formatApplicationPeriod } from "@/data/publicSupportMock";
import {
  formatDdayLabel,
  getDaysUntilDeadline,
} from "@/lib/supportDeadline";

/** UI: keyword=blue-600, danger=red-600 (D-Day 등) */
export type SummaryPart = {
  text: string;
  emphasis?: "keyword" | "danger";
};

export type LabeledPartsRow = {
  label: string;
  parts: SummaryPart[];
};

export type BracketRow = {
  bracket: string;
  parts: SummaryPart[];
};

/**
 * 실제 공고문/LLM 없음 — 목록 메타만으로 구성된 3그룹 데모 요약
 */
export type AiSummaryGrouped = {
  briefing: {
    rows: LabeledPartsRow[];
    aiCommentParts: SummaryPart[];
  };
  schedule: {
    /** 점 형식 신청기간 문자열 */
    periodDots: string;
    /** formatDdayLabel 결과, 예: D-11 */
    ddayLabel: string;
    bullets: SummaryPart[][];
  };
  criteria: {
    bracketRows: BracketRow[];
  };
};

function kw(text: string): SummaryPart {
  return { text, emphasis: "keyword" };
}

function dg(text: string): SummaryPart {
  return { text, emphasis: "danger" };
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

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** 예: 2026.04.10 ~ 04.30 (동일 연도면 끝만 월.일) */
export function formatPeriodDots(notice: PublicSupportNotice): string {
  const ps = notice.periodStart.slice(0, 10).split("-").map(Number);
  const pe = notice.periodEnd.slice(0, 10).split("-").map(Number);
  const [sy, sm, sd] = ps;
  const [ey, em, ed] = pe;
  const start = `${sy}.${pad2(sm ?? 1)}.${pad2(sd ?? 1)}`;
  const end =
    ey === sy ? `${pad2(em ?? 1)}.${pad2(ed ?? 1)}` : `${ey}.${pad2(em ?? 1)}.${pad2(ed ?? 1)}`;
  return `${start} ~ ${end}`;
}

/** 마감까지 일수 기반 데모 코멘트(LLM 없음) */
function buildAiCommentParts(notice: PublicSupportNotice): SummaryPart[] {
  const days = getDaysUntilDeadline(notice.deadline);
  if (days < 0) {
    return [
      tx("마감일 경과 가능성 있음 · 최종 확인은 "),
      kw("첨부 공고문"),
      tx(" 및 기관 안내."),
    ];
  }
  if (days === 0) {
    return [
      dg("오늘 마감"),
      tx(" · 제출 마감 시각까지 "),
      kw("서류 완결"),
      tx(" 확인."),
    ];
  }
  if (days <= 3) {
    return [
      dg(`마감 임박 (${days}일 남음)`),
      tx(" · 누락 서류 없는지 "),
      kw("공고문 목록"),
      tx(" 재점검."),
    ];
  }
  if (days <= 14) {
    return [
      tx(`마감까지 약 ${days}일 · `),
      kw("신청서·증빙"),
      tx(" 준비를 서두르세요."),
    ];
  }
  return [
    tx("마감까지 여유 있음 · 세부 요건은 "),
    kw("첨부 공고문"),
    tx(" 및 "),
    kw(notice.agency),
    tx(" 공지 확인."),
  ];
}

/** 패널 헤더 칩용 — 실제 메타만 */
export function getSummaryHeaderBadges(notice: PublicSupportNotice): string[] {
  return [notice.field, notice.ministry, "공공지원"];
}

export function getGroupedAiSummary(notice: PublicSupportNotice): AiSummaryGrouped {
  const headline = titleHeadline(notice.title);
  const idLine = formatPublicNoticeId(notice.id);
  const periodDots = formatPeriodDots(notice);
  const periodIso = formatApplicationPeriod(notice);
  const daysUntil = getDaysUntilDeadline(notice.deadline);
  const ddayLabel = formatDdayLabel(daysUntil);

  return {
    briefing: {
      rows: [
        {
          label: "사업명",
          parts: [kw(`「${headline}」`)],
        },
        {
          label: "분야 · 공고 ID",
          parts: [kw(notice.field), tx(` · `), kw(idLine)],
        },
        {
          label: "주관 · 수행",
          parts: [kw(notice.ministry), tx(` · `), kw(notice.agency)],
        },
        {
          label: "신청기간(개요)",
          parts: [
            kw(periodIso),
            tx(` · 프로그램·세부는 `),
            kw("첨부 공고문"),
          ],
        },
      ],
      aiCommentParts: buildAiCommentParts(notice),
    },
    schedule: {
      periodDots,
      ddayLabel,
      bullets: [
        [
          tx("• 공고 · 접수 "),
          kw(notice.ministry),
          tx(" / "),
          kw(notice.agency),
          tx(" 채널 확인"),
        ],
        [
          tx("• 마감 "),
          kw(notice.deadline),
          tx(" · 접수처·동의는 공고문 "),
          kw("신청 방법"),
        ],
        [
          tx("• 서류 "),
          kw("신청서·사업자·재무·신분"),
          tx(" 등 공고문 목록 · 추가는 "),
          kw(`「${headline}」`),
          tx(" 별표"),
        ],
        [
          tx("• 제출 "),
          kw("지정 양식"),
          tx(" · 서명·날인 · "),
          kw("온라인"),
          tx("/우편 분기는 공고문"),
        ],
      ],
    },
    criteria: {
      bracketRows: [
        {
          bracket: "대상",
          parts: [
            kw(notice.field),
            tx(` 분야 `),
            kw("기업·기관"),
            tx(" · 공고문 요건표 부합"),
          ],
        },
        {
          bracket: "결격",
          parts: [
            kw("세금 체납"),
            tx(" 등 공고문 결격 조항 · 실제 적용은 공고문 기준"),
          ],
        },
        {
          bracket: "제한",
          parts: [
            kw("지역·업종·중복 지원"),
            tx(" 한도 · 본문·별표"),
          ],
        },
        {
          bracket: "기준",
          parts: [
            kw("서류·발표 심사"),
            tx(" · 배점·절차는 공고문 · 최종 "),
            kw(notice.agency),
          ],
        },
      ],
    },
  };
}
