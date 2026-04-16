"use client";

import { organizationSetupWorkflow } from "@/config/erp-ui";
import { WorkflowRow } from "./WorkflowRow";

export function WorkflowDashboard() {
  const rows = organizationSetupWorkflow;
  const last = rows.length - 1;

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 overflow-hidden bg-[#F3F4F6] p-4">
      <div className="min-h-0 min-w-0 flex-1 overflow-x-auto overflow-y-auto overscroll-x-contain pt-1">
        <div className="flex w-max min-w-full flex-col items-start gap-y-6 bg-transparent px-1 py-1">
          {rows.map((row, index) => (
            <WorkflowRow
              key={row.id}
              row={row}
              rowPosition={
                index === 0 ? "first" : index === last ? "last" : "middle"
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
