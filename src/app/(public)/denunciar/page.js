import PageIntro from "@/components/layout/PageIntro";
import { Container } from "@/components/ui";
import ReportForm from "@/features/reputation/components/ReportForm";

export const metadata = {
  title: "Denunciar número",
  description: "Denuncie um número usado em tentativas de burla para proteger outras pessoas.",
};

export default async function DenunciarPage({ searchParams }) {
  const { phone } = await searchParams;
  return (
    <>
      <PageIntro
        eyebrow="Denunciar"
        title="Denuncie um número suspeito"
        description="Cada denúncia ajuda a avisar outras pessoas. Demora menos de dois minutos e não precisa de criar conta."
      />
      <Container>
        <div className="max-w-3xl">
          <ReportForm initialPhone={typeof phone === "string" ? phone : ""} />
        </div>
      </Container>
    </>
  );
}
