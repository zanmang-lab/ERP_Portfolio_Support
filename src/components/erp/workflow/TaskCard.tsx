"use client";

import { CheckCircle2, Keyboard, Monitor } from "lucide-react";
import type { WorkflowStep } from "@/config/erp-ui";

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

  return (
    <Keyboard
      className={`h-5 w-5 shrink-0 ${muted ? "text-zinc-300" : "text-amber-500"}`}
      strokeWidth={1.5}
    />
  );
}

export function TaskCard({
  step,
  onActivate,
}: {
  step: WorkflowStep;
  onActivate?: (id: string) => void;
}) {
  const muted = step.variant === "muted";
  const multilineLabel = step.label.includes("\n");

  return (
    <button
      type="button"
      onClick={() => onActivate?.(step.id)}
      className={`flex min-w-[5.5rem] w-[6.5rem] max-w-[8.5rem] shrink-0 flex-col items-center gap-1 rounded border border-zinc-300 bg-white px-1 py-1.5 text-center text-xs shadow-sm transition hover:border-zinc-400 hover:shadow ${
        muted ? "cursor-not-allowed opacity-60" : ""
      }`}
      disabled={muted}
    >
      <div className="flex min-h-[2rem] w-full items-center justify-center rounded-sm border border-zinc-200 bg-zinc-50 py-0.5">
        <StepVisual iconKey={step.iconKey} variant={step.variant} />
      </div>
      <span
        className={`px-0.5 text-center font-medium leading-snug ${
          multilineLabel ? "whitespace-pre-line" : "whitespace-nowrap"
        } ${muted ? "text-zinc-400" : "text-zinc-800"}`}
      >
        {step.label}
      </span>
    </button>
  );
}
