"use client";

import { useEffect, useId, useRef } from "react";
import { cx, focusRing } from "@/lib/utils";
import { Close } from "@/shared/icons";

/** Diálogo modal sobre `<dialog>` nativo: foco preso, Esc fecha, clique fora fecha. */
export default function Modal({ open, onClose, title, description, children, footer, size = "md" }) {
  const ref = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby={titleId}
      className={cx(
        "m-auto w-[calc(100%-2rem)] rounded-panel border border-line bg-surface p-0 text-ink shadow-xl",
        "backdrop:bg-ink/50",
        "transition duration-200 starting:open:scale-95 starting:open:opacity-0 motion-reduce:transition-none",
        size === "lg" ? "max-w-2xl" : "max-w-lg",
      )}
    >
      {open && (
        <div className="flex max-h-[85vh] flex-col">
          <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
            <div className="min-w-0">
              <h2 id={titleId} className="display-md !text-xl">
                {title}
              </h2>
              {description && <p className="mt-1 text-sm text-muted">{description}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className={cx(
                "-mr-2 grid size-9 shrink-0 place-items-center rounded-control text-muted hover:bg-brand-soft hover:text-ink",
                focusRing,
              )}
            >
              <Close size={22} />
            </button>
          </div>
          <div className="overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
          {footer && (
            <div className="flex flex-wrap justify-end gap-3 border-t border-line px-5 py-4 sm:px-6">{footer}</div>
          )}
        </div>
      )}
    </dialog>
  );
}
