"use client";

import { useState } from "react";
import { Alert, Button, DataTable, Field, Modal, Pagination, StatusPill, Textarea } from "@/components/ui";
import DetailList from "@/components/panel/DetailList";
import ListState from "@/components/panel/ListState";
import ListToolbar from "@/components/panel/ListToolbar";
import { can } from "@/features/auth/permissions";
import useAsyncAction from "@/hooks/useAsyncAction";
import { toast } from "@/store/useToastStore";
import useListFilters from "@/hooks/useListFilters";
import usePagedQuery from "@/hooks/usePagedQuery";
import { formatDateTime } from "@/shared/format";
import useAuthStore from "@/store/useAuthStore";
import {
  CATEGORY_SHORT,
  CHANNEL_LABELS,
  REPORT_STATUS,
  categoryOptions,
  channelOptions,
  formatPhone,
} from "../constants";
import { listReports, updateReport } from "../services/moderationService";

const statusOptions = Object.entries(REPORT_STATUS).map(([value, m]) => ({ value, label: m.label }));

function ReportStatusPill({ status }) {
  const meta = REPORT_STATUS[status] ?? { label: status, tone: "neutral" };
  return <StatusPill tone={meta.tone}>{meta.label}</StatusPill>;
}

function ReportModal({ report, canUpdate, onClose, onUpdated }) {
  const [note, setNote] = useState(report.moderation_note ?? "");
  const action = useAsyncAction((status) => updateReport(report.id, { status, moderation_note: note.trim() }));
  const current = action.data ?? report;

  const apply = async (status) => {
    const updated = await action.run(status);
    if (updated) {
      toast("Denúncia actualizada.");
      onUpdated(updated);
    }
  };

  return (
    <Modal open onClose={onClose} size="lg" title={`Denúncia · ${formatPhone(current.number)}`}>
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <ReportStatusPill status={current.status} />
          <span className="text-sm text-muted">Recebida em {formatDateTime(current.created_at)}</span>
        </div>

        <DetailList
          items={[
            { label: "Tipo de burla", value: CATEGORY_SHORT[current.category] },
            { label: "Canal", value: CHANNEL_LABELS[current.channel] },
            { label: "Valor perdido", value: current.amount_lost ? `${current.amount_lost} MT` : "" },
            { label: "Contacto de quem denunciou", value: current.reporter_contact },
            { label: "O que aconteceu", value: current.behavior, wide: true },
          ]}
        />

        {action.error && (
          <Alert tone="danger" title="Não foi possível actualizar">
            {action.error.message}
          </Alert>
        )}

        {canUpdate && (
          <div className="flex flex-col gap-4 border-t border-line pt-4">
            <Field label="Nota de moderação" optional hint="Visível só para a equipa.">
              <Textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
            </Field>
            <div className="flex flex-wrap gap-3">
              {current.status !== "confirmed" && (
                <Button size="sm" loading={action.loading} onClick={() => apply("confirmed")}>
                  Confirmar denúncia
                </Button>
              )}
              {current.status !== "rejected" && (
                <Button variant="secondary" size="sm" loading={action.loading} onClick={() => apply("rejected")}>
                  Rejeitar
                </Button>
              )}
              {current.status !== "pending" && (
                <Button variant="ghost" size="sm" loading={action.loading} onClick={() => apply("pending")}>
                  Voltar a pendente
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default function ReportsList() {
  const user = useAuthStore((s) => s.user);
  const canUpdate = can(user, "report:update");
  const f = useListFilters({ status: "pending", category: "", channel: "" });
  const { data, error, loading, reload } = usePagedQuery(listReports, f.params);
  const [selected, setSelected] = useState(null);
  const filtered = Boolean(f.params.search || f.params.category || f.params.channel);

  const columns = [
    {
      key: "number",
      header: "Número",
      render: (r) => (
        <button
          type="button"
          onClick={() => setSelected(r)}
          className="font-mono font-medium text-brand underline-offset-4 hover:underline"
        >
          {formatPhone(r.number)}
        </button>
      ),
    },
    { key: "category", header: "Tipo", render: (r) => CATEGORY_SHORT[r.category] ?? r.category },
    { key: "channel", header: "Canal", hideBelow: "md", render: (r) => CHANNEL_LABELS[r.channel] ?? r.channel },
    { key: "status", header: "Estado", render: (r) => <ReportStatusPill status={r.status} /> },
    { key: "created_at", header: "Recebida", hideBelow: "lg", render: (r) => formatDateTime(r.created_at) },
  ];

  return (
    <>
      <ListToolbar
        search={f.values.search}
        onSearch={(v) => f.set("search", v)}
        searchPlaceholder="Número ou texto da denúncia"
        filters={[
          { name: "status", label: "Todos os estados", value: f.values.status, onChange: (v) => f.set("status", v), options: statusOptions },
          { name: "category", label: "Todos os tipos", value: f.values.category, onChange: (v) => f.set("category", v), options: categoryOptions.map((o) => ({ value: o.value, label: CATEGORY_SHORT[o.value] })) },
          { name: "channel", label: "Todos os canais", value: f.values.channel, onChange: (v) => f.set("channel", v), options: channelOptions },
        ]}
      />
      <ListState
        data={data}
        error={error}
        onRetry={reload}
        emptyTitle={filtered || f.params.status ? "Nenhuma denúncia encontrada" : "Ainda não há denúncias"}
        emptyText={f.params.status === "pending" && !filtered ? "Não há denúncias pendentes. Bom trabalho." : "Experimente alterar a pesquisa ou os filtros."}
      />
      {data && data.results.length > 0 && (
        <>
          <DataTable columns={columns} rows={data.results} loading={loading} caption="Denúncias recebidas" />
          <Pagination page={f.page} size={f.size} count={data.count} onChange={f.setPage} />
        </>
      )}
      {selected && (
        <ReportModal
          key={selected.id}
          report={selected}
          canUpdate={canUpdate}
          onClose={() => setSelected(null)}
          onUpdated={() => {
            setSelected(null);
            reload();
          }}
        />
      )}
    </>
  );
}
