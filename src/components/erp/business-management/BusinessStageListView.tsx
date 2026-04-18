"use client";

import { ChevronLeft } from "lucide-react";

export function BusinessStageListView({
  title,
  onBack,
}: {
  title: string;
  onBack: () => void;
}) {
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
        <h1 className="text-base font-semibold text-zinc-900">{title}</h1>
      </header>
      <div className="min-h-0 flex-1 overflow-auto p-4">
        <div className="mx-auto max-w-4xl rounded-lg border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-500 shadow-sm">
          데모 환경입니다. 연동된 사업 목록이 있으면 이 영역에 표 형태로 표시됩니다.
        </div>
      </div>
    </div>
  );
}
