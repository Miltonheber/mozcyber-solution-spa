import { useState } from "react";
import useDebouncedValue from "./useDebouncedValue";

/**
 * Estado de uma listagem filtrável: filtros + pesquisa (com debounce) + página.
 * Mudar um filtro volta à página 1. `params` está pronto para `usePagedQuery`.
 */
export default function useListFilters(initial = {}, { size = 15 } = {}) {
  const [values, setValues] = useState({ search: "", ...initial });
  const [page, setPage] = useState(1);
  const search = useDebouncedValue(values.search.trim(), 400);

  const set = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }));
    setPage(1);
  };

  const filters = Object.fromEntries(
    Object.entries({ ...values, search }).filter(([, v]) => v !== "" && v != null),
  );
  return { values, set, page, setPage, size, params: { page, size, ...filters } };
}
