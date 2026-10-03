import RequirePermission from "@/components/panel/RequirePermission";
import { EditPost } from "@/features/education/components/PostEditor";

export const metadata = { title: "Editar publicação" };

export default async function PublicacaoPage({ params }) {
  const { id } = await params;
  return (
    <RequirePermission permission="education:read">
      <EditPost id={id} />
    </RequirePermission>
  );
}
