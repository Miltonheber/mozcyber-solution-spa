import RequirePermission from "@/components/panel/RequirePermission";
import { PageHeader } from "@/components/ui";
import OccurrenceList from "@/features/occurrences/components/OccurrenceList";
import NewOccurrenceButton from "@/features/occurrences/components/NewOccurrenceButton";

export const metadata = { title: "Ocorrências" };

export default function OcorrenciasPage() {
  return (
    <RequirePermission permission="occurrence:read">
      <PageHeader
        title="Ocorrências"
        description="Documentos perdidos registados pelas esquadras. As entidades interessadas podem consultá-los aqui."
        actions={<NewOccurrenceButton />}
      />
      <OccurrenceList />
    </RequirePermission>
  );
}
