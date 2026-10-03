import RequirePermission from "@/components/panel/RequirePermission";
import { PageHeader } from "@/components/ui";
import ReportsList from "@/features/reputation/components/ReportsList";

export const metadata = { title: "Denúncias" };

export default function DenunciasPage() {
  return (
    <RequirePermission permission="report:read">
      <PageHeader
        title="Denúncias"
        description="Denúncias enviadas pelo público. Cada denúncia activa conta para a reputação do número."
      />
      <ReportsList />
    </RequirePermission>
  );
}
