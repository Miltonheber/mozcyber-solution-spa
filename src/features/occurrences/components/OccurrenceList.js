"use client";

import Link from "next/link";
import { Button, DataTable, Pagination } from "@/components/ui";
import ListState from "@/components/panel/ListState";
import ListToolbar from "@/components/panel/ListToolbar";
import { can } from "@/features/auth/permissions";
import useListFilters from "@/hooks/useListFilters";
import usePagedQuery from "@/hooks/usePagedQuery";
import { formatDate } from "@/shared/format";
import { Add } from "@/shared/icons";
import useAuthStore from "@/store/useAuthStore";
import { DOCUMENT_TYPES, documentTypeOptions, occurrenceStatusOptions } from "../constants";
import { listOccurrences } from "../services/occurrenceService";
import OccurrenceStatusPill from "./OccurrenceStatusPill";

export default function OccurrenceList() {
  const user = useAuthStore((s) => s.user);
  const f = useListFilters({ status: "", document_type: "" });
  const { data, error, loading, reload } = usePagedQuery(listOccurrences, f.params);
  const canCreate = can(user, "occurrence:create");
  const filtered = Boolean(f.params.search || f.params.status || f.params.document_type);

  const columns = [
    {
      key: "reference",
      header: "Referência",
      render: (o) => (
        <Link
          href={`/painel/ocorrencias/${o.id}`}
          className="font-mono font-medium text-brand underline-offset-4 hover:underline"
        >
          {o.reference}
        </Link>
      ),
    },
    {
      key: "document",
      header: "Documento",
      render: (o) => (
        <span className="block">
          <span className="block">{DOCUMENT_TYPES[o.document_type] ?? o.document_type}</span>
          <span className="font-mono text-sm text-muted">{o.document_number}</span>
        </span>
      ),
    },
    { key: "owner_name", header: "Titular" },
    { key: "station_name", header: "Esquadra", hideBelow: "md" },
    { key: "lost_at", header: "Perdido em", hideBelow: "lg", render: (o) => formatDate(o.lost_at) },
    { key: "status", header: "Estado", render: (o) => <OccurrenceStatusPill status={o.status} /> },
  ];

  return (
    <>
      <ListToolbar
        search={f.values.search}
        onSearch={(v) => f.set("search", v)}
        searchPlaceholder="Referência, nº do documento ou titular"
        filters={[
          {
            name: "status",
            label: "Todos os estados",
            value: f.values.status,
            onChange: (v) => f.set("status", v),
            options: occurrenceStatusOptions,
          },
          {
            name: "document_type",
            label: "Todos os documentos",
            value: f.values.document_type,
            onChange: (v) => f.set("document_type", v),
            options: documentTypeOptions,
          },
        ]}
      />

      <ListState
        data={data}
        error={error}
        onRetry={reload}
        emptyTitle={filtered ? "Nenhuma ocorrência encontrada" : "Ainda não há ocorrências"}
        emptyText={filtered ? "Experimente alterar a pesquisa ou os filtros." : "As ocorrências registadas aparecem aqui."}
        emptyAction={
          canCreate && !filtered ? (
            <Button href="/painel/ocorrencias/nova">
              <Add size={18} /> Nova ocorrência
            </Button>
          ) : null
        }
      />

      {data && data.results.length > 0 && (
        <>
          <DataTable columns={columns} rows={data.results} loading={loading} caption="Ocorrências de documentos perdidos" />
          <Pagination page={f.page} size={f.size} count={data.count} onChange={f.setPage} />
        </>
      )}
    </>
  );
}
