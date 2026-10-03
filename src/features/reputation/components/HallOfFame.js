"use client";

import Link from "next/link";
import { useState } from "react";
import { Alert, EmptyState, Pagination, RiskMeter, Spinner } from "@/components/ui";
import usePagedQuery from "@/hooks/usePagedQuery";
import { cx, focusRing } from "@/lib/utils";
import { CATEGORY_SHORT, categoryOptions, formatPhone } from "../constants";
import { listHallOfFame } from "../services/reputationService";

const PAGE_SIZE = 10;

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cx(
        "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
        active ? "border-brand bg-brand text-brand-ink" : "border-line bg-surface text-muted hover:border-brand hover:text-ink",
        focusRing,
      )}
    >
      {children}
    </button>
  );
}

/** Ranking público dos números em lista negra, do maior risco para o menor. */
export default function HallOfFame() {
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const params = { page, size: PAGE_SIZE, ...(category && { category }) };
  const { data, error, loading } = usePagedQuery(listHallOfFame, params);

  const choose = (value) => {
    setCategory(value);
    setPage(1);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por tipo de burla">
        <Chip active={category === ""} onClick={() => choose("")}>
          Todos
        </Chip>
        {categoryOptions.map((c) => (
          <Chip key={c.value} active={category === c.value} onClick={() => choose(c.value)}>
            {CATEGORY_SHORT[c.value]}
          </Chip>
        ))}
      </div>

      <div className="mt-6" aria-live="polite">
        {error && <Alert tone="danger" title="Não foi possível carregar o ranking">{error.message}</Alert>}
        {!data && !error && <Spinner />}

        {data && data.results.length === 0 && !error && (
          <div className="rounded-panel border border-line bg-surface">
            <EmptyState icon="block" title="Ainda não há números neste ranking">
              Os números só entram aqui depois de várias denúncias ou de uma classificação de burla com alta confiança.
            </EmptyState>
          </div>
        )}

        {data && data.results.length > 0 && (
          <>
            <ol className={cx("flex flex-col gap-3", loading && "opacity-60")}>
              {data.results.map((item, i) => (
                <li key={item.number}>
                  <Link
                    href={`/consultar?phone=${encodeURIComponent(item.number)}`}
                    className="group grid grid-cols-[2.5rem_1fr] items-center gap-x-4 gap-y-3 rounded-panel border border-line bg-surface p-4 transition-colors hover:border-brand sm:grid-cols-[2.5rem_1fr_12rem] sm:p-5"
                  >
                    <span className="font-display text-2xl text-brand" aria-label={`Posição ${(page - 1) * PAGE_SIZE + i + 1}`}>
                      {(page - 1) * PAGE_SIZE + i + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="block break-all font-mono text-lg group-hover:text-brand">
                        {formatPhone(item.number)}
                      </span>
                      <span className="text-sm text-muted">
                        {CATEGORY_SHORT[item.category] ?? "Por classificar"} · {item.report_count}{" "}
                        {item.report_count === 1 ? "denúncia" : "denúncias"}
                      </span>
                    </span>
                    <span className="col-span-2 sm:col-span-1">
                      <RiskMeter value={item.risk_score} tone="danger" />
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
            <Pagination page={page} size={PAGE_SIZE} count={data.count} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
