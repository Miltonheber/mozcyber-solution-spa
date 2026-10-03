"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Alert, Button, EmptyState, Modal, PageHeader, Panel, Spinner } from "@/components/ui";
import { can } from "@/features/auth/permissions";
import useAsyncAction from "@/hooks/useAsyncAction";
import { toast } from "@/store/useToastStore";
import { getApiError } from "@/shared/httpErrorMessage";
import { ArrowBack, Delete } from "@/shared/icons";
import useAuthStore from "@/store/useAuthStore";
import { createPost, deletePost, getPost, updatePost } from "../services/postService";
import PostForm from "./PostForm";
import PostStatusPill from "./PostStatusPill";

const back = (
  <Link
    href="/painel/conteudo"
    className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted underline-offset-4 hover:text-ink hover:underline"
  >
    <ArrowBack size={16} /> Conteúdo educativo
  </Link>
);

export function NewPost() {
  const router = useRouter();
  return (
    <>
      {back}
      <PageHeader title="Nova publicação" description="Fica como rascunho até a publicar." />
      <Panel className="max-w-3xl p-5 sm:p-6">
        <PostForm onSubmit={createPost} onDone={(post) => router.push(`/painel/conteudo/${post.id}`)} submitLabel="Criar publicação" />
      </Panel>
    </>
  );
}

export function EditPost({ id }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const canUpdate = can(user, "education:update");
  const canDelete = can(user, "education:delete");
  const [result, setResult] = useState({ id: null, post: null, error: null });
  const [saved, setSaved] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const remove = useAsyncAction(() => deletePost(id));

  useEffect(() => {
    let cancelled = false;
    getPost(id)
      .then((post) => !cancelled && setResult({ id, post, error: null }))
      .catch((err) =>
        !cancelled && setResult({ id, post: null, error: { ...getApiError(err), status: err.response?.status } }),
      );
    return () => {
      cancelled = true;
    };
  }, [id]);

  const confirmDelete = async () => {
    if (await remove.run()) {
      toast("Publicação removida.");
      router.replace("/painel/conteudo");
    }
  };

  if (result.id !== id) {
    return (
      <>
        {back}
        <div className="py-14 text-center">
          <Spinner />
        </div>
      </>
    );
  }
  if (result.error) {
    return (
      <>
        {back}
        {result.error.status === 404 ? (
          <Panel>
            <EmptyState icon="article" title="Publicação não encontrada" />
          </Panel>
        ) : (
          <Alert tone="danger" title="Não foi possível carregar a publicação">
            {result.error.message}
          </Alert>
        )}
      </>
    );
  }

  const post = result.post;
  return (
    <>
      {back}
      <PageHeader
        title={post.title}
        description={
          post.status === "published" ? (
            <Link href={`/educacao/${post.slug}`} className="underline underline-offset-4 hover:text-ink">
              Ver no site
            </Link>
          ) : (
            "Rascunho: ainda não visível no site."
          )
        }
        actions={
          <>
            <PostStatusPill status={post.status} />
            {canDelete && (
              <Button variant="secondary" size="sm" onClick={() => setConfirming(true)}>
                <Delete size={18} /> Remover
              </Button>
            )}
          </>
        }
      />

      {saved && (
        <div className="mb-4">
          <Alert tone="success" title="Alterações guardadas." />
        </div>
      )}

      {canUpdate ? (
        <Panel className="max-w-3xl p-5 sm:p-6">
          <PostForm
            key={post.updated_at}
            initial={post}
            onSubmit={(data) => updatePost(id, data)}
            onDone={(updated) => {
              setResult({ id, post: updated, error: null });
              setSaved(true);
            }}
            submitLabel="Guardar alterações"
          />
        </Panel>
      ) : (
        <Alert tone="info">A sua conta pode ver esta publicação, mas não editá-la.</Alert>
      )}

      <Modal
        open={confirming}
        onClose={() => setConfirming(false)}
        title="Remover publicação?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirming(false)}>
              Cancelar
            </Button>
            <Button variant="danger" loading={remove.loading} onClick={confirmDelete}>
              Remover
            </Button>
          </>
        }
      >
        <p>
          “{post.title}” deixa de existir e de estar visível no site. Esta acção não pode ser desfeita.
        </p>
        {remove.error && (
          <div className="mt-4">
            <Alert tone="danger">{remove.error.message}</Alert>
          </div>
        )}
      </Modal>
    </>
  );
}
