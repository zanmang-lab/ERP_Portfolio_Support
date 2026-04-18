"use client";

import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ArrowRight } from "lucide-react";
import {
  BUSINESS_STEP_APPLICATION_ID,
  BUSINESS_STEP_COMPLETED_ID,
  BUSINESS_STEP_IN_PROGRESS_ID,
  BUSINESS_STEP_PENDING_ID,
  businessManagementMainLineSteps,
  businessManagementPendingStep,
} from "@/config/erp-ui";
import { BusinessApplicationStageView } from "../business-management/BusinessApplicationStageView";
import { BusinessStageListView } from "../business-management/BusinessStageListView";
import { TaskCard } from "./TaskCard";

type ViewMode = "flowchart" | "stage";

const STEP_TITLES: Record<string, string> = {
  [BUSINESS_STEP_APPLICATION_ID]: "사업 신청",
  [BUSINESS_STEP_PENDING_ID]: "대기중 사업",
  [BUSINESS_STEP_IN_PROGRESS_ID]: "사업 진행 중",
  [BUSINESS_STEP_COMPLETED_ID]: "사업 완료",
};

const MAIN_ARROW_CLASS = "h-5 w-5 shrink-0 text-zinc-400";

export function BusinessManagementDashboard() {
  const [view, setView] = useState<ViewMode>("flowchart");
  const [activeStageId, setActiveStageId] = useState<string | null>(null);
  const [dashPaths, setDashPaths] = useState<{
    applyToPending: string;
    pendingBranches: string;
  } | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const applyRef = useRef<HTMLDivElement>(null);
  const pendingRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  const stageTitle = useMemo(
    () => (activeStageId ? STEP_TITLES[activeStageId] ?? "" : ""),
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

  useLayoutEffect(() => {
    if (view !== "flowchart") {
      setDashPaths(null);
      return;
    }

    const update = () => {
      const sec = sectionRef.current?.getBoundingClientRect();
      const apply = applyRef.current?.getBoundingClientRect();
      const pending = pendingRef.current?.getBoundingClientRect();
      const progress = progressRef.current?.getBoundingClientRect();
      const done = doneRef.current?.getBoundingClientRect();
      if (!sec || !apply || !pending || !progress || !done) {
        setDashPaths(null);
        return;
      }

      const ax = apply.left + apply.width / 2 - sec.left;
      const ayBottom = apply.bottom - sec.top;
      const pendInX = pending.left + Math.min(14, pending.width * 0.22) - sec.left;
      const pendInY = pending.top + pending.height * 0.35 - sec.top;

      const applyToPending = `M ${ax} ${ayBottom} L ${ax} ${pendInY - 6} L ${pendInX} ${pendInY}`;

      const pr = pending.right - sec.left;
      const yMid = pending.top + pending.height / 2 - sec.top;
      const xp = progress.left + progress.width / 2 - sec.left;
      const xd = done.left + done.width / 2 - sec.left;
      const py = progress.bottom - sec.top;
      const dy = done.bottom - sec.top;
      const xEnd = Math.max(xp, xd);
      const pendingBranches = `M ${pr} ${yMid} L ${xEnd} ${yMid} M ${xp} ${yMid} L ${xp} ${py} M ${xd} ${yMid} L ${xd} ${dy}`;

      setDashPaths({ applyToPending, pendingBranches });
    };

    update();
    const ro = new ResizeObserver(() => update());
    if (sectionRef.current) ro.observe(sectionRef.current);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [view]);

  if (view === "stage" && activeStageId) {
    if (activeStageId === BUSINESS_STEP_APPLICATION_ID) {
      return (
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <BusinessApplicationStageView onBack={backToFlow} />
        </div>
      );
    }
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
          ref={sectionRef}
          className="relative flex min-w-min flex-col gap-6"
          aria-label="사업관리 프로세스: 사업 신청, 진행, 완료 및 대기중 분기"
        >
          {dashPaths ? (
            <svg
              className="pointer-events-none absolute inset-0 z-0 overflow-visible"
              aria-hidden
            >
              <path
                d={dashPaths.applyToPending}
                fill="none"
                stroke="rgb(113 113 122)"
                strokeWidth={1.25}
                strokeDasharray="5 4"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d={dashPaths.pendingBranches}
                fill="none"
                stroke="rgb(113 113 122)"
                strokeWidth={1.25}
                strokeDasharray="5 4"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          ) : null}

          <div className="relative z-10 flex min-w-min flex-nowrap items-center gap-3 sm:gap-4">
            <div className="flex w-[7.25rem] shrink-0 justify-center">
              <div ref={applyRef}>
                <TaskCard
                  step={applyStep}
                  surface="flowchart"
                  interactive={applyStep.id === BUSINESS_STEP_APPLICATION_ID}
                  onActivate={openStage}
                />
              </div>
            </div>
            <ArrowRight className={MAIN_ARROW_CLASS} strokeWidth={2} aria-hidden />
            <div ref={progressRef} className="shrink-0">
              <TaskCard
                step={progressStep}
                surface="flowchart"
                interactive={false}
                onActivate={openStage}
              />
            </div>
            <ArrowRight className={MAIN_ARROW_CLASS} strokeWidth={2} aria-hidden />
            <div ref={doneRef} className="shrink-0">
              <TaskCard
                step={doneStep}
                surface="flowchart"
                interactive={doneStep.id === BUSINESS_STEP_COMPLETED_ID}
                onActivate={openStage}
              />
            </div>
          </div>

          <div className="relative z-10 flex min-w-min justify-start">
            <div className="flex w-[7.25rem] shrink-0 justify-center">
              <div ref={pendingRef}>
                <TaskCard
                  step={businessManagementPendingStep}
                  surface="flowchart"
                  flowchartOutline="dashed"
                  interactive={false}
                  onActivate={openStage}
                />
              </div>
            </div>
          </div>

          <span className="sr-only">
            점선은 사업 신청에서 대기중으로, 대기중에서 진행 중·완료로 이어질 수 있는 분기를 나타냅니다.
          </span>
        </section>
      </div>
    </div>
  );
}
