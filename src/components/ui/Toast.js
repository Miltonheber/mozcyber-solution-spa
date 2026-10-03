"use client";

import { useEffect } from "react";
import { cx, focusRing } from "@/lib/utils";
import { CheckCircle, Close, ErrorCircle, Info } from "@/shared/icons";
import useToastStore from "@/store/useToastStore";

const TONES = {
  success: [CheckCircle, "text-safe"],
  danger: [ErrorCircle, "text-danger"],
  info: [Info, "text-brand"],
};

const DURATION_MS = 5000;

function ToastItem({ toast }) {
  const dismiss = useToastStore((s) => s.dismiss);
  const [IconComponent, iconColor] = TONES[toast.tone] ?? TONES.info;

  useEffect(() => {
    const timer = setTimeout(() => dismiss(toast.id), DURATION_MS);
    return () => clearTimeout(timer);
  }, [toast.id, dismiss]);

  return (
    <li className="pointer-events-auto flex items-start gap-3 rounded-control border border-line bg-surface px-4 py-3 text-[0.9375rem] shadow-xl transition duration-200 starting:translate-y-2 starting:opacity-0 motion-reduce:transition-none">
      <IconComponent size={20} className={cx("mt-0.5 shrink-0", iconColor)} />
      <p className="min-w-0 flex-1">{toast.message}</p>
      <button
        type="button"
        onClick={() => dismiss(toast.id)}
        aria-label="Fechar notificação"
        className={cx("-mr-1.5 -mt-0.5 grid size-7 shrink-0 place-items-center rounded-control text-muted hover:text-ink", focusRing)}
      >
        <Close size={18} />
      </button>
    </li>
  );
}

/** Zona de notificações. Montar uma vez por layout; as mensagens vêm de `toast()` em `store/useToastStore`. */
export default function ToastViewport() {
  const toasts = useToastStore((s) => s.toasts);
  return (
    <ul
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col gap-2 sm:left-auto sm:right-6 sm:w-96"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </ul>
  );
}
