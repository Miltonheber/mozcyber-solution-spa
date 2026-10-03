import RequirePermission from "@/components/panel/RequirePermission";
import { NewPost } from "@/features/education/components/PostEditor";

export const metadata = { title: "Nova publicação" };

export default function NovaPublicacaoPage() {
  return (
    <RequirePermission permission="education:create">
      <NewPost />
    </RequirePermission>
  );
}
