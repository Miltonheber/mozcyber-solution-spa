import { cx } from "@/lib/utils";

export default function Wordmark({ className }) {
  return (
    <span className={cx("font-display text-[1.375rem] leading-none tracking-tight", className)}>
      Vi<span className="font-semibold text-brand">gia</span>
    </span>
  );
}
