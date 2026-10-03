import PageIntro from "@/components/layout/PageIntro";
import { Container } from "@/components/ui";
import NumberLookup from "@/features/reputation/components/NumberLookup";

export const metadata = {
  title: "Consultar número",
  description: "Veja se um número de telemóvel tem denúncias ou sinais de burla.",
};

export default async function ConsultarPage({ searchParams }) {
  const { phone } = await searchParams;
  return (
    <>
      <PageIntro
        eyebrow="Consultar número"
        title="Este número tem historial de burlas?"
        description="Escreva um número e veja o que já sabemos: denúncias, tipo de burla e nível de risco."
      />
      <Container>
        <div className="max-w-3xl">
          <NumberLookup initialPhone={typeof phone === "string" ? phone : ""} />
        </div>
      </Container>
    </>
  );
}
