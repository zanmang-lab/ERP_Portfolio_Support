"use client";

import { ArrowDown, ArrowUp, Download, ChevronLeft } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  publicSupportMockList,
  formatApplicationPeriod,
  type PublicSupportNotice,
} from "@/data/publicSupportMock";
import {
  formatDdayLabel,
  getDaysUntilDeadline,
  isDeadlineWithinThreeDays,
} from "@/lib/supportDeadline";

type LoadState = "idle" | "loading" | "ready" | "error";

type ApiPayload = {
  ok: boolean;
  items?: PublicSupportNotice[];
  message?: string;
  code?: string;
  meta?: { partial?: boolean };
};

type SortKey = "field" | "title" | "deadline" | "ministry";
type SortDir = "asc" | "desc";

function normalizeDashEmpty(s: string): string {
  const t = s.trim();
  return t === "—" ? "" : t;
}

/** 빈 값(—)은 항상 목록 맨 아래 */
function cmpKoEmptyLast(a: string, b: string, dir: SortDir): number {
  const va = normalizeDashEmpty(a);
  const vb = normalizeDashEmpty(b);
  const ea = va === "" ? 1 : 0;
  const eb = vb === "" ? 1 : 0;
  if (ea !== eb) return ea - eb;
  const c = va.localeCompare(vb, "ko");
  return dir === "asc" ? c : -c;
}

function titleFirstLine(title: string): string {
  const i = title.indexOf("\n");
  return i === -1 ? title : title.slice(0, i);
}

function compareNotice(
  a: PublicSupportNotice,
  b: PublicSupportNotice,
  key: SortKey,
  dir: SortDir,
): number {
  switch (key) {
    case "field":
      return cmpKoEmptyLast(a.field, b.field, dir);
    case "title":
      return cmpKoEmptyLast(titleFirstLine(a.title), titleFirstLine(b.title), dir);
    case "deadline": {
      const c = a.deadline.localeCompare(b.deadline);
      return dir === "asc" ? c : -c;
    }
    case "ministry":
      return cmpKoEmptyLast(a.ministry, b.ministry, dir);
    default:
      return 0;
  }
}

function SortTh({
  label,
  column,
  sortKey,
  sortDir,
  onSort,
  className = "",
}: {
  label: string;
  column: SortKey;
  sortKey: SortKey | null;
  sortDir: SortDir;
  onSort: (col: SortKey) => void;
  className?: string;
}) {
  const active = sortKey === column;
  const ariaSort = active
    ? sortDir === "asc"
      ? "ascending"
      : "descending"
    : "none";
  return (
    <th
      scope="col"
      aria-sort={ariaSort}
      className={`border border-rose-200/80 px-0 py-0 text-center text-xs font-semibold break-keep ${className}`}
    >
      <button
        type="button"
        onClick={() => onSort(column)}
        className="inline-flex min-h-[2.5rem] w-full min-w-0 cursor-pointer items-center justify-center gap-1 whitespace-nowrap px-2 py-2.5 text-red-900 hover:bg-rose-200/50"
      >
        <span className="whitespace-nowrap">{label}</span>
        {active ? (
          sortDir === "asc" ? (
            <ArrowUp className="h-3.5 w-3.5 shrink-0" aria-hidden />
          ) : (
            <ArrowDown className="h-3.5 w-3.5 shrink-0" aria-hidden />
          )
        ) : null}
      </button>
    </th>
  );
}

export function PublicSupportListView({ onBack }: { onBack: () => void }) {
  const [rows, setRows] = useState<PublicSupportNotice[]>([]);
  const [interest, setInterest] = useState<Record<string, boolean>>({});
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [errorText, setErrorText] = useState<string | null>(null);
  const [usingMock, setUsingMock] = useState(false);
  const [partialFromApi, setPartialFromApi] = useState(false);
  const [sort, setSort] = useState<{ key: SortKey | null; dir: SortDir }>({
    key: null,
    dir: "asc",
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadState("loading");
      setErrorText(null);
      setUsingMock(false);
      setPartialFromApi(false);
      try {
        const res = await fetch("/api/bizinfo/support-notices", {
          cache: "no-store",
        });
        const json = (await res.json()) as ApiPayload;

        if (cancelled) return;

        if (res.status === 503 && json.code === "missing_key") {
          setRows(publicSupportMockList);
          setUsingMock(true);
          setPartialFromApi(false);
          setErrorText(json.message ?? null);
          setLoadState("ready");
          return;
        }

        if (!res.ok || !json.ok) {
          setRows([]);
          setPartialFromApi(false);
          setErrorText(
            json.message ?? `목록을 불러오지 못했습니다. (${res.status})`,
          );
          setLoadState("error");
          return;
        }

        setRows(Array.isArray(json.items) ? json.items : []);
        setPartialFromApi(Boolean(json.meta?.partial));
        setLoadState("ready");
      } catch (e) {
        if (!cancelled) {
          setRows([]);
          setPartialFromApi(false);
          setErrorText(e instanceof Error ? e.message : "네트워크 오류");
          setLoadState("error");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleInterest = useCallback((id: string) => {
    setInterest((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleSortClick = useCallback((col: SortKey) => {
    setSort((s) => {
      if (s.key !== col) return { key: col, dir: "asc" };
      return { key: col, dir: s.dir === "asc" ? "desc" : "asc" };
    });
  }, []);

  const displayRows = useMemo(() => {
    if (!sort.key) return rows;
    return [...rows].sort((a, b) => compareNotice(a, b, sort.key!, sort.dir));
  }, [rows, sort.key, sort.dir]);

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
        <h1 className="text-base font-semibold text-zinc-900">
          [지원] 공공지원사업 목록
        </h1>
      </header>

      {usingMock && errorText ? (
        <div className="shrink-0 border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-950">
          {errorText} (데모용 목업 데이터를 표시합니다.)
        </div>
      ) : null}

      {loadState === "error" && errorText && !usingMock ? (
        <div className="shrink-0 border-b border-red-200 bg-red-50 px-4 py-2 text-sm text-red-900">
          {errorText}
        </div>
      ) : null}

      {loadState === "ready" && partialFromApi && !usingMock ? (
        <div className="shrink-0 border-b border-zinc-200 bg-zinc-100 px-4 py-1.5 text-xs text-zinc-700">
          일부만 불러왔습니다. 네트워크 상태에 따라 다음 페이지가 생략될 수 있어요. 잠시 후 새로고침하면 전체를 다시 시도합니다.
        </div>
      ) : null}

      <div className="min-h-0 min-w-0 flex-1 overflow-hidden p-4">
        <div className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
          {loadState === "loading" ? (
            <div className="flex flex-1 items-center justify-center p-8 text-sm text-zinc-500">
              목록을 불러오는 중…
            </div>
          ) : (
            <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
              <div className="h-full min-h-0 min-w-0 overflow-x-auto overflow-y-auto">
                <table className="w-[1200px] min-w-[1200px] table-fixed border-collapse text-sm">
                  <colgroup>
                    <col className="w-[88px]" />
                    <col className="w-[104px]" />
                    <col />
                    <col className="w-[148px]" />
                    <col className="w-[100px]" />
                    <col className="w-[136px]" />
                    <col className="w-[136px]" />
                    <col className="w-[104px]" />
                  </colgroup>
                  <thead className="sticky top-0 z-10 bg-rose-100 text-red-900 shadow-sm">
                    <tr>
                      <th className="whitespace-nowrap border border-rose-200/80 px-2 py-2.5 text-center text-xs font-semibold break-keep">
                        관심목록추가
                      </th>
                      <SortTh
                        label="지원분야"
                        column="field"
                        sortKey={sort.key}
                        sortDir={sort.dir}
                        onSort={handleSortClick}
                        className="whitespace-nowrap"
                      />
                      <SortTh
                        label="공고사업명"
                        column="title"
                        sortKey={sort.key}
                        sortDir={sort.dir}
                        onSort={handleSortClick}
                        className="min-w-0"
                      />
                      <th className="whitespace-nowrap border border-rose-200/80 px-2 py-2.5 text-center text-xs font-semibold break-keep">
                        신청기간
                      </th>
                      <SortTh
                        label="마감 D-DAY"
                        column="deadline"
                        sortKey={sort.key}
                        sortDir={sort.dir}
                        onSort={handleSortClick}
                        className="whitespace-nowrap"
                      />
                      <SortTh
                        label="소관부처"
                        column="ministry"
                        sortKey={sort.key}
                        sortDir={sort.dir}
                        onSort={handleSortClick}
                        className="whitespace-nowrap"
                      />
                      <th className="whitespace-nowrap border border-rose-200/80 px-2 py-2.5 text-center text-xs font-semibold break-keep">
                        사업수행기관
                      </th>
                      <th className="whitespace-nowrap border border-rose-200/80 px-2 py-2.5 text-center text-xs font-semibold break-keep">
                        파일다운로드
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white text-zinc-800">
                    {displayRows.length === 0 && loadState === "ready" ? (
                      <tr>
                        <td
                          colSpan={8}
                          className="border border-zinc-200 px-4 py-8 text-center text-sm text-zinc-500"
                        >
                          조건에 맞는 진행 중 공고가 없습니다.
                        </td>
                      </tr>
                    ) : null}
                    {displayRows.map((row) => {
                      const daysUntil = getDaysUntilDeadline(row.deadline);
                      const ddayLabel = formatDdayLabel(daysUntil);
                      const urgent = isDeadlineWithinThreeDays(daysUntil);
                      return (
                        <tr key={row.id} className="hover:bg-zinc-50/80">
                          <td className="whitespace-nowrap border border-zinc-200 px-2 py-2 text-center align-middle break-keep">
                            <input
                              type="checkbox"
                              checked={!!interest[row.id]}
                              onChange={() => toggleInterest(row.id)}
                              className="h-4 w-4 rounded border-zinc-400 text-blue-600"
                              aria-label={`${row.title} 관심목록`}
                            />
                          </td>
                          <td className="whitespace-nowrap border border-zinc-200 px-2 py-2 text-center align-middle break-keep">
                            {row.field}
                          </td>
                          <td className="min-w-0 border border-zinc-200 px-2 py-2 align-top text-left break-keep break-words whitespace-normal">
                            {row.title}
                          </td>
                          <td className="whitespace-nowrap border border-zinc-200 px-2 py-2 text-center align-middle break-keep">
                            {formatApplicationPeriod(row)}
                          </td>
                          <td
                            className={`whitespace-nowrap border border-zinc-200 px-2 py-2 text-center align-middle break-keep tabular-nums ${
                              urgent ? "font-bold text-red-600" : ""
                            }`}
                          >
                            {ddayLabel}
                          </td>
                          <td className="whitespace-nowrap border border-zinc-200 px-2 py-2 text-center align-middle break-keep">
                            {row.ministry}
                          </td>
                          <td className="whitespace-nowrap border border-zinc-200 px-2 py-2 text-center align-middle break-keep">
                            {row.agency}
                          </td>
                          <td className="whitespace-nowrap border border-zinc-200 px-2 py-2 text-center align-middle break-keep">
                            {row.hasFile && row.fileUrl ? (
                              <a
                                href={row.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex rounded p-1.5 text-emerald-700 hover:bg-emerald-50"
                                aria-label="파일 다운로드"
                              >
                                <Download className="h-5 w-5" />
                              </a>
                            ) : row.hasFile ? (
                              <button
                                type="button"
                                className="inline-flex rounded p-1.5 text-emerald-700 hover:bg-emerald-50"
                                aria-label="파일 다운로드"
                              >
                                <Download className="h-5 w-5" />
                              </button>
                            ) : (
                              <span className="text-zinc-400">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
