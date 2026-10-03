import Link from "next/link";
import { Button, Container, Input, Panel, SectionHeading } from "@/components/ui";
import { TOPICS } from "@/features/education/content";
import { ArrowForward, Icon, Search } from "@/shared/icons";

const STEPS = [
  {
    title: "Copie a mensagem",
    text: "Cole o texto tal como chegou e escreva o número de quem enviou.",
  },
  {
    title: "Receba o veredicto",
    text: "Procuramos sinais de burla e explicamos o que encontrámos, em linguagem simples.",
  },
  {
    title: "Decida com informação",
    text: "Vê também o historial do número e pode denunciá-lo para proteger outros.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-line">
        <Container className="grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <p className="mb-4 text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-brand">
              Contra burlas por SMS e chamada
            </p>
            <h1 className="display-xl">Recebeu uma mensagem estranha? Verifique antes de responder.</h1>
            <p className="mt-6 max-w-xl text-lg text-muted">
              Cole a mensagem e o número. Dizemos-lhe se tem sinais de burla e se outras pessoas já denunciaram este
              número. É gratuito e não precisa de conta.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/verificar" size="lg">
                Verificar mensagem
                <ArrowForward size={20} />
              </Button>
              <Button href="/consultar" size="lg" variant="secondary">
                Consultar um número
              </Button>
            </div>
          </div>

          {/* Exemplo ilustrativo (estático) do tipo de resultado que o utilizador recebe */}
          <figure aria-label="Exemplo de resultado" className="relative">
            <p className="mb-3 text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-muted">Exemplo</p>
            <Panel className="overflow-hidden">
              <div className="border-b border-line px-5 py-4 sm:px-6">
                <p className="text-xs text-muted">Mensagem recebida de +258 84 ••• ••••</p>
                <p className="mt-2 rounded-control bg-paper px-4 py-3 text-[0.9375rem] leading-relaxed">
                  Parabéns! Ganhou 50.000 MT. Envie o seu PIN M-Pesa para levantar o prémio hoje.
                </p>
              </div>
              <div className="border-b border-danger-line bg-danger-soft px-5 py-4 sm:px-6">
                <p className="flex items-center gap-2 text-sm font-semibold text-danger">
                  <Icon name="error" size={20} fill />
                  Provável burla
                </p>
                <p className="mt-1 text-[0.9375rem]">Promete um prémio e pede o PIN. Nenhuma entidade faz isto.</p>
              </div>
              <dl className="grid grid-cols-2 gap-4 px-5 py-4 text-sm sm:px-6">
                <div>
                  <dt className="text-muted">Denúncias</dt>
                  <dd className="font-mono text-base">7</dd>
                </div>
                <div>
                  <dt className="text-muted">Nível de risco</dt>
                  <dd className="font-mono text-base">92/100</dd>
                </div>
              </dl>
            </Panel>
          </figure>
        </Container>
      </section>

      {/* Como funciona */}
      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Como funciona" title="Três passos, menos de um minuto." />
          <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {STEPS.map((step, i) => (
              <li key={step.title} className="border-t border-ink pt-5">
                <span className="font-display text-5xl leading-none text-brand" aria-hidden="true">
                  {i + 1}
                </span>
                <h3 className="mt-5 font-display text-2xl font-medium">{step.title}</h3>
                <p className="mt-2 text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Consulta rápida */}
      <section className="bg-brand-soft py-14 sm:py-16">
        <Container className="grid items-center gap-8 md:grid-cols-[1fr_1fr] md:gap-16">
          <div>
            <h2 className="display-md">Só quer saber se um número é de confiança?</h2>
            <p className="mt-3 max-w-md text-muted">Escreva-o aqui e veja o historial de denúncias.</p>
          </div>
          <form action="/consultar" method="get" role="search" className="flex flex-col gap-3 sm:flex-row">
            <label htmlFor="phone-rapido" className="sr-only">
              Número de telemóvel
            </label>
            <Input
              id="phone-rapido"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="off"
              placeholder="84 123 4567"
              required
              className="sm:flex-1"
            />
            <Button type="submit" size="md" className="sm:px-6">
              <Search size={18} />
              Consultar
            </Button>
          </form>
        </Container>
      </section>

      {/* Prevenção */}
      <section className="py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Prevenção"
            title="Saber como funcionam as burlas é a melhor defesa."
            description="Guias curtos sobre as abordagens mais comuns e como reagir."
          />
          <ul className="border-t border-line">
            {TOPICS.map((topic) => (
              <li key={topic.id} className="border-b border-line">
                <Link
                  href={`/educacao#${topic.id}`}
                  className="group flex items-start gap-4 py-5 outline-offset-4 focus-visible:outline-2 focus-visible:outline-brand"
                >
                  <Icon name={topic.icon} size={26} className="mt-0.5 text-brand" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-lg font-medium group-hover:text-brand">{topic.title}</span>
                    <span className="mt-1 block text-[0.9375rem] text-muted">{topic.intro.split(". ")[0]}.</span>
                  </span>
                  <ArrowForward size={20} className="mt-1 text-muted transition-transform group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Denunciar */}
      <section className="pb-8">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 rounded-panel bg-brand px-6 py-10 text-brand-ink sm:flex-row sm:items-center sm:px-10">
            <div className="max-w-xl">
              <h2 className="display-md">Já foi alvo de uma burla?</h2>
              <p className="mt-2 opacity-90">
                A sua denúncia fica ligada ao número e avisa quem o procurar a seguir.
              </p>
            </div>
            <Link
              href="/denunciar"
              className="inline-flex h-12 shrink-0 items-center gap-2 rounded-control bg-brand-ink px-6 font-medium text-brand transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink"
            >
              Denunciar um número
              <ArrowForward size={20} />
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
