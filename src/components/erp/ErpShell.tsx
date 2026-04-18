"use client";

import { useMemo, useState } from "react";
import {
  SETUP_GNB_ID,
  SUPPORT_ALL_MENU_ID,
  SUPPORT_CURRENT_MENU_ID,
  SUPPORT_DOCS_MENU_ID,
  SUPPORT_GNB_ID,
  WORKFLOW_STEP1_ORG_ID,
  ErpLnbKind,
  gnbModuleItems,
  setupLnbItems,
  setupLnbTitle,
  supportLnbItems,
  supportLnbTitle,
  documentsPageTitle,
  supportCurrentPageTitle,
  totalSupportPageTitle,
  workflowPageTitle,
} from "@/config/erp-ui";
import { getModuleSubmenuItems } from "@/config/erp-module-menus";
import { Gnb } from "./Gnb";
import { MainBody } from "./MainBody";
import { ModuleLnb } from "./ModuleLnb";
import { SetupLnb } from "./SetupLnb";
import { TopBar } from "./TopBar";

export function ErpShell() {
  const [selectedGnbId, setSelectedGnbId] = useState<string | null>(null);
  const [lnbOpen, setLnbOpen] = useState(false);
  const [lnbKind, setLnbKind] = useState<ErpLnbKind>(null);
  const [activeWorkflowId, setActiveWorkflowId] = useState<string | null>(null);
  const [activeModuleMenuId, setActiveModuleMenuId] = useState<string | null>(
    null,
  );
  const [activeSupportMenuId, setActiveSupportMenuId] = useState<string | null>(
    null,
  );

  const handleSelectModule = (id: string) => {
    setSelectedGnbId(id);
    if (id === SETUP_GNB_ID) {
      setLnbOpen(true);
      setLnbKind("setup");
      setActiveModuleMenuId(null);
      setActiveSupportMenuId(null);
      return;
    }
    if (id === SUPPORT_GNB_ID) {
      setLnbOpen(true);
      setLnbKind("support");
      setActiveWorkflowId(null);
      setActiveModuleMenuId(null);
      setActiveSupportMenuId(null);
      return;
    }
    const moduleItems = getModuleSubmenuItems(id);
    if (moduleItems.length > 0) {
      setLnbOpen(true);
      setLnbKind("module");
      setActiveWorkflowId(null);
      setActiveModuleMenuId(null);
      setActiveSupportMenuId(null);
      return;
    }
    setLnbOpen(false);
    setLnbKind(null);
    setActiveWorkflowId(null);
    setActiveModuleMenuId(null);
    setActiveSupportMenuId(null);
  };

  const handleCloseLnb = () => {
    setLnbOpen(false);
    setLnbKind(null);
  };

  const handleSelectLnbItem = (id: string) => {
    setActiveWorkflowId(id);
  };

  const handleSelectSupportMenuItem = (id: string) => {
    setActiveSupportMenuId(id);
  };

  const handleSelectModuleMenuItem = (id: string) => {
    setActiveModuleMenuId(id);
  };

  const showWorkflow = activeWorkflowId === WORKFLOW_STEP1_ORG_ID;
  const showTotalSupport = activeSupportMenuId === SUPPORT_ALL_MENU_ID;
  const showBusinessManagement =
    activeSupportMenuId === SUPPORT_CURRENT_MENU_ID;
  const showDocumentManagement =
    activeSupportMenuId === SUPPORT_DOCS_MENU_ID;
  const topBarMode =
    showWorkflow ||
    showTotalSupport ||
    showBusinessManagement ||
    showDocumentManagement
      ? "workflow"
      : "default";

  const modulePanelTitle =
    gnbModuleItems.find((m) => m.id === selectedGnbId)?.label ?? "";

  const activeModuleMenuLabel = useMemo(() => {
    if (!activeModuleMenuId || !selectedGnbId || lnbKind !== "module") {
      return null;
    }
    return (
      getModuleSubmenuItems(selectedGnbId).find((i) => i.id === activeModuleMenuId)
        ?.label ?? null
    );
  }, [activeModuleMenuId, selectedGnbId, lnbKind]);

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 overflow-hidden bg-[#F3F4F6] text-zinc-900">
      <Gnb selectedGnbId={selectedGnbId} onSelectModule={handleSelectModule} />
      <div
        className={`flex h-full min-w-0 shrink-0 self-stretch overflow-hidden transition-[width] duration-300 ease-out ${
          lnbOpen ? "w-[min(16.25rem,100%)]" : "w-0"
        }`}
      >
        {lnbOpen && lnbKind === "setup" ? (
          <SetupLnb
            title={setupLnbTitle}
            items={setupLnbItems}
            selectedLnbId={activeWorkflowId}
            onSelectItem={handleSelectLnbItem}
            onClose={handleCloseLnb}
          />
        ) : null}
        {lnbOpen && lnbKind === "support" ? (
          <SetupLnb
            title={supportLnbTitle}
            items={supportLnbItems}
            selectedLnbId={activeSupportMenuId}
            onSelectItem={handleSelectSupportMenuItem}
            onClose={handleCloseLnb}
          />
        ) : null}
        {lnbOpen && lnbKind === "module" && selectedGnbId ? (
          <ModuleLnb
            title={modulePanelTitle}
            items={getModuleSubmenuItems(selectedGnbId)}
            selectedItemId={activeModuleMenuId}
            onSelectItem={handleSelectModuleMenuItem}
            onClose={handleCloseLnb}
          />
        ) : null}
      </div>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <TopBar
          mode={topBarMode}
          pageTitle={
            showTotalSupport
              ? totalSupportPageTitle
              : showBusinessManagement
                ? supportCurrentPageTitle
                : showDocumentManagement
                  ? documentsPageTitle
                  : showWorkflow
                    ? workflowPageTitle
                    : undefined
          }
        />
        <MainBody
          lnbOpen={lnbOpen}
          lnbKind={lnbKind}
          activeWorkflowId={activeWorkflowId}
          activeSupportMenuId={activeSupportMenuId}
          activeModuleMenuId={activeModuleMenuId}
          activeModuleMenuLabel={activeModuleMenuLabel}
        />
      </div>
    </div>
  );
}
