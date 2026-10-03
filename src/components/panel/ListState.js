import { Alert, EmptyState, Spinner } from "@/components/ui";

/** Estados comuns de uma listagem: erro, a carregar (1ª vez) e vazio. Devolve `null` se há dados a mostrar. */
export default function ListState({ data, error, emptyTitle, emptyText, emptyAction }) {
  if (error) {
    return (
      <Alert tone="danger" title="Não foi possível carregar a lista">
        {error.message}
      </Alert>
    );
  }
  if (!data) {
    return (
      <div className="py-14 text-center">
        <Spinner />
      </div>
    );
  }
  if (data.results.length === 0) {
    return (
      <div className="rounded-panel border border-line bg-surface">
        <EmptyState title={emptyTitle} action={emptyAction}>
          {emptyText}
        </EmptyState>
      </div>
    );
  }
  return null;
}
