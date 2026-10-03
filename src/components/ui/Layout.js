import { cx } from "@/lib/utils";

export function Container({ className, children, as: Tag = "div", ...props }) {
  return (
    <Tag className={cx("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)} {...props}>
      {children}
    </Tag>
  );
}

export function Panel({ className, children, ...props }) {
  return (
    <div className={cx("rounded-panel border border-line bg-surface", className)} {...props}>
      {children}
    </div>
  );
}

export function SectionHeading({ eyebrow, title, description, as: Tag = "h2", className }) {
  return (
    <div className={cx("max-w-2xl", className)}>
      {eyebrow && (
        <p className="mb-3 text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-brand">{eyebrow}</p>
      )}
      <Tag className="display-lg">{title}</Tag>
      {description && <p className="mt-3 text-lg text-muted">{description}</p>}
    </div>
  );
}
