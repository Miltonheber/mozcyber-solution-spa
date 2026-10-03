"use client";

import { Children, cloneElement, useId } from "react";
import { cx } from "@/lib/utils";

/** Liga label, ajuda e erro ao controlo filho (id, aria-describedby, aria-invalid). */
export default function Field({ label, hint, error, optional = false, className, children }) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  const control = Children.only(children);

  return (
    <div className={cx("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 text-sm font-medium">
        <span>{label}</span>
        {optional && <span className="text-xs font-normal text-muted">Opcional</span>}
      </label>
      {cloneElement(control, {
        id,
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : undefined,
      })}
      {hint && (
        <p id={hintId} className="text-[0.8125rem] leading-snug text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-[0.8125rem] font-medium leading-snug text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
