import { useSyncExternalStore } from "react";
import useAuthStore from "@/store/useAuthStore";

const subscribe = (onChange) => {
  const unsubscribe = useAuthStore.persist.onFinishHydration(onChange);
  return unsubscribe;
};

/** `true` quando o zustand já leu a sessão do localStorage (evita redirecionar antes de saber se há sessão). */
export default function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => useAuthStore.persist.hasHydrated(),
    () => false,
  );
}
