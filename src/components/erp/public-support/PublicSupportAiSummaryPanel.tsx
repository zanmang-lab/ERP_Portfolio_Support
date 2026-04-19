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
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useId, useRef } from "react";
import type { PublicSupportNotice } from "@/data/publicSupportMock";
import {
  formatPublicNoticeId,
  getDemoSummarySections,
  type DemoSummarySection,
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
        className="absolute right-0 top-0 flex h-full w-[min(40vw,28rem)] max-w-full flex-col border-l border-zinc-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 flex-col gap-2 border-b border-zinc-100 px-4 pb-3 pt-3">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-medium text-zinc-500">AI 요약</p>
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
          <h2 id={titleId} className="text-base font-bold leading-snug text-zinc-900">
            {headline}
          </h2>
          <p className="text-xs text-zinc-500">공고 ID : {displayId}</p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          <div className="flex flex-col gap-3">
            {sections.map((section) => (
              <section
                key={section.key}
                className="rounded-lg bg-zinc-50 px-3 py-3 text-sm text-zinc-800"
              >
                <div className="mb-2 flex items-center gap-2">
                  <SectionIcons section={section} />
                  <h3 className="text-sm font-semibold text-zinc-900">
                    {section.title}
                  </h3>
                </div>
                <p className="leading-relaxed text-zinc-700">{section.body}</p>
              </section>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
