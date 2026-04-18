"use client";

import { Fragment, useCallback, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { documentManagementSteps } from "@/config/erp-ui";
import { BusinessStageListView } from "../business-management/BusinessStageListView";
import { TaskCard } from "./TaskCard";

type ViewMode = "flowchart" | "detail";

export function DocumentManagementDashboard() {
  const [view, setView] = useState<ViewMode>("flowchart");
  const [activeStepId, setActiveStepId] = useState<string | null>(null);

  const stepTitles = useMemo(
    () => Object.fromEntries(documentManagementSteps.map((s) => [s.id, s.label])),
    [],
  );

  const detailTitle = useMemo(
    () => (activeStepId ? stepTitles[activeStepId] ?? "" : ""),
    [activeStepId, stepTitles],
  );

  const openDetail = useCallback((id: string) => {
    setActiveStepId(id);
    setView("detail");
  }, []);

  const backToFlow = useCallback(() => {
    setView("flowchart");
    setActiveStepId(null);
  }, []);

  if (view === "detail" && activeStepId) {
    return (
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <BusinessStageListView title={detailTitle} onBack={backToFlow} />
      </div>
    );
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[#F3F4F6]">
      <div className="flex min-h-0 min-w-0 flex-1 items-start justify-start overflow-x-auto overflow-y-auto overscroll-x-contain p-6">
        <section
          className="flex min-w-min flex-nowrap items-center gap-3 sm:gap-4"
          aria-label="서류관리 프로세스: 유효기간, 매사업 갱신"
        >
          {documentManagementSteps.map((step, index) => (
            <Fragment key={step.id}>
              {index > 0 ? (
                <ArrowRight
                  className="h-5 w-5 shrink-0 text-zinc-400"
                  strokeWidth={2}
                  aria-hidden
                />
              ) : null}
              <TaskCard
                step={step}
                surface="flowchart"
                onActivate={openDetail}
              />
            </Fragment>
          ))}
        </section>
      </div>
    </div>
  );
}
