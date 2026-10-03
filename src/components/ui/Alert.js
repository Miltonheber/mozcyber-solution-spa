import { tv } from "tailwind-variants";
import { CheckCircle, ErrorCircle, Info, Warning } from "@/shared/icons";

const alertStyles = tv({
  base: "flex gap-3 rounded-control border px-4 py-3 text-[0.9375rem] leading-snug",
  variants: {
    tone: {
      info: "border-line bg-brand-soft text-ink",
      success: "border-safe-line bg-safe-soft text-ink",
      warning: "border-warn-line bg-warn-soft text-ink",
      danger: "border-danger-line bg-danger-soft text-ink",
    },
  },
  defaultVariants: { tone: "info" },
});

const ICONS = {
  info: [Info, "text-brand"],
  success: [CheckCircle, "text-safe"],
  warning: [Warning, "text-warn"],
  danger: [ErrorCircle, "text-danger"],
};

export default function Alert({ tone = "info", title, children, className }) {
  const [IconComponent, iconColor] = ICONS[tone];
  const urgent = tone === "danger" || tone === "warning";
  return (
    <div role={urgent ? "alert" : "status"} className={alertStyles({ tone, className })}>
      <IconComponent size={20} className={`mt-0.5 ${iconColor}`} />
      <div className="min-w-0">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className={title ? "mt-0.5 text-muted" : ""}>{children}</div>}
      </div>
    </div>
  );
}
