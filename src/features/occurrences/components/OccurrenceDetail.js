"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Alert, Button, EmptyState, Modal, PageHeader, Panel, Spinner } from "@/components/ui";
import DetailList from "@/components/panel/DetailList";
import { can } from "@/features/auth/permissions";
import useAsyncAction from "@/hooks/useAsyncAction";
import { formatDate, formatDateTime } from "@/shared/format";
import { getApiError } from "@/shared/httpErrorMessage";
import { ArrowBack, Edit } from "@/shared/icons";
import useAuthStore from "@/store/useAuthStore";
import { DOCUMENT_TYPES } from "../constants";
import { getOccurrence, updateOccurrence } from "../services/occurrenceService";
import OccurrenceForm from "./OccurrenceForm";
import OccurrenceStatusPill from "./OccurrenceStatusPill";

const QUICK = {
  open: [
    { status: "found", label: "Marcar como encontrado", variant: "secondary" },
    { status: "closed", label: "Fechar ocorrência", variant: "secondary" },
  ],
  found: [
    { status: "closed", label: "Fechar ocorrência", variant: "secondary" },
    { status: "open", label: "Reabrir", variant: "ghost" },
  ],
  closed: [{ status: "open", label: "Reabrir", variant: "secondary" }],
};

export default function OccurrenceDetail({ id }) {
  const user = useAuthStore((s) => s.user);
  const canUpdate = can(user, "occurrence:update");
  const [result, setResult] = useState({ id: null, occurrence: null, error: null });
  const [editing, setEditing] = useState(false);
  const quick = useAsyncAction((status) => updateOccurrence(id, { status }));

  useEffect(() => {
    let cancelled = false;
    getOccurrence(id)
      .then((occurrence) => !cancelled && setResult({ id, occurrence, error: null }))
      .catch((err) =>
        !cancelled && setResult({ id, occurrence: null, error: { ...getApiError(err), status: err.response?.status } }),
      );
    return () => {
      cancelled = true;
    };
  }, [id]);

  const settled = result.id === id;
  const occurrence = quick.data ?? result.occurrence;
  const error = result.error;

  const back = (
    <Link
      href="/painel/ocorrencias"
      className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted underline-offset-4 hover:text-ink hover:underline"
    >
      <ArrowBack size={16} /> Ocorrências
    </Link>
  );

  if (!settled) {
    return (
      <>
        {back}
        <div className="py-14 text-center">
          <Spinner />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        {back}
        {error.status === 404 ? (
          <Panel>
            <EmptyState icon="assignment" title="Ocorrência não encontrada">
              Pode ter sido removida ou a ligação está incorrecta.
            </EmptyState>
          </Panel>
        ) : (
          <Alert tone="danger" title="Não foi possível carregar a ocorrência">
            {error.message}
          </Alert>
        )}
      </>
    );
  }

  const o = occurrence;
  return (
    <>
      {back}
      <PageHeader
        title={<span className="font-mono">{o.reference}</span>}
        description={`Registada em ${formatDateTime(o.created_at)}${o.registered_by ? ` por ${o.registered_by}` : ""}.`}
        actions={
          <>
            <OccurrenceStatusPill status={o.status} />
            {canUpdate && (
              <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
                <Edit size={18} /> Editar
              </Button>
            )}
          </>
        }
      />

      {quick.error && (
        <div className="mb-4">
          <Alert tone="danger" title="Não foi possível actualizar o estado">
            {quick.error.message}
          </Alert>
        </div>
      )}

      <Panel className="p-5 sm:p-6">
        <DetailList
          items={[
            { label: "Tipo de documento", value: DOCUMENT_TYPES[o.document_type] ?? o.document_type },
            { label: "Número do documento", value: o.document_number, mono: true },
            { label: "Titular", value: o.owner_name },
            { label: "Contacto do titular", value: o.owner_contact },
            { label: "Perdido em", value: formatDate(o.lost_at) },
            { label: "Local", value: o.location },
            { label: "Esquadra", value: o.station_name },
            { label: "Fechada em", value: o.closed_at ? formatDateTime(o.closed_at) : "" },
            { label: "Descrição", value: o.description, wide: true },
          ]}
        />
      </Panel>

      {canUpdate && (
        <div className="mt-5 flex flex-wrap gap-3">
          {(QUICK[o.status] ?? []).map((a) => (
            <Button key={a.status} variant={a.variant} loading={quick.loading} onClick={() => quick.run(a.status)}>
              {a.label}
            </Button>
          ))}
        </div>
      )}

      <Modal open={editing} onClose={() => setEditing(false)} title="Editar ocorrência" size="lg">
        <OccurrenceForm
          initial={o}
          onSubmit={(data) => updateOccurrence(id, data)}
          onDone={(saved) => {
            setResult({ id, occurrence: saved, error: null });
            quick.reset();
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
          submitLabel="Guardar alterações"
        />
      </Modal>
    </>
  );
}
