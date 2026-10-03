import { cx } from "@/lib/utils";

/**
 * Tabela simples. `columns`: [{ key, header, render?(row), className?, hideBelow?: "md"|"lg" }].
 * `rowKey` identifica a linha. A primeira coluna deve conter o controlo acessível (link/botão).
 */
const HIDE = { md: "hidden md:table-cell", lg: "hidden lg:table-cell" };

export default function DataTable({ columns, rows, rowKey = (r) => r.id, loading = false, caption }) {
  return (
    <div
      className={cx("overflow-x-auto rounded-panel border border-line bg-surface", loading && "opacity-60")}
      aria-busy={loading}
    >
      <table className="w-full min-w-full text-left text-[0.9375rem]">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className="border-b border-line text-[0.8125rem] uppercase tracking-[0.06em] text-muted">
            {columns.map((c) => (
              <th key={c.key} scope="col" className={cx("px-4 py-3 font-semibold", HIDE[c.hideBelow], c.className)}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)} className="border-b border-line last:border-0 hover:bg-brand-soft/50">
              {columns.map((c) => (
                <td key={c.key} className={cx("px-4 py-3 align-middle", HIDE[c.hideBelow], c.className)}>
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
