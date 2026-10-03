import PageIntro from "@/components/layout/PageIntro";
import { Container } from "@/components/ui";
import HallOfFame from "@/features/reputation/components/HallOfFame";

export const metadata = {
  title: "Hall da fama",
  description: "Os números com pior reputação: os mais denunciados e com maior risco de burla.",
};

export default function HallDaFamaPage() {
  return (
    <>
      <PageIntro
        eyebrow="Hall da fama"
        title="Os números com pior reputação"
        description="Ranking dos números em lista negra, do maior risco para o menor. Toque num número para ver os detalhes."
      />
      <Container className="pb-16">
        <div className="max-w-3xl">
          <HallOfFame />
          <p className="mt-6 text-sm text-muted">
            Um número entra após várias denúncias ou uma classificação de burla com alta confiança. Se acha que um número
            está aqui por engano, a moderação pode retirá-lo.
          </p>
        </div>
      </Container>
    </>
  );
}
