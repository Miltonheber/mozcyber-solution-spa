import { useEffect, useState } from "react";
import { getApiError } from "@/shared/httpErrorMessage";

/**
 * Carrega uma página de resultados e volta a carregar quando `params` mudam.
 * Mantém os dados anteriores enquanto a nova página chega (`loading`) e ignora respostas atrasadas.
 * `fetcher(params)` deve devolver `{results, count, next, previous}` (ver `unwrapPage`).
 */
export default function usePagedQuery(fetcher, params) {
  const key = JSON.stringify(params);
  const [nonce, setNonce] = useState(0);
  const fullKey = `${key}#${nonce}`;
  const [state, setState] = useState({ key: null, data: null, error: null });

  useEffect(() => {
    let cancelled = false;
    fetcher(JSON.parse(key))
      .then((data) => !cancelled && setState({ key: fullKey, data, error: null }))
      .catch((err) => !cancelled && setState((s) => ({ key: fullKey, data: s.data, error: getApiError(err) })));
    return () => {
      cancelled = true;
    };
  }, [fetcher, key, fullKey]);

  const settled = state.key === fullKey;
  return {
    data: state.data,
    error: settled ? state.error : null,
    loading: !settled,
    reload: () => setNonce((n) => n + 1),
  };
}
