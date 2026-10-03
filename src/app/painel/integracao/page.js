import RequirePermission from "@/components/panel/RequirePermission";
import { PageHeader } from "@/components/ui";
import IntegrationDocs from "@/features/occurrences/components/IntegrationDocs";

export const metadata = { title: "Integração" };

export default function IntegracaoPage() {
  return (
    <RequirePermission permission="occurrence:read">
      <PageHeader
        title="Integração com ocorrências"
        description="Como consultar as ocorrências de documentos perdidos a partir do sistema da sua entidade."
      />
      <IntegrationDocs baseUrl={process.env.NEXT_PUBLIC_API_URL ?? "https://api.exemplo.co.mz/api/v1"} />
    </RequirePermission>
  );
}
