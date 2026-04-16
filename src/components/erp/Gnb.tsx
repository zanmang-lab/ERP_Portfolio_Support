"use client";

import { gnbModuleItems, gnbToolItems } from "@/config/erp-ui";
import { GnbIcon } from "./erp-icons";

export function Gnb({
  selectedGnbId,
  onSelectModule,
}: {
  selectedGnbId: string | null;
  onSelectModule: (id: string) => void;
}) {
  return (
    <aside className="flex h-full min-w-0 w-[min(5rem,100%)] max-w-[6rem] shrink-0 flex-col overflow-x-hidden bg-[#2563EB] text-white">
      <div className="flex flex-col items-center gap-2 border-b border-white/15 py-3">
        {gnbToolItems.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-label={item.ariaLabel}
            className="flex h-10 w-10 items-center justify-center rounded-md text-white/90 transition hover:bg-white/10"
          >
            <GnbIcon iconKey={item.iconKey} className="h-5 w-5" />
          </button>
        ))}
      </div>
      <nav className="flex min-h-0 flex-1 flex-col items-center gap-1 overflow-y-auto overflow-x-hidden py-2">
        {gnbModuleItems.map((item) => {
          const selected = selectedGnbId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectModule(item.id)}
              className={`flex min-w-0 w-full max-w-full flex-col items-center gap-1 px-1 py-2 text-[0.625rem] font-medium leading-tight transition ${
                selected
                  ? "border-l-4 border-rose-400 bg-blue-900/40"
                  : "border-l-4 border-transparent hover:bg-white/10"
              }`}
            >
              <GnbIcon iconKey={item.iconKey} className="h-5 w-5 shrink-0" />
              <span
                className="line-clamp-2 min-w-0 max-w-full break-words text-center"
                title={item.label}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
      <div className="flex justify-center border-t border-white/15 py-2">
        <button
          type="button"
          aria-label="더 보기"
          className="flex h-9 w-9 items-center justify-center rounded-md text-white/80 hover:bg-white/10"
        >
          <GnbIcon iconKey="chevronDown" className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}
