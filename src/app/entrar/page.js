import Link from "next/link";
import Wordmark from "@/components/layout/Wordmark";
import { Panel } from "@/components/ui";
import LoginForm from "@/features/auth/components/LoginForm";
import { ArrowBack } from "@/shared/icons";

export const metadata = {
  title: "Entrar",
  robots: { index: false, follow: false },
};

export default async function EntrarPage({ searchParams }) {
  const { next } = await searchParams;
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-12">
      <Panel className="p-6 sm:p-8">
        <Link href="/" className="mx-auto mb-6 flex w-fit rounded-control">
          <Wordmark className="text-2xl" />
        </Link>
        <h1 className="display-md text-center">Entrar no painel</h1>
        <div className="mt-6">
          <LoginForm next={typeof next === "string" ? next : undefined} />
        </div>
      </Panel>
      <Link
        href="/"
        className="mt-6 inline-flex w-fit items-center gap-1.5 text-sm text-muted underline-offset-4 hover:text-ink hover:underline"
      >
        <ArrowBack size={16} /> Voltar ao site
      </Link>
    </main>
  );
}
