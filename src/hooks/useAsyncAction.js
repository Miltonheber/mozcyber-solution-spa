import { useState } from "react";
import { getApiError } from "@/shared/httpErrorMessage";

const IDLE = { status: "idle", data: null, error: null };

/** Estado de uma acção assíncrona: idle | loading | success | error (com `error.message` e `error.errors` por campo). */
export default function useAsyncAction(action) {
  const [state, setState] = useState(IDLE);

  const run = async (...args) => {
    setState({ status: "loading", data: null, error: null });
    try {
      const data = await action(...args);
      setState({ status: "success", data, error: null });
      return data;
    } catch (err) {
      setState({ status: "error", data: null, error: getApiError(err) });
      return null;
    }
  };

  return { ...state, loading: state.status === "loading", run, reset: () => setState(IDLE) };
}
