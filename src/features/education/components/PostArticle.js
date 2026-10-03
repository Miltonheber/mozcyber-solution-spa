"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Alert, EmptyState, Spinner, StatusPill } from "@/components/ui";
import { getApiError } from "@/shared/httpErrorMessage";
import { formatDate } from "@/shared/format";
import { ArrowBack } from "@/shared/icons";
import { TOPIC_LABELS } from "../constants";
import { getPublicPost } from "../services/postService";

/** Texto simples: parágrafos separados por linha em branco, quebras simples preservadas. */
export function PostBody({ body }) {
  return (
    <div className="flex flex-col gap-5 text-lg leading-relaxed">
      {body
        .split(/\n{2,}/)
        .filter((p) => p.trim())
        .map((paragraph, i) => (
          <p key={i} className="whitespace-pre-line">
            {paragraph.trim()}
          </p>
        ))}
    </div>
  );
}

export default function PostArticle({ slug }) {
  const [result, setResult] = useState({ slug: null, post: null, error: null });

  useEffect(() => {
    let cancelled = false;
    getPublicPost(slug)
      .then((post) => !cancelled && setResult({ slug, post, error: null }))
      .catch((err) => !cancelled && setResult({ slug, post: null, error: { ...getApiError(err), status: err.response?.status } }));
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const settled = result.slug === slug;
  const { post, error } = result;

  return (
    <article className="mx-auto w-full max-w-3xl px-4 pb-10 pt-10 sm:px-6 sm:pt-14">
      <Link
        href="/educacao"
        className="inline-flex items-center gap-1.5 text-sm text-muted underline-offset-4 hover:text-ink hover:underline"
      >
        <ArrowBack size={16} /> Todos os guias
      </Link>

      {!settled && (
        <div className="py-16">
          <Spinner />
        </div>
      )}

      {settled && error?.status === 404 && (
        <div className="mt-8 rounded-panel border border-line bg-surface">
          <EmptyState icon="article" title="Este guia não está disponível">
            Pode ter sido removido ou ainda não estar publicado.
          </EmptyState>
        </div>
      )}

      {settled && error && error.status !== 404 && (
        <div className="mt-8">
          <Alert tone="danger" title="Não foi possível carregar o guia">
            {error.message}
          </Alert>
        </div>
      )}

      {settled && post && (
        <>
          <header className="mt-8">
            <div className="flex items-center gap-3">
              <StatusPill tone="neutral">{TOPIC_LABELS[post.topic] ?? post.topic}</StatusPill>
              <time className="text-sm text-muted" dateTime={post.published_at}>
                {formatDate(post.published_at)}
              </time>
            </div>
            <h1 className="display-lg mt-4">{post.title}</h1>
            {post.summary && <p className="mt-4 text-xl text-muted">{post.summary}</p>}
          </header>
          <div className="mt-10 border-t border-line pt-8">
            <PostBody body={post.body} />
          </div>
        </>
      )}
    </article>
  );
}
