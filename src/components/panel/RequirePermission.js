"use client";

import { EmptyState } from "@/components/ui";
import { can } from "@/features/auth/permissions";
import useAuthStore from "@/store/useAuthStore";

/** Mostra `children` só se o utilizador tiver TODAS as permissões. A API continua a validar (403). */
export default function RequirePermission({ permission, children }) {
  const user = useAuthStore((s) => s.user);
  const codes = [permission].flat();
  if (!can(user, ...codes)) {
    return (
      <EmptyState icon="lock" title="Sem acesso a esta área">
        A sua conta não tem permissão para ver esta página. Fale com um administrador se precisar de acesso.
      </EmptyState>
    );
  }
  return children;
}
