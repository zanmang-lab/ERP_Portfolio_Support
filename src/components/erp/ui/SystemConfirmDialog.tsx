"use client";

import { useEffect, useId, useRef } from "react";

type SystemConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function SystemConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "확인",
  cancelLabel = "취소",
  onConfirm,
  onCancel,
}: SystemConfirmDialogProps) {
  const titleId = useId();
  const descId = useId();
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    confirmRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4"
      role="presentation"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="w-full max-w-[22rem] rounded border border-zinc-400 bg-[#f0f0f0] shadow-[2px_2px_0_#1f2937]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-zinc-300 bg-gradient-to-b from-[#e8e8e8] to-[#d8d8d8] px-3 py-2">
          <h2
            id={titleId}
            className="text-sm font-semibold text-zinc-900"
          >
            {title}
          </h2>
        </div>
        <div className="px-3 py-3">
          <p id={descId} className="text-sm leading-relaxed text-zinc-800">
            {message}
          </p>
        </div>
        <div className="flex justify-end gap-2 border-t border-zinc-300 bg-[#e4e4e4] px-3 py-2">
          <button
            type="button"
            onClick={onCancel}
            className="min-h-8 min-w-[4.5rem] rounded border border-zinc-400 bg-white px-3 text-sm text-zinc-800 shadow-sm hover:bg-zinc-50"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            className="min-h-8 min-w-[4.5rem] rounded border border-zinc-500 bg-zinc-200 px-3 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-300"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
