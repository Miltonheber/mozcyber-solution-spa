"use client";

import { Button } from "@/components/ui";
import { can } from "@/features/auth/permissions";
import { Add } from "@/shared/icons";
import useAuthStore from "@/store/useAuthStore";

export default function NewOccurrenceButton() {
  const user = useAuthStore((s) => s.user);
  if (!can(user, "occurrence:create")) return null;
  return (
    <Button href="/painel/ocorrencias/nova">
      <Add size={18} /> Nova ocorrência
    </Button>
  );
}
