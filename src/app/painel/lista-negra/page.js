import RequirePermission from "@/components/panel/RequirePermission";
import { PageHeader } from "@/components/ui";
import BlacklistList from "@/features/reputation/components/BlacklistList";

export const metadata = { title: "Lista negra" };

export default function ListaNegraPage() {
  return (
    <RequirePermission permission="blacklist:read">
      <PageHeader
        title="Lista negra"
        description="Reputação de todos os números analisados ou denunciados. Abra um número para o moderar."
      />
      <BlacklistList />
    </RequirePermission>
  );
}
