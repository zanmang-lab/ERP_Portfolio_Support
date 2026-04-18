"use client";

import { useMemo, useState } from "react";
import { ChevronLeft } from "lucide-react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  COMPLETION_FIELD_ORDER,
  COMPLETION_PROJECT_ROWS,
  pieDataForSubset,
  statsForField,
} from "@/data/businessCompletionMock";

const FIELD_COLORS = [
  "#0d9488",
  "#2563eb",
  "#7c3aed",
  "#db2777",
  "#ea580c",
  "#ca8a04",
  "#4f46e5",
  "#16a34a",
];

function colorForField(name: string): string {
  const i = COMPLETION_FIELD_ORDER.indexOf(name);
  return FIELD_COLORS[(i >= 0 ? i : 0) % FIELD_COLORS.length];
}

function PieBlock({
  title,
  titleId,
  data,
  height,
  compact,
}: {
  title: string;
  titleId: string;
  data: { name: string; value: number }[];
  height: number;
  compact?: boolean;
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const summary = total === 0 ? "데이터 없음" : `총 ${total}건`;

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm">
      <h3
        id={titleId}
        className={`mb-2 text-center font-semibold text-zinc-800 ${
          compact ? "text-xs" : "text-sm"
        }`}
      >
        {title}
      </h3>
      <div
        className="text-center text-[0.65rem] text-zinc-500"
        aria-live="polite"
      >
        {summary}
      </div>
      <div
        role="img"
        aria-labelledby={titleId}
        className="mt-1"
        style={{ height }}
      >
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-zinc-400">
            표시할 데이터가 없습니다.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={compact ? "38%" : "42%"}
                outerRadius={compact ? "70%" : "72%"}
                paddingAngle={1}
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={colorForField(entry.name)}
                    stroke="#fff"
                    strokeWidth={1}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                wrapperStyle={{ fontSize: compact ? 10 : 11 }}
                formatter={(value) => value}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export function BusinessCompletionStageView({
  onBack,
}: {
  onBack: () => void;
}) {
  const rows = COMPLETION_PROJECT_ROWS;

  const fieldsInData = useMemo(() => {
    const set = new Set(rows.map((r) => r.field));
    return COMPLETION_FIELD_ORDER.filter((f) => set.has(f));
  }, [rows]);

  const [activeField, setActiveField] = useState(() => fieldsInData[0] ?? "");

  const pieAll = useMemo(() => pieDataForSubset(rows, null), [rows]);
  const pieSelected = useMemo(() => pieDataForSubset(rows, true), [rows]);
  const pieNotSelected = useMemo(() => pieDataForSubset(rows, false), [rows]);

  const fieldStats = useMemo(
    () => statsForField(rows, activeField),
    [rows, activeField],
  );

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-gray-50">
      <header className="flex shrink-0 items-center gap-3 border-b border-zinc-200 bg-gray-50 px-4 py-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-800 shadow-sm transition hover:bg-zinc-50"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
          뒤로가기
        </button>
        <h1 className="text-base font-semibold text-zinc-900">사업 완료</h1>
      </header>

      <div className="min-h-0 flex-1 overflow-auto p-4">
        <div className="mx-auto flex max-w-[120rem] flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
          <section
            className="min-h-[18rem] min-w-0 flex-1 lg:max-w-[70%]"
            aria-label="신청 사업 목록"
          >
            <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
              <div className="border-b border-zinc-200 bg-rose-50/80 px-4 py-2">
                <h2 className="text-sm font-semibold text-zinc-900">
                  전체 사업
                </h2>
                <p className="text-xs text-zinc-600">
                  미발탁·발탁(수행 완료) 포함 신청 이력
                </p>
              </div>
              <div className="max-h-[min(70vh,36rem)] overflow-auto">
                <table className="w-full min-w-[520px] table-fixed border-collapse text-sm">
                  <thead className="sticky top-0 z-10 bg-rose-100 text-red-900 shadow-sm">
                    <tr>
                      <th
                        scope="col"
                        className="border border-rose-200/80 px-4 py-2.5 text-left text-xs font-semibold"
                      >
                        사업명
                      </th>
                      <th
                        scope="col"
                        className="w-28 border border-rose-200/80 px-4 py-2.5 text-center text-xs font-semibold"
                      >
                        분야
                      </th>
                      <th
                        scope="col"
                        className="w-28 border border-rose-200/80 px-4 py-2.5 text-center text-xs font-semibold"
                      >
                        발탁여부
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-zinc-800">
                    {rows.map((r) => (
                      <tr
                        key={r.id}
                        className="border-b border-zinc-100 hover:bg-zinc-50/80"
                      >
                        <td className="border-x border-zinc-200 px-4 py-2 align-middle">
                          {r.name}
                        </td>
                        <td className="border-x border-zinc-200 px-4 py-2 text-center align-middle whitespace-nowrap">
                          {r.field}
                        </td>
                        <td className="border-x border-zinc-200 px-4 py-2 text-center align-middle whitespace-nowrap">
                          <span
                            className={
                              r.selected
                                ? "font-medium text-emerald-700"
                                : "text-zinc-600"
                            }
                          >
                            {r.selected ? "발탁" : "미발탁"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <aside
            className="flex w-full shrink-0 flex-col gap-4 lg:w-[min(100%,32%)] lg:max-w-md"
            aria-label="분야별 통계"
          >
            <PieBlock
              title="전체 신청 사업 분야별"
              titleId="chart-all-fields"
              data={pieAll}
              height={260}
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <PieBlock
                title="발탁 사업 분야별"
                titleId="chart-selected-fields"
                data={pieSelected}
                height={200}
                compact
              />
              <PieBlock
                title="미발탁 사업 분야별"
                titleId="chart-not-selected-fields"
                data={pieNotSelected}
                height={200}
                compact
              />
            </div>

            <div className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm">
              <h3 className="mb-2 text-sm font-semibold text-zinc-900">
                각 분야별 발탁 비율 보기
              </h3>
              <div className="flex flex-wrap gap-2">
                {fieldsInData.map((f) => (
                  <button
                    key={f}
                    type="button"
                    aria-pressed={activeField === f}
                    onClick={() => setActiveField(f)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                      activeField === f
                        ? "border-teal-600 bg-teal-50 text-teal-900"
                        : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {activeField ? (
                <div className="mt-4 space-y-3 border-t border-zinc-100 pt-3">
                  <p className="text-sm text-zinc-700">
                    <span className="font-semibold text-zinc-900">
                      {activeField}
                    </span>{" "}
                    분야: 발탁{" "}
                    <strong className="text-emerald-700">
                      {fieldStats.selectedCount}건
                    </strong>
                    , 미발탁{" "}
                    <strong className="text-zinc-600">
                      {fieldStats.notSelectedCount}건
                    </strong>{" "}
                    (합계 {fieldStats.total}건)
                  </p>
                  <div>
                    <div className="mb-1 flex justify-between text-[0.7rem] text-zinc-500">
                      <span>발탁 비율</span>
                      <span>{fieldStats.selectedPct}%</span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-200">
                      <div
                        className="h-full rounded-full bg-teal-600 transition-[width]"
                        style={{ width: `${fieldStats.selectedPct}%` }}
                      />
                    </div>
                    <div className="mt-1 flex justify-between text-[0.65rem] text-zinc-500">
                      <span>미발탁</span>
                      <span>
                        {fieldStats.total === 0
                          ? "—"
                          : `${Math.round((100 - fieldStats.selectedPct) * 10) / 10}%`}
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
