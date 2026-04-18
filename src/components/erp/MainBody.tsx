"use client";

import {
  SUPPORT_ALL_MENU_ID,
  SUPPORT_CURRENT_MENU_ID,
  SUPPORT_DOCS_MENU_ID,
  WORKFLOW_STEP1_ORG_ID,
  setupLnbItems,
  supportLnbItems,
  type ErpLnbKind,
} from "@/config/erp-ui";
import { BusinessManagementDashboard } from "./workflow/BusinessManagementDashboard";
import { DocumentManagementDashboard } from "./workflow/DocumentManagementDashboard";
import { FloatingActionButton } from "./workflow/FloatingActionButton";
import { TotalSupportDashboard } from "./workflow/TotalSupportDashboard";
import { WorkflowDashboard } from "./workflow/WorkflowDashboard";

const DEMO_PENDING_LINE = "해당 메뉴는 데모에서 준비 중입니다.";

function setupMenuLabel(id: string): string | null {
  return setupLnbItems.find((item) => item.id === id)?.label ?? null;
}

function supportMenuLabel(id: string): string | null {
  return supportLnbItems.find((item) => item.id === id)?.label ?? null;
}

export function MainBody({
  lnbOpen,
  lnbKind,
  activeWorkflowId,
  activeSupportMenuId,
  activeModuleMenuId,
  activeModuleMenuLabel,
}: {
  lnbOpen: boolean;
  lnbKind: ErpLnbKind;
  activeWorkflowId: string | null;
  activeSupportMenuId: string | null;
  activeModuleMenuId: string | null;
  activeModuleMenuLabel: string | null;
}) {
  const showOrgWorkflow = activeWorkflowId === WORKFLOW_STEP1_ORG_ID;
  const showTotalSupport =
    activeSupportMenuId === SUPPORT_ALL_MENU_ID;
  const showBusinessManagement =
    activeSupportMenuId === SUPPORT_CURRENT_MENU_ID;
  const showDocumentManagement =
    activeSupportMenuId === SUPPORT_DOCS_MENU_ID;
  const showOtherSetupSelection =
    activeWorkflowId !== null && activeWorkflowId !== WORKFLOW_STEP1_ORG_ID;

  if (showOrgWorkflow) {
    return (
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <WorkflowDashboard />
        </div>
        <div className="flex min-w-0 shrink-0 justify-end border-t border-transparent p-3">
          <FloatingActionButton />
        </div>
      </div>
    );
  }

  if (showTotalSupport) {
    return (
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <TotalSupportDashboard />
      </div>
    );
  }

  if (showBusinessManagement) {
    return (
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <BusinessManagementDashboard />
      </div>
    );
  }

  if (showDocumentManagement) {
    return (
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <DocumentManagementDashboard />
      </div>
    );
  }

  let message = "좌측에서 모듈을 선택하세요.";

  if (lnbKind === "setup" && lnbOpen) {
    if (!activeWorkflowId) {
      message = "좌측 패널에서 메뉴를 선택하세요.";
    } else {
      const label = setupMenuLabel(activeWorkflowId);
      message = `선택: ${label ?? activeWorkflowId}\n${DEMO_PENDING_LINE}`;
    }
  } else if (lnbKind === "module" && lnbOpen) {
    if (activeModuleMenuId && activeModuleMenuLabel) {
      message = `선택: ${activeModuleMenuLabel}\n${DEMO_PENDING_LINE}`;
    } else {
      message = "좌측 패널에서 메뉴를 선택하세요.";
    }
  } else if (lnbKind === "support" && lnbOpen) {
    if (!activeSupportMenuId) {
      message = "좌측 패널에서 메뉴를 선택하세요.";
    } else {
      const label = supportMenuLabel(activeSupportMenuId);
      message = `선택: ${label ?? activeSupportMenuId}\n${DEMO_PENDING_LINE}`;
    }
  } else if (showOtherSetupSelection) {
    const label = setupMenuLabel(activeWorkflowId);
    message = `선택: ${label ?? activeWorkflowId}\n${DEMO_PENDING_LINE}`;
  }

  return (
    <div className="flex min-h-0 flex-1 items-center justify-center bg-[#F3F4F6] px-6 text-center text-sm text-zinc-500">
      <p className="whitespace-pre-line">{message}</p>
    </div>
  );
}
