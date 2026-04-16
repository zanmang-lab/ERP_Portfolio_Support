"use client";

import { topBarIcons } from "./erp-icons";

const I = topBarIcons;

export function TopBar({
  mode,
  pageTitle,
}: {
  mode: "default" | "workflow";
  pageTitle?: string;
}) {
  return (
    <header className="flex h-12 w-full min-w-0 shrink-0 items-center justify-between gap-2 border-b border-zinc-200 bg-white px-3">
      <div className="flex min-w-0 flex-1 items-center gap-2 text-zinc-600">
        <button
          type="button"
          className="rounded p-1.5 hover:bg-zinc-100"
          aria-label="홈"
        >
          <I.Home className="h-4 w-4" />
        </button>
        {mode === "workflow" ? (
          <>
            <button
              type="button"
              className="rounded p-1.5 hover:bg-zinc-100"
              aria-label="폴더"
            >
              <I.Folder className="h-4 w-4" />
            </button>
            {pageTitle ? (
              <span className="ml-1 flex min-w-0 items-center gap-1.5 text-sm font-semibold text-zinc-800">
                <I.Box className="h-4 w-4 shrink-0 text-blue-700" aria-hidden />
                <span className="truncate">{pageTitle}</span>
              </span>
            ) : (
              <button
                type="button"
                className="rounded p-1.5 hover:bg-zinc-100"
                aria-label="모듈"
              >
                <I.Box className="h-4 w-4" />
              </button>
            )}
          </>
        ) : (
          <>
            <button
              type="button"
              className="rounded p-1.5 hover:bg-zinc-100"
              aria-label="업무함"
            >
              <I.Package className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="rounded p-1.5 hover:bg-zinc-100"
              aria-label="즐겨찾기"
            >
              <I.Star className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-3 rounded-md bg-[#1E40AF] px-3 py-1.5 text-white">
        <button type="button" className="rounded p-1 hover:bg-white/10" aria-label="검색">
          <I.Search className="h-4 w-4" />
        </button>
        <button type="button" className="rounded p-1 hover:bg-white/10" aria-label="프로필">
          <I.User className="h-4 w-4" />
        </button>
        <button type="button" className="rounded p-1 hover:bg-white/10" aria-label="알림">
          <I.Bell className="h-4 w-4" />
        </button>
        <button type="button" className="rounded p-1 hover:bg-white/10" aria-label="도움말">
          <I.HelpCircle className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
