"use client";

import { useState } from "react";
import { Alert, Button, Field, Input, Panel, Select, Textarea } from "@/components/ui";
import { CheckCircle } from "@/shared/icons";
import { categoryOptions, channelOptions, formatPhone } from "../constants";
import useAsyncAction from "../hooks/useAsyncAction";
import { reportNumber } from "../services/reputationService";

const MAX_BEHAVIOR = 2000;

const EMPTY = {
  phone: "",
  category: "",
  channel: "",
  behavior: "",
  amount_lost: "",
  reporter_contact: "",
};

// Remove campos vazios; a API aplica `other` por omissão em categoria e canal.
function buildPayload(values) {
  const payload = { phone: values.phone.trim(), behavior: values.behavior.trim() };
  if (values.category) payload.category = values.category;
  if (values.channel) payload.channel = values.channel;
  const amount = values.amount_lost.trim().replace(",", ".");
  if (amount) payload.amount_lost = amount;
  if (values.reporter_contact.trim()) payload.reporter_contact = values.reporter_contact.trim();
  return payload;
}

export default function ReportForm({ initialPhone = "" }) {
  const [values, setValues] = useState({ ...EMPTY, phone: initialPhone });
  const [localErrors, setLocalErrors] = useState({});
  const action = useAsyncAction(reportNumber);

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));
  const fieldErrors = { ...(action.error?.errors ?? {}), ...localErrors };
  const firstError = (key) => [fieldErrors[key]].flat()[0];

  const onSubmit = (event) => {
    event.preventDefault();
    const errors = {};
    if (!values.phone.trim()) errors.phone = "Indique o número que quer denunciar.";
    if (!values.behavior.trim()) errors.behavior = "Descreva o que aconteceu, mesmo que em poucas palavras.";
    setLocalErrors(errors);
    if (Object.keys(errors).length) return;
    action.run(buildPayload(values));
  };

  if (action.data) {
    const number = action.data.number;
    return (
      <Panel className="p-6 sm:p-8" aria-live="polite">
        <CheckCircle size={32} className="text-safe" />
        <h2 className="display-md mt-4">Denúncia recebida.</h2>
        <p className="mt-2 max-w-prose text-muted">
          Obrigado. O número <span className="font-mono text-ink">{formatPhone(number)}</span> ficou registado e a sua denúncia vai
          ser analisada. Cada denúncia ajuda a avisar outras pessoas.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={`/consultar?phone=${encodeURIComponent(number)}`}>Ver reputação do número</Button>
          <Button
            variant="secondary"
            onClick={() => {
              action.reset();
              setValues(EMPTY);
              setLocalErrors({});
            }}
          >
            Fazer outra denúncia
          </Button>
        </div>
      </Panel>
    );
  }

  const showAlert = action.error && !action.error.errors;

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <Field label="Número a denunciar" error={firstError("phone")}>
        <Input
          type="tel"
          inputMode="tel"
          autoComplete="off"
          placeholder="84 123 4567"
          value={values.phone}
          onChange={set("phone")}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Tipo de burla" optional error={firstError("category")}>
          <Select value={values.category} onChange={set("category")}>
            <option value="">Não sei</option>
            {categoryOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Como foi contactado" optional error={firstError("channel")}>
          <Select value={values.channel} onChange={set("channel")}>
            <option value="">Seleccione…</option>
            {channelOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field
        label="O que aconteceu"
        hint="Diga o que pediram, o que prometeram e como reagiu. Não inclua PIN nem palavras-passe."
        error={firstError("behavior")}
      >
        <Textarea
          rows={6}
          maxLength={MAX_BEHAVIOR}
          placeholder="Ex.: Ligou a dizer que era do banco e pediu o código que recebi por SMS."
          value={values.behavior}
          onChange={set("behavior")}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Valor perdido (MT)" optional error={firstError("amount_lost")}>
          <Input inputMode="decimal" placeholder="0" value={values.amount_lost} onChange={set("amount_lost")} />
        </Field>
        <Field
          label="O seu contacto"
          optional
          hint="Só a equipa de moderação vê este dado. Nunca é mostrado publicamente."
          error={firstError("reporter_contact")}
        >
          <Input autoComplete="off" value={values.reporter_contact} onChange={set("reporter_contact")} />
        </Field>
      </div>

      {showAlert && <Alert tone="danger" title="Não foi possível enviar a denúncia">{action.error.message}</Alert>}

      <div>
        <Button type="submit" size="lg" loading={action.loading}>
          {action.loading ? "A enviar…" : "Enviar denúncia"}
        </Button>
      </div>
    </form>
  );
}
