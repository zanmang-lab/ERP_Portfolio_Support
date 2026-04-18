"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Check,
  ChevronLeft,
  Folder,
  Upload,
  X,
} from "lucide-react";
import { useSupportWorkspace } from "@/context/SupportWorkspaceContext";
import {
  documentTypeName,
  getRequiredDocIdsForNotice,
} from "@/data/businessApplicationMock";
import type { PublicSupportNotice } from "@/data/publicSupportMock";

function titleFirstLine(title: string): string {
  const i = title.indexOf("\n");
  return i === -1 ? title : title.slice(0, i);
}

export function BusinessApplicationStageView({
  onBack,
}: {
  onBack: () => void;
}) {
  const {
    promotedNotices,
    documentRegistry,
    applicationRowUploadKeys,
    isRequirementSatisfied,
    markApplicationRowUploaded,
  } = useSupportWorkspace();

  const noticeList = useMemo(() => {
    return Object.values(promotedNotices).sort((a, b) =>
      a.id.localeCompare(b.id),
    );
  }, [promotedNotices]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [completedIds, setCompletedIds] = useState<Set<string>>(
    () => new Set(),
  );
  const folderScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (noticeList.length === 0) {
      setSelectedId(null);
      return;
    }
    setSelectedId((prev) => {
      if (prev && noticeList.some((n) => n.id === prev)) return prev;
      return noticeList[0]?.id ?? null;
    });
  }, [noticeList]);

  const selectedNotice: PublicSupportNotice | null = useMemo(() => {
    if (!selectedId) return null;
    return promotedNotices[selectedId] ?? null;
  }, [promotedNotices, selectedId]);

  const requiredDocIds = useMemo(
    () =>
      selectedNotice ? getRequiredDocIdsForNotice(selectedNotice.id) : [],
    [selectedNotice],
  );

  const allSatisfied = useMemo(() => {
    if (!selectedNotice || requiredDocIds.length === 0) return false;
    return requiredDocIds.every((docId) =>
      isRequirementSatisfied(selectedNotice.id, docId),
    );
  }, [selectedNotice, requiredDocIds, isRequirementSatisfied]);

  const selectedIndex = useMemo(
    () =>
      selectedId
        ? noticeList.findIndex((n) => n.id === selectedId)
        : -1,
    [noticeList, selectedId],
  );

  const scrollFolders = useCallback((dir: -1 | 1) => {
    const el = folderScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 200, behavior: "smooth" });
  }, []);

  const selectPrevNotice = useCallback(() => {
    if (noticeList.length <= 1) {
      scrollFolders(-1);
      return;
    }
    const next =
      selectedIndex <= 0 ? noticeList.length - 1 : selectedIndex - 1;
    setSelectedId(noticeList[next]?.id ?? null);
  }, [noticeList, selectedIndex, scrollFolders]);

  const handleCompleteApplication = useCallback(() => {
    if (!selectedNotice || !allSatisfied) return;
    setCompletedIds((prev) => new Set(prev).add(selectedNotice.id));
    window.alert("데모: 사업 신청이 완료 처리되었습니다.");
  }, [selectedNotice, allSatisfied]);

  const isCompletedForSelected = Boolean(
    selectedNotice && completedIds.has(selectedNotice.id),
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
        <h1 className="text-base font-semibold text-zinc-900">사업 신청</h1>
      </header>

      <div className="min-h-0 flex-1 overflow-auto p-4">
        {noticeList.length === 0 ? (
          <div className="mx-auto max-w-3xl rounded-lg border border-dashed border-zinc-300 bg-white px-6 py-12 text-center text-sm text-zinc-600">
            공고탐색에서 「사업 진행」으로 표시한 공고가 없습니다.
            <br />
            공고 목록에서 사업 진행을 확정하면 이 화면에 연계됩니다.
          </div>
        ) : (
          <div className="mx-auto flex max-w-5xl flex-col gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={selectPrevNotice}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-700 shadow-sm hover:bg-zinc-50"
                aria-label="이전 사업"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div
                ref={folderScrollRef}
                className="flex min-h-[5.5rem] min-w-0 flex-1 gap-2 overflow-x-auto overflow-y-hidden pb-1 pt-0.5"
              >
                {noticeList.map((n) => {
                  const active = n.id === selectedId;
                  return (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => setSelectedId(n.id)}
                      className={`flex min-w-[7.5rem] max-w-[10rem] shrink-0 flex-col items-center gap-1.5 rounded-lg border px-2 py-2 text-center transition ${
                        active
                          ? "border-rose-400 bg-rose-50 ring-2 ring-rose-200"
                          : "border-zinc-200 bg-white hover:border-zinc-300"
                      }`}
                    >
                      <Folder
                        className={`h-8 w-8 shrink-0 ${active ? "text-rose-600" : "text-amber-600"}`}
                        strokeWidth={1.5}
                        aria-hidden
                      />
                      <span className="line-clamp-2 w-full text-[0.7rem] font-medium leading-tight text-zinc-800">
                        {titleFirstLine(n.title)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedNotice ? (
              <>
                <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
                  <div className="border-b border-zinc-200 bg-rose-50/80 px-4 py-2">
                    <p className="text-xs font-medium text-zinc-500">
                      선택된 사업
                    </p>
                    <p className="mt-0.5 whitespace-pre-line text-sm font-semibold text-zinc-900">
                      {selectedNotice.title}
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] table-fixed border-collapse text-sm">
                      <thead>
                        <tr className="bg-rose-100 text-red-900">
                          <th
                            scope="col"
                            className="border border-rose-200/80 px-4 py-2.5 text-left text-xs font-semibold"
                          >
                            필요서류목록
                          </th>
                          <th
                            scope="col"
                            className="w-28 border border-rose-200/80 px-4 py-2.5 text-center text-xs font-semibold"
                          >
                            보유여부
                          </th>
                          <th
                            scope="col"
                            className="w-32 border border-rose-200/80 px-4 py-2.5 text-center text-xs font-semibold"
                          >
                            서류업로드
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-zinc-800">
                        {requiredDocIds.map((docTypeId) => {
                          const satisfied = isRequirementSatisfied(
                            selectedNotice.id,
                            docTypeId,
                          );
                          const rowKey = `${selectedNotice.id}:${docTypeId}`;
                          const uploadedHere =
                            applicationRowUploadKeys.has(rowKey);
                          const inRegistry = documentRegistry.has(docTypeId);
                          const statusTitle = satisfied
                            ? uploadedHere
                              ? "본 화면에서 업로드하여 충족"
                              : inRegistry
                                ? "서류관리 등록 서류로 충족"
                                : "충족"
                            : undefined;
                          const showCheck = satisfied;
                          return (
                            <tr
                              key={docTypeId}
                              className="border-b border-zinc-100 hover:bg-zinc-50/80"
                            >
                              <td className="border-x border-zinc-200 px-4 py-2.5 align-middle">
                                {documentTypeName(docTypeId)}
                              </td>
                              <td className="border-x border-zinc-200 px-4 py-2.5 text-center align-middle">
                                {showCheck ? (
                                  <span
                                    className="inline-flex items-center justify-center gap-1 text-emerald-600"
                                    title={statusTitle}
                                  >
                                    <Check
                                      className="h-5 w-5"
                                      strokeWidth={2.5}
                                      aria-label="보유"
                                    />
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center justify-center text-red-500">
                                    <X
                                      className="h-5 w-5"
                                      strokeWidth={2.5}
                                      aria-label="미보유"
                                    />
                                  </span>
                                )}
                              </td>
                              <td className="border-x border-zinc-200 px-4 py-2 text-center align-middle">
                                <label className="inline-flex cursor-pointer items-center justify-center rounded p-1.5 text-emerald-700 hover:bg-emerald-50">
                                  <input
                                    type="file"
                                    className="sr-only"
                                    onChange={(e) => {
                                      const f = e.target.files?.[0];
                                      if (f) {
                                        markApplicationRowUploaded(
                                          selectedNotice.id,
                                          docTypeId,
                                          f.name,
                                        );
                                      }
                                      e.target.value = "";
                                    }}
                                  />
                                  <Upload className="h-5 w-5" aria-hidden />
                                  <span className="sr-only">
                                    {documentTypeName(docTypeId)} 업로드
                                  </span>
                                </label>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-center pt-2">
                  <button
                    type="button"
                    disabled={!allSatisfied || isCompletedForSelected}
                    onClick={handleCompleteApplication}
                    className="min-w-[12rem] rounded-lg border border-zinc-400 bg-zinc-800 px-6 py-3 text-sm font-semibold text-white shadow-sm transition enabled:hover:bg-zinc-900 disabled:cursor-not-allowed disabled:border-zinc-200 disabled:bg-zinc-300 disabled:text-zinc-500"
                  >
                    {isCompletedForSelected
                      ? "사업 신청 완료됨"
                      : "사업 신청 완료"}
                  </button>
                </div>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
