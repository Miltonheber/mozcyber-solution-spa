"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Alert, Button, Input, Field } from "@/components/ui";
import { getApiError } from "@/shared/httpErrorMessage";
import { ArrowForward } from "@/shared/icons";
import { looksLikePhone } from "../constants";
import useDebouncedValue from "../hooks/useDebouncedValue";
import { getNumberReputation } from "../services/reputationService";
import ReputationCard from "./ReputationCard";

/** Consulta ao vivo: espera 500ms após a última tecla e só pesquisa números plausíveis. */
export default function NumberLookup({ initialPhone = "" }) {
  const [phone, setPhone] = useState(initialPhone);
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState({ key: null, data: null, error: null });

  const trimmed = phone.trim();
  const query = useDebouncedValue(trimmed, 500);
  const key = `${query}#${attempt}`;
  const queryValid = looksLikePhone(query);

  useEffect(() => {
    if (!queryValid) return;
    let cancelled = false;
    getNumberReputation(query)
      .then((data) => !cancelled && setResult({ key, data, error: null }))
      .catch((err) => !cancelled && setResult({ key, data: null, error: getApiError(err) }));
    return () => {
      cancelled = true;
    };
  }, [query, queryValid, key]);

  const typedValid = looksLikePhone(trimmed);
  const settled = typedValid && query === trimmed && result.key === key;

  return (
    <div className="flex flex-col gap-5">
      <Field
        label="Número de telemóvel"
        hint="A pesquisa começa sozinha quando termina de escrever."
      >
        <Input
          type="tel"
          inputMode="tel"
          autoComplete="off"
          placeholder="84 123 4567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </Field>

      <div aria-live="polite" className="min-h-40">
        {!typedValid && trimmed.length > 0 && (
          <p className="text-sm text-muted">Escreva o número completo (pelo menos 8 dígitos).</p>
        )}

        {typedValid && !settled && (
          <div className="h-40 animate-pulse rounded-panel border border-line bg-surface" aria-label="A consultar…" />
        )}

        {settled && result.data && <ReputationCard reputation={result.data} />}

        {settled && result.error && (
          <div className="flex flex-col items-start gap-3">
            <Alert tone="danger" title="Não foi possível consultar">
              {result.error.message}
            </Alert>
            <Button variant="secondary" size="sm" onClick={() => setAttempt((n) => n + 1)}>
              Tentar de novo
            </Button>
          </div>
        )}

        {settled && result.data && result.data.status !== "blacklisted" && (
          <p className="mt-4 text-sm text-muted">
            Recebeu algo suspeito deste número?{" "}
            <Link
              className="inline-flex items-center gap-1 font-medium text-brand underline-offset-4 hover:underline"
              href={`/denunciar?phone=${encodeURIComponent(result.data.number)}`}
            >
              Denunciar <ArrowForward size={16} />
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
