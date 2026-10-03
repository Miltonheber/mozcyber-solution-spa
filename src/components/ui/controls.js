import { tv } from "tailwind-variants";
import { cx } from "@/lib/utils";
import { ExpandMore } from "@/shared/icons";

export const controlStyles = tv({
  base: [
    "w-full rounded-control border border-line bg-surface px-3.5 text-base text-ink",
    "placeholder:text-muted/70 transition-colors duration-150",
    "hover:border-muted/60 focus-visible:border-brand focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-brand/30",
    "aria-[invalid=true]:border-danger aria-[invalid=true]:focus-visible:outline-danger/30",
    "disabled:cursor-not-allowed disabled:opacity-60",
  ],
});

export function Input({ className, type = "text", ...props }) {
  return <input type={type} className={cx(controlStyles(), "h-11", className)} {...props} />;
}

export function Textarea({ className, rows = 5, maxLength, value, ...props }) {
  const length = typeof value === "string" ? value.length : 0;
  return (
    <div className="relative">
      <textarea
        rows={rows}
        maxLength={maxLength}
        value={value}
        className={cx(controlStyles(), "resize-y py-2.5 leading-relaxed", maxLength && "pb-7", className)}
        {...props}
      />
      {maxLength && (
        <span
          className="pointer-events-none absolute bottom-2 right-3 font-mono text-[0.6875rem] text-muted"
          aria-hidden="true"
        >
          {length}/{maxLength}
        </span>
      )}
    </div>
  );
}

export function Select({ className, children, ...props }) {
  return (
    <div className="relative">
      <select className={cx(controlStyles(), "h-11 appearance-none pr-10", className)} {...props}>
        {children}
      </select>
      <ExpandMore size={20} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
    </div>
  );
}
