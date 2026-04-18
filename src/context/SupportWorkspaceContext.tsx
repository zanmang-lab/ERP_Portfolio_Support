"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  INITIAL_DOCUMENT_REGISTRY_IDS,
  type DocumentTypeId,
} from "@/data/businessApplicationMock";
import type { PublicSupportNotice } from "@/data/publicSupportMock";

function rowKey(noticeId: string, docTypeId: DocumentTypeId): string {
  return `${noticeId}:${docTypeId}`;
}

export type SupportWorkspaceValue = {
  /** 공고탐색에서 「사업 진행」 확정된 공고 스냅샷 */
  promotedNotices: Record<string, PublicSupportNotice>;
  /** [서류관리]에 포함된 서류 유형 ID (데모 + 업로드로 추가) */
  documentRegistry: Set<DocumentTypeId>;
  /** 사업신청 화면에서 행별로 업로드해 충족한 (noticeId:docTypeId) */
  applicationRowUploadKeys: Set<string>;
  isPromoted: (noticeId: string) => boolean;
  promoteNotice: (notice: PublicSupportNotice) => void;
  removePromotedNotice: (noticeId: string) => void;
  /** 사업신청 탭에서 파일 선택 시 해당 행 충족 처리 */
  markApplicationRowUploaded: (
    noticeId: string,
    docTypeId: DocumentTypeId,
    _fileName?: string,
  ) => void;
  /** 서류 유형이 레지스트리에 있으면 서류관리 보유로 간주 */
  isDocTypeInRegistry: (docTypeId: DocumentTypeId) => boolean;
  /** 행 충족: 레지스트리 또는 해당 행 업로드 */
  isRequirementSatisfied: (
    noticeId: string,
    docTypeId: DocumentTypeId,
  ) => boolean;
};

const SupportWorkspaceContext = createContext<SupportWorkspaceValue | null>(
  null,
);

export function SupportWorkspaceProvider({ children }: { children: ReactNode }) {
  const [promotedNotices, setPromotedNotices] = useState<
    Record<string, PublicSupportNotice>
  >({});
  const [documentRegistry, setDocumentRegistry] = useState<Set<DocumentTypeId>>(
    () => new Set(INITIAL_DOCUMENT_REGISTRY_IDS),
  );
  const [applicationRowUploadKeys, setApplicationRowUploadKeys] = useState<
    Set<string>
  >(() => new Set());

  const isPromoted = useCallback(
    (noticeId: string) => Boolean(promotedNotices[noticeId]),
    [promotedNotices],
  );

  const promoteNotice = useCallback((notice: PublicSupportNotice) => {
    setPromotedNotices((prev) => ({ ...prev, [notice.id]: { ...notice } }));
  }, []);

  const removePromotedNotice = useCallback((noticeId: string) => {
    setPromotedNotices((prev) => {
      if (!(noticeId in prev)) return prev;
      const next = { ...prev };
      delete next[noticeId];
      return next;
    });
    setApplicationRowUploadKeys((prev) => {
      const next = new Set(prev);
      for (const k of prev) {
        if (k.startsWith(`${noticeId}:`)) next.delete(k);
      }
      return next;
    });
  }, []);

  const markApplicationRowUploaded = useCallback(
    (noticeId: string, docTypeId: DocumentTypeId, _fileName?: string) => {
      setApplicationRowUploadKeys((prev) => {
        const next = new Set(prev);
        next.add(rowKey(noticeId, docTypeId));
        return next;
      });
    },
    [],
  );

  const isDocTypeInRegistry = useCallback(
    (docTypeId: DocumentTypeId) => documentRegistry.has(docTypeId),
    [documentRegistry],
  );

  const isRequirementSatisfied = useCallback(
    (noticeId: string, docTypeId: DocumentTypeId) =>
      documentRegistry.has(docTypeId) ||
      applicationRowUploadKeys.has(rowKey(noticeId, docTypeId)),
    [documentRegistry, applicationRowUploadKeys],
  );

  const value = useMemo<SupportWorkspaceValue>(
    () => ({
      promotedNotices,
      documentRegistry,
      applicationRowUploadKeys,
      isPromoted,
      promoteNotice,
      removePromotedNotice,
      markApplicationRowUploaded,
      isDocTypeInRegistry,
      isRequirementSatisfied,
    }),
    [
      promotedNotices,
      documentRegistry,
      applicationRowUploadKeys,
      isPromoted,
      promoteNotice,
      removePromotedNotice,
      markApplicationRowUploaded,
      isDocTypeInRegistry,
      isRequirementSatisfied,
    ],
  );

  return (
    <SupportWorkspaceContext.Provider value={value}>
      {children}
    </SupportWorkspaceContext.Provider>
  );
}

export function useSupportWorkspace(): SupportWorkspaceValue {
  const ctx = useContext(SupportWorkspaceContext);
  if (!ctx) {
    throw new Error(
      "useSupportWorkspace must be used within SupportWorkspaceProvider",
    );
  }
  return ctx;
}
