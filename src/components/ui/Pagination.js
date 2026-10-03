import Button from "./Button";
import { ChevronLeft, ChevronRight } from "@/shared/icons";

/** Paginação por número de página (`?page=&size=`). */
export default function Pagination({ page, size, count, onChange }) {
  const pages = Math.max(1, Math.ceil(count / size));
  if (count === 0) return null;
  const from = (page - 1) * size + 1;
  const to = Math.min(count, page * size);
  return (
    <nav aria-label="Paginação" className="flex items-center justify-between gap-3 pt-4 text-sm">
      <p className="text-muted">
        <span className="font-mono text-ink">
          {from}–{to}
        </span>{" "}
        de <span className="font-mono text-ink">{count}</span>
      </p>
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>
          <ChevronLeft size={18} /> Anterior
        </Button>
        <span className="px-1 text-muted">
          {page}/{pages}
        </span>
        <Button variant="secondary" size="sm" disabled={page >= pages} onClick={() => onChange(page + 1)}>
          Seguinte <ChevronRight size={18} />
        </Button>
      </div>
    </nav>
  );
}
