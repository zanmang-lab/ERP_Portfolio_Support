"use client";

import { Download, ChevronLeft } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
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
};

export function PublicSupportListView({ onBack }: { onBack: () => void }) {
  const [rows, setRows] = useState<PublicSupportNotice[]>([]);
  const [interest, setInterest] = useState<Record<string, boolean>>({});
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [errorText, setErrorText] = useState<string | null>(null);
  const [usingMock, setUsingMock] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadState("loading");
      setErrorText(null);
      setUsingMock(false);
      try {
        const res = await fetch("/api/bizinfo/support-notices", {
          cache: "no-store",
        });
        const json = (await res.json()) as ApiPayload;

        if (cancelled) return;

        if (res.status === 503 && json.code === "missing_key") {
          setRows(publicSupportMockList);
          setUsingMock(true);
          setErrorText(json.message ?? null);
          setLoadState("ready");
          return;
        }

        if (!res.ok || !json.ok) {
          setRows([]);
          setErrorText(
            json.message ?? `목록을 불러오지 못했습니다. (${res.status})`,
          );
          setLoadState("error");
          return;
        }

        setRows(Array.isArray(json.items) ? json.items : []);
        setLoadState("ready");
      } catch (e) {
        if (!cancelled) {
          setRows([]);
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

      <div className="min-h-0 flex-1 overflow-hidden p-4">
        <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
          {loadState === "loading" ? (
            <div className="flex flex-1 items-center justify-center p-8 text-sm text-zinc-500">
              목록을 불러오는 중…
            </div>
          ) : (
            <div className="min-h-0 flex-1 overflow-auto">
              <table className="w-full min-w-[56rem] border-collapse text-sm">
                <thead className="sticky top-0 z-10 bg-rose-100 text-red-900 shadow-sm">
                  <tr>
                    <th className="border border-rose-200/80 px-2 py-2.5 text-center text-xs font-semibold">
                      관심목록추가
                    </th>
                    <th className="border border-rose-200/80 px-2 py-2.5 text-center text-xs font-semibold">
                      지원분야
                    </th>
                    <th className="border border-rose-200/80 px-2 py-2.5 text-center text-xs font-semibold">
                      공고사업명
                    </th>
                    <th className="border border-rose-200/80 px-2 py-2.5 text-center text-xs font-semibold whitespace-nowrap">
                      신청기간
                    </th>
                    <th className="border border-rose-200/80 px-2 py-2.5 text-center text-xs font-semibold">
                      마감 D-DAY
                    </th>
                    <th className="border border-rose-200/80 px-2 py-2.5 text-center text-xs font-semibold">
                      소관부처
                    </th>
                    <th className="border border-rose-200/80 px-2 py-2.5 text-center text-xs font-semibold">
                      사업수행기관
                    </th>
                    <th className="border border-rose-200/80 px-2 py-2.5 text-center text-xs font-semibold">
                      파일다운로드
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white text-zinc-800">
                  {rows.length === 0 && loadState === "ready" ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="border border-zinc-200 px-4 py-8 text-center text-sm text-zinc-500"
                      >
                        조건에 맞는 진행 중 공고가 없습니다.
                      </td>
                    </tr>
                  ) : null}
                  {rows.map((row) => {
                    const daysUntil = getDaysUntilDeadline(row.deadline);
                    const ddayLabel = formatDdayLabel(daysUntil);
                    const urgent = isDeadlineWithinThreeDays(daysUntil);
                    return (
                      <tr key={row.id} className="hover:bg-zinc-50/80">
                        <td className="border border-zinc-200 px-2 py-2 text-center align-middle">
                          <input
                            type="checkbox"
                            checked={!!interest[row.id]}
                            onChange={() => toggleInterest(row.id)}
                            className="h-4 w-4 rounded border-zinc-400 text-blue-600"
                            aria-label={`${row.title} 관심목록`}
                          />
                        </td>
                        <td className="border border-zinc-200 px-2 py-2 text-center align-middle">
                          {row.field}
                        </td>
                        <td className="border border-zinc-200 px-2 py-2 align-top text-left whitespace-normal break-words">
                          {row.title}
                        </td>
                        <td className="border border-zinc-200 px-2 py-2 text-center align-middle whitespace-nowrap">
                          {formatApplicationPeriod(row)}
                        </td>
                        <td
                          className={`border border-zinc-200 px-2 py-2 text-center align-middle tabular-nums ${
                            urgent ? "font-bold text-red-600" : ""
                          }`}
                        >
                          {ddayLabel}
                        </td>
                        <td className="border border-zinc-200 px-2 py-2 text-center align-middle">
                          {row.ministry}
                        </td>
                        <td className="border border-zinc-200 px-2 py-2 text-center align-middle">
                          {row.agency}
                        </td>
                        <td className="border border-zinc-200 px-2 py-2 text-center align-middle">
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
          )}
        </div>
      </div>
    </div>
  );
}
