"use client";

import { Download, ChevronLeft } from "lucide-react";
import { useCallback, useState } from "react";
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

export function PublicSupportListView({ onBack }: { onBack: () => void }) {
  const [rows] = useState<PublicSupportNotice[]>(publicSupportMockList);
  const [interest, setInterest] = useState<Record<string, boolean>>({});

  /*
   * [기업마당(Bizinfo) API 연동 뼈대 — useEffect 안에서 비동기 fetch 후 setRows 권장]
   * - 브라우저 직접 호출 시 CORS 제한이 있을 수 있어, 운영에서는 Next.js Route Handler
   *   또는 백엔드 프록시를 통해 호출하는 것이 일반적입니다.
   *
   * useEffect(() => {
   *   let cancelled = false;
   *   (async () => {
   *     const url = new URL("https://www.bizinfo.go.kr/..."); // 실제 공개 API 경로
   *     url.searchParams.set("page", "1");
   *     const res = await fetch(url.toString(), {
   *       headers: { Accept: "application/json" },
   *     });
   *     if (!res.ok) throw new Error(await res.text());
   *     const json = await res.json();
   *     const mapped: PublicSupportNotice[] = mapBizinfoItems(json);
   *     if (!cancelled) setRows(mapped); // useState에 setRows를 함께 선언할 것
   *   })();
   *   return () => {
   *     cancelled = true;
   *   };
   * }, []);
   */

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

      <div className="min-h-0 flex-1 overflow-hidden p-4">
        <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
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
                        {row.hasFile ? (
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
      </div>
    </div>
  );
}
