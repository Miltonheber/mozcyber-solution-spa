import { Alert, Button, EmptyState, Skeleton } from "@/components/ui";

/**
 * Estados comuns de uma listagem: erro, a carregar (1ª vez) e vazio. Devolve `null` se há dados a mostrar.
 * `onRetry` (ex.: o `reload` de `usePagedQuery`) acrescenta o botão "Tentar novamente" ao erro.
 */
export default function ListState({ data, error, onRetry, emptyTitle, emptyText, emptyAction }) {
  if (error) {
    return (
      <Alert tone="danger" title="Não foi possível carregar a lista">
        <p>{error.message}</p>
        {onRetry && (
          <Button variant="secondary" size="sm" className="mt-3" onClick={onRetry}>
            Tentar novamente
          </Button>
        )}
      </Alert>
    );
  }
  if (!data) {
    return (
      <div role="status" aria-live="polite" className="space-y-3 rounded-panel border border-line bg-surface p-4">
        <span className="sr-only">A carregar a lista…</span>
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-10" />
        ))}
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
