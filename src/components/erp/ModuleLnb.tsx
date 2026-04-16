"use client";

import { Pin } from "lucide-react";
import type { ModuleSubmenuItem } from "@/config/erp-module-menus";
import { topBarIcons } from "./erp-icons";

const { RotateCw, Close } = topBarIcons;

export function ModuleLnb({
  title,
  items,
  selectedItemId,
  onSelectItem,
  onClose,
}: {
  title: string;
  items: ModuleSubmenuItem[];
  selectedItemId: string | null;
  onSelectItem: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <aside className="flex h-full min-h-0 w-full min-w-0 max-w-full shrink-0 flex-col border-r border-blue-900/30 bg-[#1d4ed8] text-white shadow-inner">
      <header className="flex min-w-0 items-center justify-between gap-2 border-b border-white/10 px-3 py-3">
        <span className="min-w-0 truncate text-sm font-bold tracking-tight">{title}</span>
        <div className="flex shrink-0 items-center gap-1 text-white/90">
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
            aria-label="고정"
          >
            <Pin className="h-4 w-4" aria-hidden />
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
      <nav className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overflow-x-auto py-3 text-sm">
        <div className="min-w-0 px-2">
          {items.map((item) => {
            const active = selectedItemId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectItem(item.id)}
                className={`block w-full whitespace-nowrap border-b border-white/10 px-2 py-2.5 text-left transition last:border-b-0 ${
                  active ? "bg-white/15 font-semibold" : "hover:bg-white/10"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
