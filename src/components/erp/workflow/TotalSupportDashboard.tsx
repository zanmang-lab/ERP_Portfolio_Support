"use client";

import { useState, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import {
  totalSupportWorkflow,
  TOTAL_SUPPORT_PUBLIC_STEP_ID,
} from "@/config/erp-ui";
import { PublicSupportListView } from "../public-support/PublicSupportListView";
import { TaskCard } from "./TaskCard";

type TotalSupportView = "flowchart" | "publicList";

export function TotalSupportDashboard() {
  const [view, setView] = useState<TotalSupportView>("flowchart");
  const classifySteps = totalSupportWorkflow[0].steps;
  const filterStep = totalSupportWorkflow[1].steps[0];
  const watchlistStep = totalSupportWorkflow[2].steps[0];

  const handleClassifyActivate = useCallback((id: string) => {
    if (id === TOTAL_SUPPORT_PUBLIC_STEP_ID) {
      setView("publicList");
    }
  }, []);

  if (view === "publicList") {
    return (
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <PublicSupportListView onBack={() => setView("flowchart")} />
      </div>
    );
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[#F3F4F6]">
      <div className="flex min-h-0 min-w-0 flex-1 items-start justify-start overflow-x-auto overflow-y-auto overscroll-x-contain p-6">
        <section
          className="flex min-w-min flex-nowrap items-center gap-3 sm:gap-4"
          aria-label="전체지원사업 프로세스: 사업분류, 필터링, 관심목록"
        >
          <div className="flex shrink-0 flex-col gap-2">
            {classifySteps.map((step) => (
              <TaskCard
                key={step.id}
                step={step}
                surface="flowchart"
                onActivate={handleClassifyActivate}
              />
            ))}
          </div>
          <ArrowRight
            className="h-5 w-5 shrink-0 text-zinc-400"
            strokeWidth={2}
            aria-hidden
          />
          <TaskCard step={filterStep} surface="flowchart" />
          <ArrowRight
            className="h-5 w-5 shrink-0 text-zinc-400"
            strokeWidth={2}
            aria-hidden
          />
          <TaskCard step={watchlistStep} surface="flowchart" />
        </section>
      </div>
    </div>
  );
}
