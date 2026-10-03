import PageIntro from "@/components/layout/PageIntro";
import { Container, SectionHeading } from "@/components/ui";
import PostList from "@/features/education/components/PostList";
import { TOPICS } from "@/features/education/content";
import { Icon } from "@/shared/icons";

export const metadata = {
  title: "Aprender a proteger-se",
  description: "Guias práticos sobre burlas, engenharia social, protecção de PIN e códigos e troca de SIM.",
};

export default function EducacaoPage() {
  return (
    <>
      <PageIntro
        eyebrow="Aprender"
        title="Reconheça a burla antes de cair nela"
        description="Guias e alertas para reconhecer burlas, escritos para serem lidos num minuto e partilhados com quem mais precisa."
      />
      <Container className="pb-16">
        <SectionHeading as="h2" title="Últimas publicações" />
        <div className="mt-6">
          <PostList />
        </div>
      </Container>

      <Container className="border-t border-line pt-14">
        <SectionHeading
          as="h2"
          title="Guias rápidos"
          description="O essencial sobre cada tipo de burla, num minuto de leitura."
        />
      </Container>
      <Container className="grid gap-12 pt-10 lg:grid-cols-[14rem_1fr] lg:gap-16">
        <nav aria-label="Neste guia" className="lg:sticky lg:top-24 lg:self-start">
          <p className="mb-3 text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-muted">Neste guia</p>
          <ul className="flex flex-col gap-1 text-[0.9375rem]">
            {TOPICS.map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`} className="block rounded-control py-1.5 text-muted hover:text-brand">
                  {t.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-16">
          {TOPICS.map((topic) => (
            <article key={topic.id} id={topic.id} className="max-w-2xl">
              <Icon name={topic.icon} size={28} className="text-brand" />
              <h2 className="display-md mt-3">{topic.title}</h2>
              <p className="mt-3 text-lg text-muted">{topic.intro}</p>

              <h3 className="mt-8 text-sm font-semibold uppercase tracking-[0.1em] text-danger">Sinais de alerta</h3>
              <ul className="mt-3 flex flex-col gap-2.5">
                {topic.redFlags.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-danger" />
                    {item}
                  </li>
                ))}
              </ul>

              <h3 className="mt-8 text-sm font-semibold uppercase tracking-[0.1em] text-brand">O que fazer</h3>
              <ol className="mt-3 flex flex-col gap-3">
                {topic.tips.map((item, i) => (
                  <li key={item} className="flex gap-4">
                    <span className="w-5 shrink-0 font-display text-xl leading-snug text-brand" aria-hidden="true">
                      {i + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </article>
          ))}
          <p className="max-w-2xl border-t border-line pt-6 text-sm text-muted">
            Mais guias e alertas sobre burlas recentes serão publicados aqui.
          </p>
        </div>
      </Container>
    </>
  );
}
