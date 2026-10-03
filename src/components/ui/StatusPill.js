import { tv } from "tailwind-variants";

const pillStyles = tv({
  base: "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.8125rem] font-semibold",
  variants: {
    tone: {
      danger: "border-danger-line bg-danger-soft text-danger",
      warn: "border-warn-line bg-warn-soft text-warn",
      safe: "border-safe-line bg-safe-soft text-safe",
      neutral: "border-line bg-paper text-muted",
    },
  },
  defaultVariants: { tone: "neutral" },
});

const DOT = { danger: "bg-danger", warn: "bg-warn", safe: "bg-safe", neutral: "bg-muted" };

export default function StatusPill({ tone = "neutral", children, className }) {
  return (
    <span className={pillStyles({ tone, className })}>
      <span aria-hidden="true" className={`size-1.5 rounded-full ${DOT[tone]}`} />
      {children}
    </span>
  );
}
