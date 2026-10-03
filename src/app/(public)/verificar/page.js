import PageIntro from "@/components/layout/PageIntro";
import { Container } from "@/components/ui";
import ClassifyForm from "@/features/reputation/components/ClassifyForm";

export const metadata = {
  title: "Verificar mensagem",
  description: "Cole uma mensagem e o número de quem a enviou para saber se tem sinais de burla.",
};

export default function VerificarPage() {
  return (
    <>
      <PageIntro
        eyebrow="Verificar mensagem"
        title="A mensagem que recebeu é de confiança?"
        description="Indique o número e cole o texto. Dizemos-lhe se há sinais de burla e o que a reputação do número mostra."
      />
      <Container>
        <div className="max-w-3xl">
          <ClassifyForm />
        </div>
      </Container>
    </>
  );
}
