"use client";

import { Fragment } from "react";
import type { WorkflowRow as WorkflowRowModel } from "@/config/erp-ui";
import { TaskCard } from "./TaskCard";

/** 아래 볼록 V 깊이(px) — 상단 홈과 맞물릴 때 음수 margin(~10px)과 함께 튜닝 */
const CHEVRON_TIP_D = 16;
/** 위 오목 V 꼭짓점 깊이(px) */
const CHEVRON_TOP_P = 14;

/**
 * 원본: 첫 행 평상단+하단V, 중간 상단오목+하단V, 마지막 상단오목+평하단
 */
function purpleClipPath(position: "first" | "middle" | "last"): string {
  const d = CHEVRON_TIP_D;
  const p = CHEVRON_TOP_P;
  const topNotch = `0% 0%, 34% 0%, 50% ${p}px, 66% 0%, 100% 0%`;
  const bottomTip = `100% calc(100% - ${d}px), 50% 100%, 0% calc(100% - ${d}px)`;

  if (position === "first") {
    return `polygon(0% 0%, 100% 0%, 100% calc(100% - ${d}px), 50% 100%, 0% calc(100% - ${d}px))`;
  }
  if (position === "last") {
    return `polygon(${topNotch}, 100% 100%, 0% 100%)`;
  }
  return `polygon(${topNotch}, ${bottomTip})`;
}

export function WorkflowRow({
  row,
  rowPosition = "middle",
  stackUp = false,
  stackDepth = 0,
}: {
  row: WorkflowRowModel;
  rowPosition?: "first" | "middle" | "last";
  /** 아래 행을 위 행 V에 맞물리도록 살짝 겹침 */
  stackUp?: boolean;
  /** 겹침 시 paint 순서 */
  stackDepth?: number;
}) {
  const arrows = row.arrowAfterStepIds ?? [];
  const steps = row.steps;

  return (
    <div
      className={`relative flex w-max max-w-none shrink-0 overflow-hidden rounded-r-md border border-zinc-300 bg-white shadow-sm ${
        stackUp ? "-mt-[10px]" : ""
      }`}
      style={stackUp ? { zIndex: 10 + stackDepth } : undefined}
    >
      <div className="relative w-[5.75rem] shrink-0 self-stretch border-r border-purple-200/90">
        <div
          className="pointer-events-none absolute inset-0 bg-purple-100"
          aria-hidden
        />
        <div
          className="relative z-10 flex min-h-full min-w-0 flex-col items-center justify-center bg-purple-100 px-2.5 py-3.5 text-center text-sm font-semibold leading-snug text-purple-900"
          style={{ clipPath: purpleClipPath(rowPosition) }}
        >
          <span className="select-none whitespace-nowrap">{row.categoryLabel}</span>
        </div>
      </div>
      <div className="relative z-10 flex min-h-0 min-w-0 shrink-0 flex-nowrap items-center self-stretch bg-white py-2.5 pl-4 pr-5">
        {steps.map((step, i) => (
          <Fragment key={step.id}>
            <TaskCard step={step} />
            {i < steps.length - 1 ? (
              <div
                className="flex min-w-[3rem] w-14 shrink-0 items-center justify-center text-sm font-medium leading-none text-zinc-700"
                aria-hidden={!arrows.includes(step.id)}
              >
                {arrows.includes(step.id) ? "→" : null}
              </div>
            ) : null}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
