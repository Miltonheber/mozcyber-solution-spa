import { Icon } from "@/shared/icons";

export default function EmptyState({ icon = "inbox", title, children, action }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <Icon name={icon} size={32} className="text-muted" />
      <p className="mt-3 text-base font-medium">{title}</p>
      {children && <p className="mt-1 max-w-sm text-sm text-muted">{children}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
