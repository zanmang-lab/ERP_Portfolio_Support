"use client";

import {
  Activity,
  CheckCircle2,
  Clock,
  Keyboard,
  Monitor,
  Send,
} from "lucide-react";
import type { WorkflowStep } from "@/config/erp-ui";

const iconClass = (muted: boolean) =>
  muted ? "text-zinc-300" : "text-amber-500";

function StepVisual({
  iconKey,
  variant,
}: Pick<WorkflowStep, "iconKey" | "variant">) {
  const muted = variant === "muted";
  const success = variant === "success";

  if (iconKey === "monitorSuccess") {
    return (
      <div className="grid size-7 shrink-0 grid-cols-1 grid-rows-1 place-items-center">
        <Monitor
          className={`col-start-1 row-start-1 h-6 w-6 ${success ? "text-emerald-600" : "text-zinc-500"}`}
          strokeWidth={1.75}
        />
        <CheckCircle2
          className="col-start-1 row-start-1 z-[1] mr-[-0.125rem] mt-[-0.125rem] h-3 w-3 shrink-0 justify-self-end self-start fill-white text-emerald-600"
          aria-hidden
        />
      </div>
    );
  }

  if (iconKey === "send") {
    return (
      <Send className={`h-5 w-5 shrink-0 ${iconClass(muted)}`} strokeWidth={1.5} />
    );
  }
  if (iconKey === "activity") {
    return (
      <Activity className={`h-5 w-5 shrink-0 ${iconClass(muted)}`} strokeWidth={1.5} />
    );
  }
  if (iconKey === "checkCircle") {
    return (
      <CheckCircle2 className={`h-5 w-5 shrink-0 ${iconClass(muted)}`} strokeWidth={1.5} />
    );
  }
  if (iconKey === "clock") {
    return (
      <Clock className={`h-5 w-5 shrink-0 ${iconClass(muted)}`} strokeWidth={1.5} />
    );
  }

  return (
    <Keyboard
      className={`h-5 w-5 shrink-0 ${iconClass(muted)}`}
      strokeWidth={1.5}
    />
  );
}

const WATCHLIST_STEP_ID = "total-support-watchlist";

export function TaskCard({
  step,
  onActivate,
  surface = "workflow",
  flowchartOutline = "solid",
  interactive = true,
}: {
  step: WorkflowStep;
  onActivate?: (id: string) => void;
  /** workflow: STEP1 레일 스타일. flowchart: 전체지원공고 플로우 전용(둥근 아이콘). */
  surface?: "workflow" | "flowchart";
  /** flowchart: 분기 단계(대기중 등) 점선 테두리 */
  flowchartOutline?: "solid" | "dashed";
  /** false면 클릭해도 동작 없음(모양은 그대로, 필터링 카드와 동일) */
  interactive?: boolean;
}) {
  const muted = step.variant === "muted";
  const multilineLabel = step.label.includes("\n");
  const watchlistEmphasis = step.id === WATCHLIST_STEP_ID;
  const flowchart = surface === "flowchart";
  const branchDashed = flowchart && flowchartOutline === "dashed";

  const baseButton = flowchart
    ? `flex min-w-[6.5rem] w-[7.25rem] max-w-[10rem] shrink-0 flex-col items-center gap-1.5 rounded-xl border bg-white/95 px-2 py-2 text-center text-xs shadow-sm transition hover:shadow ${
        watchlistEmphasis
          ? "border-emerald-400 ring-2 ring-emerald-400/45 shadow-md hover:border-emerald-500 hover:ring-emerald-400/55"
          : branchDashed
            ? "border-2 border-dashed border-amber-400/85 hover:border-amber-500/90"
            : "border border-zinc-200/90 hover:border-zinc-300"
      }`
    : `flex min-w-[5.5rem] w-[6.5rem] max-w-[8.5rem] shrink-0 flex-col items-center gap-1 rounded border bg-white px-1 py-1.5 text-center text-xs shadow-sm transition hover:border-zinc-400 hover:shadow ${
        watchlistEmphasis
          ? "border-emerald-400 ring-2 ring-emerald-400/50 shadow-md hover:border-emerald-500 hover:ring-emerald-400/60"
          : "border-zinc-300"
      }`;

  const iconShell = flowchart
    ? "flex min-h-[2.75rem] min-w-[2.75rem] items-center justify-center rounded-full border border-zinc-200/90 bg-white p-2 shadow-sm"
    : "flex min-h-[2rem] w-full items-center justify-center rounded-sm border border-zinc-200 bg-zinc-50 py-0.5";

  return (
    <button
      type="button"
      onClick={() => {
        if (!interactive) return;
        onActivate?.(step.id);
      }}
      className={`${baseButton} ${muted ? "cursor-not-allowed opacity-60" : ""}`}
      disabled={muted}
      aria-disabled={muted || !interactive}
    >
      <div className={iconShell}>
        <StepVisual iconKey={step.iconKey} variant={step.variant} />
      </div>
      <span
        className={`px-0.5 text-center font-medium leading-snug ${
          multilineLabel
            ? "whitespace-pre-line"
            : flowchart
              ? "text-[0.7rem] leading-tight text-balance"
              : "whitespace-nowrap"
        } ${muted ? "text-zinc-400" : "text-zinc-800"}`}
      >
        {step.label}
      </span>
    </button>
  );
}
