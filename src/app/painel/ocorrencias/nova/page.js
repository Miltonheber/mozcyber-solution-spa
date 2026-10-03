import RequirePermission from "@/components/panel/RequirePermission";
import NewOccurrence from "@/features/occurrences/components/NewOccurrence";

export const metadata = { title: "Nova ocorrência" };

export default function NovaOcorrenciaPage() {
  return (
    <RequirePermission permission="occurrence:create">
      <NewOccurrence />
    </RequirePermission>
  );
}
