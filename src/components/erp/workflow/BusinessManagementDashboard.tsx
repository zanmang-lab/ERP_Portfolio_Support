"use client";

import { useCallback, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import {
  BUSINESS_STEP_APPLICATION_ID,
  BUSINESS_STEP_COMPLETED_ID,
  BUSINESS_STEP_IN_PROGRESS_ID,
  BUSINESS_STEP_PENDING_ID,
  businessManagementMainLineSteps,
  businessManagementPendingStep,
  supportCurrentPageTitle,
} from "@/config/erp-ui";
import { BusinessStageListView } from "../business-management/BusinessStageListView";
import { TaskCard } from "./TaskCard";

type ViewMode = "flowchart" | "stage";

const STEP_TITLES: Record<string, string> = {
  [BUSINESS_STEP_APPLICATION_ID]: `${supportCurrentPageTitle} — 사업 신청`,
  [BUSINESS_STEP_PENDING_ID]: `${supportCurrentPageTitle} — 대기중 사업`,
  [BUSINESS_STEP_IN_PROGRESS_ID]: `${supportCurrentPageTitle} — 사업 진행 중`,
  [BUSINESS_STEP_COMPLETED_ID]: `${supportCurrentPageTitle} — 사업 완료`,
};

/** 상단 카드(신청·진행·완료)와 화살표를 같은 기준선에 맞추기 위한 여백 */
const ARROW_ALIGN_CLASS = "mt-[2.125rem] shrink-0 self-start";

export function BusinessManagementDashboard() {
  const [view, setView] = useState<ViewMode>("flowchart");
  const [activeStageId, setActiveStageId] = useState<string | null>(null);

  const stageTitle = useMemo(
    () => (activeStageId ? STEP_TITLES[activeStageId] ?? supportCurrentPageTitle : ""),
    [activeStageId],
  );

  const openStage = useCallback((id: string) => {
    setActiveStageId(id);
    setView("stage");
  }, []);

  const backToFlow = useCallback(() => {
    setView("flowchart");
    setActiveStageId(null);
  }, []);

  if (view === "stage" && activeStageId) {
    return (
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <BusinessStageListView title={stageTitle} onBack={backToFlow} />
      </div>
    );
  }

  const [applyStep, progressStep, doneStep] = businessManagementMainLineSteps;

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[#F3F4F6]">
      <div className="flex min-h-0 min-w-0 flex-1 items-start justify-start overflow-x-auto overflow-y-auto overscroll-x-contain p-6">
        <section
          className="flex min-w-min flex-col gap-8"
          aria-label="사업관리 프로세스: 사업 신청, 진행, 완료 및 대기중 분기"
        >
          <div className="flex min-w-min flex-nowrap items-start gap-3 sm:gap-4">
            <div className="flex shrink-0 flex-col items-center gap-0">
              <TaskCard
                step={applyStep}
                surface="flowchart"
                onActivate={openStage}
              />
              <div
                className="my-1 h-4 w-px shrink-0 border-l-2 border-dashed border-zinc-400"
                aria-hidden
              />
              <TaskCard
                step={businessManagementPendingStep}
                surface="flowchart"
                flowchartOutline="dashed"
                onActivate={openStage}
              />
            </div>
            <ArrowRight
              className={`${ARROW_ALIGN_CLASS} h-5 w-5 text-zinc-400`}
              strokeWidth={2}
              aria-hidden
            />
            <TaskCard
              step={progressStep}
              surface="flowchart"
              onActivate={openStage}
            />
            <ArrowRight
              className={`${ARROW_ALIGN_CLASS} h-5 w-5 text-zinc-400`}
              strokeWidth={2}
              aria-hidden
            />
            <TaskCard
              step={doneStep}
              surface="flowchart"
              onActivate={openStage}
            />
          </div>

          <p className="max-w-xl text-xs leading-relaxed text-zinc-500">
            실선 화살표는 주요 진행 순서이며, 점선은 신청 후 심사·승인 대기 등으로 분기된 사업이
            진행 또는 완료 단계로 이어질 수 있음을 나타냅니다.
          </p>
        </section>
      </div>
    </div>
  );
}
