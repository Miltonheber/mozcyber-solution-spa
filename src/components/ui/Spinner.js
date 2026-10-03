import { Progress } from "@/shared/icons";

export default function Spinner({ label = "A carregar…", size = 22, className = "" }) {
  return (
    <span role="status" className={`inline-flex items-center gap-2 text-muted ${className}`}>
      <Progress size={size} className="animate-spin" />
      <span className="text-sm">{label}</span>
    </span>
  );
}
