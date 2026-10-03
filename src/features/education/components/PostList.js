"use client";

import Link from "next/link";
import { useState } from "react";
import { Alert, EmptyState, Pagination, Spinner, StatusPill } from "@/components/ui";
import usePagedQuery from "@/hooks/usePagedQuery";
import { cx, focusRing } from "@/lib/utils";
import { formatDate } from "@/shared/format";
import { ArrowForward } from "@/shared/icons";
import { TOPIC_LABELS, topicOptions } from "../constants";
import { listPublicPosts } from "../services/postService";

const PAGE_SIZE = 6;

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cx(
        "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
        active ? "border-brand bg-brand text-brand-ink" : "border-line bg-surface text-muted hover:border-brand hover:text-ink",
        focusRing,
      )}
    >
      {children}
    </button>
  );
}

/** Publicações educativas vindas da API, com filtro por tema. */
export default function PostList() {
  const [topic, setTopic] = useState("");
  const [page, setPage] = useState(1);
  const params = { page, size: PAGE_SIZE, ...(topic && { topic }) };
  const { data, error, loading } = usePagedQuery(listPublicPosts, params);

  const choose = (value) => {
    setTopic(value);
    setPage(1);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por tema">
        <Chip active={topic === ""} onClick={() => choose("")}>
          Todos
        </Chip>
        {topicOptions.map((t) => (
          <Chip key={t.value} active={topic === t.value} onClick={() => choose(t.value)}>
            {t.label}
          </Chip>
        ))}
      </div>

      <div className="mt-6" aria-live="polite">
        {error && <Alert tone="danger" title="Não foi possível carregar as publicações">{error.message}</Alert>}

        {!data && !error && <Spinner />}

        {data && data.results.length === 0 && !error && (
          <div className="rounded-panel border border-line bg-surface">
            <EmptyState icon="article" title="Ainda não há publicações neste tema">
              Enquanto isso, os guias rápidos mais abaixo têm o essencial.
            </EmptyState>
          </div>
        )}

        {data && data.results.length > 0 && (
          <>
            <ul className={cx("grid gap-4 md:grid-cols-2", loading && "opacity-60")}>
              {data.results.map((post) => (
                <li key={post.id}>
                  <Link
                    href={`/educacao/${post.slug}`}
                    className="group flex h-full flex-col rounded-panel border border-line bg-surface p-5 transition-colors hover:border-brand"
                  >
                    <span className="flex items-center justify-between gap-3">
                      <StatusPill tone="neutral">{TOPIC_LABELS[post.topic] ?? post.topic}</StatusPill>
                      <time className="text-xs text-muted" dateTime={post.published_at}>
                        {formatDate(post.published_at)}
                      </time>
                    </span>
                    <span className="mt-4 font-display text-xl leading-snug group-hover:text-brand">{post.title}</span>
                    {post.summary && <span className="mt-2 text-[0.9375rem] text-muted">{post.summary}</span>}
                    <span className="mt-4 inline-flex items-center gap-1.5 pt-1 text-sm font-medium text-brand">
                      Ler guia <ArrowForward size={16} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Pagination page={page} size={PAGE_SIZE} count={data.count} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
