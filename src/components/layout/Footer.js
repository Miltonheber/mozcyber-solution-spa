import Link from "next/link";
import { Container } from "@/components/ui";
import { NAV } from "./nav";
import Wordmark from "./Wordmark";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <Container className="grid gap-10 py-12 md:grid-cols-[1.4fr_1fr]">
        <div>
          <Wordmark />
          <p className="mt-4 max-w-md text-[0.9375rem] text-muted">
            Ajudamos a reconhecer burlas por SMS, chamada e WhatsApp. A análise é automática e indicativa. Se perdeu
            dinheiro, contacte de imediato a sua operadora ou banco e apresente queixa na esquadra mais próxima.
          </p>
        </div>
        <nav aria-label="Rodapé">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-[0.9375rem]">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-muted underline-offset-4 hover:text-ink hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
      <div className="border-t border-line">
        <Container className="py-5 text-[0.8125rem] text-muted">
          © {new Date().getFullYear()} Vigia. Não pedimos nunca PIN, palavras-passe nem códigos.
        </Container>
      </div>
    </footer>
  );
}
