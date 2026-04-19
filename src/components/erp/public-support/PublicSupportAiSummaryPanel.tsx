"use client";

import {
  ClipboardList,
  ListOrdered,
  Target,
  CircleDot,
  Megaphone,
  Send,
  FileText,
  FolderOpen,
  ClipboardCheck,
  Upload,
  Users,
  Factory,
  Scale,
  BadgeCheck,
  Sparkles,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useId, useRef } from "react";
import type { PublicSupportNotice } from "@/data/publicSupportMock";
import {
  formatPublicNoticeId,
  getAiThreeLineSummary,
  getDemoSummarySections,
  getSummaryHeaderBadges,
  type DemoSummarySection,
  type SummaryPart,
  type SummarySectionKey,
} from "@/lib/publicSupportDemoSummary";

const SECTION_ICONS: Record<
  SummarySectionKey,
  readonly [LucideIcon, LucideIcon]
> = {
  overview: [ClipboardList, ListOrdered],
  eligibility: [Target, CircleDot],
  announcement: [Megaphone, Send],
  documents: [FileText, FolderOpen],
  submission: [ClipboardCheck, Upload],
  targets: [Users, Factory],
  selection: [Scale, BadgeCheck],
};

const BADGE_STYLES = [
  "bg-indigo-100 text-indigo-900 ring-1 ring-indigo-200/80",
  "bg-slate-100 text-slate-800 ring-1 ring-slate-200/80",
  "bg-violet-100 text-violet-900 ring-1 ring-violet-200/80",
] as const;

function SummaryParts({ parts }: { parts: SummaryPart[] }) {
  return (
    <>
      {parts.map((p, i) => (
        <span
          key={i}
          className={
            p.emphasis === "keyword"
              ? "font-bold text-blue-600"
              : "text-zinc-800"
          }
        >
          {p.text}
        </span>
      ))}
    </>
  );
}

function SectionIcons({ section }: { section: DemoSummarySection }) {
  const pair = SECTION_ICONS[section.key];
  if (!pair) return null;
  const [A, B] = pair;
  return (
    <span className="inline-flex shrink-0 items-center gap-1" aria-hidden>
      <A className="h-4 w-4 text-amber-600" />
      <B className="h-4 w-4 text-sky-600" />
    </span>
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

  const sections = getDemoSummarySections(notice);
  const threeLine = getAiThreeLineSummary(notice);
  const headerBadges = getSummaryHeaderBadges(notice);
  const displayId = formatPublicNoticeId(notice.id);
  const headline =
    notice.title.indexOf("\n") === -1
      ? notice.title
      : notice.title.slice(0, notice.title.indexOf("\n"));

  return (
    <div className="fixed inset-0 z-[95]" role="presentation">
      <div
        className="absolute inset-0 bg-zinc-900/40 backdrop-blur-[2px]"
        role="presentation"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="absolute right-0 top-0 flex h-full w-[min(42vw,30rem)] max-w-full flex-col border-l border-zinc-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 flex-col gap-2.5 border-b border-zinc-100 px-4 pb-4 pt-4">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-medium tracking-wide text-zinc-500">
              AI 요약
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-sm hover:bg-zinc-50"
              aria-label="닫기"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <h2
            id={titleId}
            className="text-base font-bold leading-snug tracking-tight text-zinc-900"
          >
            {headline}
          </h2>
          <div className="flex flex-wrap gap-2">
            {headerBadges.map((label, i) => (
              <span
                key={`${label}-${i}`}
                className={`inline-flex max-w-full truncate rounded-full px-2.5 py-0.5 text-xs font-medium ${BADGE_STYLES[i % BADGE_STYLES.length]}`}
              >
                {label}
              </span>
            ))}
          </div>
          <p className="text-xs leading-relaxed text-zinc-500">
            공고 ID :{" "}
            <span className="font-semibold text-zinc-700">{displayId}</span>
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6">
          <div className="flex flex-col gap-6">
            {/* AI 3줄 요약 하이라이트 */}
            <section
              className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50 px-4 py-4 shadow-sm"
              aria-label="AI 3줄 요약"
            >
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                  <Sparkles className="h-4 w-4" aria-hidden />
                </span>
                <h3 className="text-sm font-bold tracking-tight text-indigo-950">
                  AI 3줄 요약
                </h3>
              </div>
              <ol className="list-none space-y-4">
                {threeLine.lines.map((line, i) => (
                  <li
                    key={i}
                    className="flex gap-3 leading-loose text-sm text-zinc-800"
                  >
                    <span
                      className="mt-0.5 flex h-7 min-w-[1.75rem] shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-indigo-700 shadow-sm ring-1 ring-indigo-100"
                      aria-hidden
                    >
                      {i + 1}
                    </span>
                    <span className="min-w-0 pt-0.5">
                      <SummaryParts parts={line} />
                    </span>
                  </li>
                ))}
              </ol>
            </section>

            {/* 7개 섹션 */}
            {sections.map((section) => (
              <section
                key={section.key}
                className="rounded-xl bg-zinc-50 px-4 py-4 text-sm ring-1 ring-zinc-100"
              >
                <div className="mb-4 flex items-center gap-2 border-b border-zinc-100/80 pb-3">
                  <SectionIcons section={section} />
                  <h3 className="text-sm font-semibold tracking-tight text-zinc-900">
                    {section.title}
                  </h3>
                </div>
                <ul className="space-y-3.5 leading-loose text-zinc-800">
                  {section.bullets.map((bullet, j) => (
                    <li key={j} className="flex gap-2.5">
                      <span
                        className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500/90"
                        aria-hidden
                      />
                      <div className="min-w-0 flex-1">
                        <span className="font-semibold text-zinc-600">
                          {bullet.label}
                        </span>
                        <span className="text-zinc-400"> : </span>
                        <span className="inline leading-loose">
                          <SummaryParts parts={bullet.parts} />
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
