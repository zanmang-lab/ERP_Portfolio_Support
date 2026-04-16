"use client";

import { Monitor } from "lucide-react";

export function FloatingActionButton() {
  return (
    <button
      type="button"
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-white shadow-lg transition hover:bg-zinc-700"
      aria-label="빠른 실행"
      onClick={() => {
        // MVP: no backend action
      }}
    >
      <Monitor className="h-5 w-5" />
    </button>
  );
}
