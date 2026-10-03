"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader, Panel } from "@/components/ui";
import { ArrowBack } from "@/shared/icons";
import { createOccurrence } from "../services/occurrenceService";
import OccurrenceForm from "./OccurrenceForm";

export default function NewOccurrence() {
  const router = useRouter();
  return (
    <>
      <Link
        href="/painel/ocorrencias"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted underline-offset-4 hover:text-ink hover:underline"
      >
        <ArrowBack size={16} /> Ocorrências
      </Link>
      <PageHeader title="Nova ocorrência" description="Registe um documento perdido. A referência é gerada automaticamente." />
      <Panel className="max-w-3xl p-5 sm:p-6">
        <OccurrenceForm
          onSubmit={createOccurrence}
          onDone={(created) => router.push(`/painel/ocorrencias/${created.id}`)}
          submitLabel="Registar ocorrência"
        />
      </Panel>
    </>
  );
}
