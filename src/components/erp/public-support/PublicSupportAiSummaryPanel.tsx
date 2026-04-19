"use client";

import { Calendar, Sparkles, Target, X } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import type { PublicSupportNotice } from "@/data/publicSupportMock";
import {
  formatPublicNoticeId,
  getGroupedAiSummary,
  getSummaryHeaderBadges,
  type LabeledPartsRow,
  type SummaryPart,
} from "@/lib/publicSupportDemoSummary";

function SummaryParts({ parts }: { parts: SummaryPart[] }) {
  return (
    <>
      {parts.map((p, i) => (
        <span
          key={i}
          className={
            p.emphasis === "keyword"
              ? "font-semibold text-blue-600"
              : p.emphasis === "danger"
                ? "font-semibold text-red-600"
                : "font-semibold text-gray-900"
          }
        >
          {p.text}
        </span>
      ))}
    </>
  );
}

function BriefingRow({ row }: { row: LabeledPartsRow }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-4">
      <span className="shrink-0 text-xs font-medium text-gray-500 sm:min-w-[6.5rem]">
        {row.label}
      </span>
      <div className="min-w-0 text-sm leading-relaxed text-gray-900">
        <SummaryParts parts={row.parts} />
      </div>
    </div>
  );
}

type PublicSupportAiSummaryPanelProps = {
  notice: PublicSupportNotice | null;
  open: boolean;
  onClose: () => void;
};

export function PublicSupportAiSummaryPanel({
  notice,
  open,
  onClose,
}: PublicSupportAiSummaryPanelProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !notice) return null;

  const grouped = getGroupedAiSummary(notice);
  const headerBadges = getSummaryHeaderBadges(notice);
  const displayId = formatPublicNoticeId(notice.id);
  const headline =
    notice.title.indexOf("\n") === -1
      ? notice.title
      : notice.title.slice(0, notice.title.indexOf("\n"));

  return (
    <div className="fixed inset-0 z-[95]" role="presentation">
      <div
        className="absolute inset-0 bg-zinc-900/35 backdrop-blur-[1px]"
        role="presentation"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="absolute right-0 top-0 flex h-full w-[min(42vw,30rem)] max-w-full flex-col border-l border-gray-200 bg-slate-50 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 flex-col gap-3 border-b border-gray-200 bg-slate-50 px-4 pb-4 pt-4">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-medium tracking-wide text-gray-500">
              AI 요약
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50"
              aria-label="닫기"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <h2
            id={titleId}
            className="text-base font-bold leading-snug tracking-tight text-slate-900"
          >
            {headline}
          </h2>
          <div className="flex flex-wrap gap-2">
            {headerBadges.map((label, i) => (
              <span
                key={`${label}-${i}`}
                className="inline-flex max-w-full truncate rounded-full border border-gray-200 bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700"
              >
                {label}
              </span>
            ))}
          </div>
          <p className="text-xs leading-relaxed text-gray-500">
            공고 ID :{" "}
            <span className="font-semibold text-gray-800">{displayId}</span>
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-8">
          <div className="flex flex-col gap-y-10">
            {/* 그룹 A */}
            <section
              className="rounded-lg border border-gray-200 bg-stone-50 px-4 py-5 shadow-sm"
              aria-label="AI 핵심 브리핑"
            >
              <div className="mb-5 flex items-center gap-2">
                <Sparkles
                  className="h-4 w-4 shrink-0 text-slate-500"
                  aria-hidden
                />
                <h3 className="text-sm font-semibold tracking-tight text-slate-900">
                  AI 핵심 브리핑
                </h3>
              </div>
              <div className="space-y-4 leading-loose">
                {grouped.briefing.rows.map((row, i) => (
                  <BriefingRow key={i} row={row} />
                ))}
              </div>
              <div className="mt-6 border-t border-gray-200/80 pt-4">
                <p className="mb-2 text-xs font-medium text-gray-500">
                  AI 분석 코멘트
                </p>
                <p className="text-sm leading-loose text-slate-800">
                  <SummaryParts parts={grouped.briefing.aiCommentParts} />
                </p>
              </div>
            </section>

            {/* 그룹 B */}
            <section
              className="rounded-lg border border-gray-200 bg-white px-4 py-5 shadow-sm"
              aria-label="주요 일정 및 신청"
            >
              <div className="mb-5 flex items-center gap-2">
                <Calendar
                  className="h-4 w-4 shrink-0 text-slate-500"
                  aria-hidden
                />
                <h3 className="text-sm font-semibold tracking-tight text-slate-900">
                  주요 일정 및 신청
                </h3>
              </div>

              <div className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-2 border-b border-gray-100 pb-5">
                <span className="text-sm text-gray-500">신청기간</span>
                <span className="text-sm font-semibold text-gray-900">
                  {grouped.schedule.periodDots}
                </span>
                <span
                  className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600 ring-1 ring-red-100"
                  aria-label={`D-Day ${grouped.schedule.ddayLabel}`}
                >
                  {grouped.schedule.ddayLabel}
                </span>
              </div>

              <ul className="space-y-3 text-sm leading-loose text-slate-800">
                {grouped.schedule.bullets.map((parts, i) => (
                  <li key={i} className="pl-0.5">
                    <SummaryParts parts={parts} />
                  </li>
                ))}
              </ul>
            </section>

            {/* 그룹 C */}
            <section
              className="rounded-lg border border-gray-200 bg-white px-4 py-5 shadow-sm"
              aria-label="지원 조건 및 심사"
            >
              <div className="mb-5 flex items-center gap-2">
                <Target
                  className="h-4 w-4 shrink-0 text-slate-500"
                  aria-hidden
                />
                <h3 className="text-sm font-semibold tracking-tight text-slate-900">
                  지원 조건 및 심사
                </h3>
              </div>
              <div className="space-y-4">
                {grouped.criteria.bracketRows.map((row, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-3"
                  >
                    <span className="inline-flex min-w-[3.25rem] shrink-0 rounded-md bg-gray-100 px-2 py-0.5 text-center text-xs font-medium text-gray-500">
                      [{row.bracket}]
                    </span>
                    <div className="min-w-0 flex-1 text-sm leading-loose">
                      <SummaryParts parts={row.parts} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </aside>
    </div>
  );
}
