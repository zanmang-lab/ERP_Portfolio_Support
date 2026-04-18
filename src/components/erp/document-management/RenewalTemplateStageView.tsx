"use client";

import { useCallback } from "react";
import { ChevronLeft, Download } from "lucide-react";
import {
  buildRenewalPlaceholderBody,
  RENEWAL_DOWNLOAD_FORMATS,
  RENEWAL_TEMPLATE_FIELD_LABELS,
  RENEWAL_TEMPLATE_PREVIEW_TITLE,
} from "@/data/renewalTemplateMock";

const DOWNLOAD_FILENAME_BASE = "사업계획서_양식";

export function RenewalTemplateStageView({
  onBack,
}: {
  onBack: () => void;
}) {
  const handleDownload = useCallback((ext: string) => {
    const body = buildRenewalPlaceholderBody(ext);
    const blob = new Blob([body], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${DOWNLOAD_FILENAME_BASE}.${ext}`;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, []);

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-gray-50">
      <header className="flex shrink-0 items-center gap-3 border-b border-zinc-200 bg-gray-50 px-4 py-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-800 shadow-sm transition hover:bg-zinc-50"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
          뒤로가기
        </button>
        <h1 className="text-base font-semibold text-zinc-900">
          매사업 갱신 서류
        </h1>
      </header>

      <div className="min-h-0 flex-1 overflow-auto p-4">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
          <section
            className="min-w-0 flex-1"
            aria-labelledby="renewal-preview-heading"
          >
            <h2
              id="renewal-preview-heading"
              className="mb-3 text-sm font-semibold text-zinc-800"
            >
              {RENEWAL_TEMPLATE_PREVIEW_TITLE}
            </h2>
            <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-md ring-1 ring-zinc-100">
              <ul className="space-y-4 text-sm text-zinc-800">
                {RENEWAL_TEMPLATE_FIELD_LABELS.map((label) => (
                  <li key={label}>
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
                      <span className="shrink-0 font-medium text-zinc-700">
                        {label}:
                      </span>
                      <span
                        className="min-h-[1.25rem] min-w-0 flex-1 border-b border-dotted border-zinc-400 pb-0.5"
                        aria-label={`${label} 빈칸`}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <aside
            className="w-full shrink-0 lg:w-72"
            aria-label="양식 파일 형식별 다운로드"
          >
            <h2 className="mb-3 text-sm font-semibold text-zinc-800">
              다운로드
            </h2>
            <ul className="flex flex-col gap-2">
              {RENEWAL_DOWNLOAD_FORMATS.map(({ ext, label }) => (
                <li key={ext}>
                  <button
                    type="button"
                    onClick={() => handleDownload(ext)}
                    className="flex w-full items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 text-left text-sm text-zinc-800 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50"
                    aria-label={`${ext}로 다운로드`}
                  >
                    <span>{label}</span>
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded border border-zinc-200 bg-zinc-50 text-emerald-700">
                      <Download className="h-5 w-5" aria-hidden />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}
