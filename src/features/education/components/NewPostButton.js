"use client";

import { Button } from "@/components/ui";
import { can } from "@/features/auth/permissions";
import { Add } from "@/shared/icons";
import useAuthStore from "@/store/useAuthStore";

export default function NewPostButton() {
  const user = useAuthStore((s) => s.user);
  if (!can(user, "education:create")) return null;
  return (
    <Button href="/painel/conteudo/nova">
      <Add size={18} /> Nova publicação
    </Button>
  );
}
