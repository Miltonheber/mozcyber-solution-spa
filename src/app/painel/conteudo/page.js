import RequirePermission from "@/components/panel/RequirePermission";
import { PageHeader } from "@/components/ui";
import NewPostButton from "@/features/education/components/NewPostButton";
import PostAdminList from "@/features/education/components/PostAdminList";

export const metadata = { title: "Conteúdo educativo" };

export default function ConteudoPage() {
  return (
    <RequirePermission permission="education:read">
      <PageHeader
        title="Conteúdo educativo"
        description="Guias de prevenção. Só os publicados aparecem no site."
        actions={<NewPostButton />}
      />
      <PostAdminList />
    </RequirePermission>
  );
}
