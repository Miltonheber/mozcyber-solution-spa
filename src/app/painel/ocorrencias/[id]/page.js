import RequirePermission from "@/components/panel/RequirePermission";
import OccurrenceDetail from "@/features/occurrences/components/OccurrenceDetail";

export const metadata = { title: "Ocorrência" };

export default async function OcorrenciaPage({ params }) {
  const { id } = await params;
  return (
    <RequirePermission permission="occurrence:read">
      <OccurrenceDetail id={id} />
    </RequirePermission>
  );
}
