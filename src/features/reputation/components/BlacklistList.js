"use client";

import { useState } from "react";
import { Alert, Button, DataTable, Modal, Pagination, RiskMeter, StatusPill } from "@/components/ui";
import DetailList from "@/components/panel/DetailList";
import ListState from "@/components/panel/ListState";
import ListToolbar from "@/components/panel/ListToolbar";
import { can } from "@/features/auth/permissions";
import useAsyncAction from "@/hooks/useAsyncAction";
import useListFilters from "@/hooks/useListFilters";
import usePagedQuery from "@/hooks/usePagedQuery";
import { formatDateTime } from "@/shared/format";
import useAuthStore from "@/store/useAuthStore";
import { CATEGORY_SHORT, NUMBER_STATUS, categoryOptions, formatPhone } from "../constants";
import { listBlacklist, updateBlacklistEntry } from "../services/moderationService";

const statusOptions = Object.entries(NUMBER_STATUS).map(([value, m]) => ({ value, label: m.label }));

function NumberStatusPill({ status }) {
  const meta = NUMBER_STATUS[status] ?? NUMBER_STATUS.unknown;
  return <StatusPill tone={meta.tone}>{meta.label}</StatusPill>;
}

// Acções de moderação disponíveis por estado actual.
const ACTIONS = [
  { status: "blacklisted", label: "Colocar na lista negra", variant: "danger", hide: ["blacklisted"] },
  { status: "suspicious", label: "Marcar como suspeito", variant: "secondary", hide: ["suspicious"] },
  {
    status: "cleared",
    label: "Limpar número",
    variant: "secondary",
    hide: ["cleared"],
    help: "Limpar zera o risco e rejeita as denúncias activas deste número.",
  },
];

function ModerationModal({ entry, canUpdate, onClose, onUpdated }) {
  const action = useAsyncAction((status) => updateBlacklistEntry(entry.id, { status }));
  const current = action.data ?? entry;

  const apply = async (status) => {
    const updated = await action.run(status);
    if (updated) onUpdated(updated);
  };

  return (
    <Modal open onClose={onClose} title={formatPhone(current.number)} description="Reputação do número">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <NumberStatusPill status={current.status} />
          <span className="text-sm text-muted">{CATEGORY_SHORT[current.category] ?? "Sem categoria"}</span>
        </div>
        <RiskMeter value={current.risk_score} tone={(NUMBER_STATUS[current.status] ?? NUMBER_STATUS.unknown).tone} />
        <DetailList
          items={[
            { label: "Denúncias activas", value: current.report_count, mono: true },
            { label: "Análises de mensagens", value: current.classification_count, mono: true },
            { label: "Classificadas como burla", value: current.fraud_count, mono: true },
            { label: "Primeiro registo", value: formatDateTime(current.first_seen_at) },
            { label: "Última denúncia", value: current.last_reported_at ? formatDateTime(current.last_reported_at) : "" },
            { label: "Na lista negra desde", value: current.blacklisted_at ? formatDateTime(current.blacklisted_at) : "" },
          ]}
        />

        {action.error && (
          <Alert tone="danger" title="Não foi possível actualizar">
            {action.error.message}
          </Alert>
        )}

        {canUpdate && (
          <div className="border-t border-line pt-4">
            <p className="mb-3 text-sm font-medium">Moderação</p>
            <div className="flex flex-wrap gap-3">
              {ACTIONS.filter((a) => !a.hide.includes(current.status)).map((a) => (
                <Button key={a.status} variant={a.variant} size="sm" loading={action.loading} onClick={() => apply(a.status)}>
                  {a.label}
                </Button>
              ))}
            </div>
            {current.status !== "cleared" && (
              <p className="mt-3 text-[0.8125rem] text-muted">{ACTIONS[2].help}</p>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}

export default function BlacklistList() {
  const user = useAuthStore((s) => s.user);
  const canUpdate = can(user, "blacklist:update");
  const f = useListFilters({ status: "", category: "" });
  const { data, error, loading, reload } = usePagedQuery(listBlacklist, f.params);
  const [selected, setSelected] = useState(null);
  const filtered = Boolean(f.params.search || f.params.status || f.params.category);

  const columns = [
    {
      key: "number",
      header: "Número",
      render: (n) => (
        <button
          type="button"
          onClick={() => setSelected(n)}
          className="font-mono font-medium text-brand underline-offset-4 hover:underline"
        >
          {formatPhone(n.number)}
        </button>
      ),
    },
    { key: "status", header: "Estado", render: (n) => <NumberStatusPill status={n.status} /> },
    { key: "risk_score", header: "Risco", render: (n) => <span className="font-mono">{n.risk_score}</span> },
    { key: "category", header: "Tipo", hideBelow: "md", render: (n) => CATEGORY_SHORT[n.category] ?? "—" },
    { key: "report_count", header: "Denúncias", hideBelow: "md", render: (n) => <span className="font-mono">{n.report_count}</span> },
    {
      key: "last_reported_at",
      header: "Última denúncia",
      hideBelow: "lg",
      render: (n) => (n.last_reported_at ? formatDateTime(n.last_reported_at) : "—"),
    },
  ];

  return (
    <>
      <ListToolbar
        search={f.values.search}
        onSearch={(v) => f.set("search", v)}
        searchPlaceholder="Número (ex.: 841234567)"
        filters={[
          { name: "status", label: "Todos os estados", value: f.values.status, onChange: (v) => f.set("status", v), options: statusOptions },
          { name: "category", label: "Todos os tipos", value: f.values.category, onChange: (v) => f.set("category", v), options: categoryOptions.map((o) => ({ value: o.value, label: CATEGORY_SHORT[o.value] })) },
        ]}
      />
      <ListState
        data={data}
        error={error}
        emptyTitle={filtered ? "Nenhum número encontrado" : "Ainda não há números registados"}
        emptyText={filtered ? "Experimente alterar a pesquisa ou os filtros." : "Os números analisados ou denunciados aparecem aqui."}
      />
      {data && data.results.length > 0 && (
        <>
          <DataTable columns={columns} rows={data.results} loading={loading} caption="Números e reputação" />
          <Pagination page={f.page} size={f.size} count={data.count} onChange={f.setPage} />
        </>
      )}
      {selected && (
        <ModerationModal
          key={selected.id}
          entry={selected}
          canUpdate={canUpdate}
          onClose={() => setSelected(null)}
          onUpdated={(updated) => {
            setSelected(updated);
            reload();
          }}
        />
      )}
    </>
  );
}
