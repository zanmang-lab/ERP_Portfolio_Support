"use client";

import type { SetupLnbItem } from "@/config/erp-ui";
import { topBarIcons } from "./erp-icons";

const { RotateCw, ExternalLink, Close } = topBarIcons;

export function SetupLnb({
  title,
  items,
  selectedLnbId,
  onSelectItem,
  onClose,
}: {
  title: string;
  items: SetupLnbItem[];
  selectedLnbId: string | null;
  onSelectItem: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <aside className="flex h-full min-h-0 w-full min-w-0 max-w-full shrink-0 flex-col border-r border-blue-900/30 bg-[#1d4ed8] text-white shadow-inner">
      <header className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-3">
        <span className="text-sm font-bold tracking-tight">{title}</span>
        <div className="flex items-center gap-1 text-white/90">
          <button
            type="button"
            className="rounded p-1 hover:bg-white/10"
            aria-label="새로고침"
          >
            <RotateCw className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="rounded p-1 hover:bg-white/10"
            aria-label="새 창"
          >
            <ExternalLink className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="rounded p-1 hover:bg-white/10"
            aria-label="닫기"
            onClick={onClose}
          >
            <Close className="h-4 w-4" />
          </button>
        </div>
      </header>
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 py-3 text-sm">
        {items.map((item) => {
          const active = selectedLnbId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectItem(item.id)}
              className={`rounded-md px-2 py-2 text-left transition ${
                active ? "bg-white/15 font-semibold" : "hover:bg-white/10"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
