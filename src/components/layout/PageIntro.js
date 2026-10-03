import { Container } from "@/components/ui";

/** Cabeçalho comum das páginas interiores. */
export default function PageIntro({ eyebrow, title, description }) {
  return (
    <Container className="pb-8 pt-10 sm:pb-10 sm:pt-14">
      {eyebrow && (
        <p className="mb-3 text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-brand">{eyebrow}</p>
      )}
      <h1 className="display-lg max-w-3xl">{title}</h1>
      {description && <p className="mt-4 max-w-2xl text-lg text-muted">{description}</p>}
    </Container>
  );
}
