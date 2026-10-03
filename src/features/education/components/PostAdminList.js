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
import { STATUS_LABELS, TOPIC_LABELS, topicOptions } from "../constants";
import { listPosts } from "../services/postService";
import PostStatusPill from "./PostStatusPill";

const statusOptions = Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }));

export default function PostAdminList() {
  const user = useAuthStore((s) => s.user);
  const f = useListFilters({ status: "", topic: "" });
  const { data, error, loading } = usePagedQuery(listPosts, f.params);
  const canCreate = can(user, "education:create");
  const filtered = Boolean(f.params.search || f.params.status || f.params.topic);

  const columns = [
    {
      key: "title",
      header: "Título",
      render: (p) => (
        <Link href={`/painel/conteudo/${p.id}`} className="font-medium text-brand underline-offset-4 hover:underline">
          {p.title}
        </Link>
      ),
    },
    { key: "topic", header: "Tema", hideBelow: "md", render: (p) => TOPIC_LABELS[p.topic] ?? p.topic },
    { key: "status", header: "Estado", render: (p) => <PostStatusPill status={p.status} /> },
    { key: "updated_at", header: "Actualizado", hideBelow: "lg", render: (p) => formatDate(p.updated_at) },
  ];

  return (
    <>
      <ListToolbar
        search={f.values.search}
        onSearch={(v) => f.set("search", v)}
        searchPlaceholder="Título ou resumo"
        filters={[
          {
            name: "status",
            label: "Todos os estados",
            value: f.values.status,
            onChange: (v) => f.set("status", v),
            options: statusOptions,
          },
          {
            name: "topic",
            label: "Todos os temas",
            value: f.values.topic,
            onChange: (v) => f.set("topic", v),
            options: topicOptions,
          },
        ]}
      />
      <ListState
        data={data}
        error={error}
        emptyTitle={filtered ? "Nenhuma publicação encontrada" : "Ainda não há publicações"}
        emptyText={filtered ? "Experimente alterar a pesquisa ou os filtros." : "Crie o primeiro guia de prevenção."}
        emptyAction={
          canCreate && !filtered ? (
            <Button href="/painel/conteudo/nova">
              <Add size={18} /> Nova publicação
            </Button>
          ) : null
        }
      />
      {data && data.results.length > 0 && (
        <>
          <DataTable columns={columns} rows={data.results} loading={loading} caption="Publicações educativas" />
          <Pagination page={f.page} size={f.size} count={data.count} onChange={f.setPage} />
        </>
      )}
    </>
  );
}
