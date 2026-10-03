"use client";

import { useState } from "react";
import { Alert, Button, Field, Input, Select, Textarea } from "@/components/ui";
import useAsyncAction from "@/hooks/useAsyncAction";
import { documentTypeOptions, occurrenceStatusOptions } from "../constants";

const EMPTY = {
  document_type: "bi",
  document_number: "",
  owner_name: "",
  owner_contact: "",
  lost_at: "",
  location: "",
  description: "",
  station_name: "",
  status: "open",
};

const REQUIRED = {
  document_number: "Indique o número do documento.",
  owner_name: "Indique o nome do titular.",
  lost_at: "Indique a data em que o documento se perdeu.",
  location: "Indique onde o documento se perdeu.",
  station_name: "Indique a esquadra que regista a ocorrência.",
};

const today = () => new Date().toISOString().slice(0, 10);

/** Criar (sem `initial`) ou editar uma ocorrência. `onSubmit(data)` devolve a ocorrência gravada. */
export default function OccurrenceForm({ initial, onSubmit, onDone, submitLabel = "Guardar", onCancel }) {
  const editing = Boolean(initial);
  const [values, setValues] = useState({ ...EMPTY, ...(initial ?? {}) });
  const [localErrors, setLocalErrors] = useState({});
  const action = useAsyncAction(onSubmit);

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));
  const fieldErrors = { ...(action.error?.errors ?? {}), ...localErrors };
  const err = (key) => [fieldErrors[key]].flat()[0];

  const submit = async (event) => {
    event.preventDefault();
    const errors = {};
    for (const [key, message] of Object.entries(REQUIRED)) if (!String(values[key]).trim()) errors[key] = message;
    setLocalErrors(errors);
    if (Object.keys(errors).length) return;

    const payload = {
      document_type: values.document_type,
      document_number: values.document_number.trim(),
      owner_name: values.owner_name.trim(),
      owner_contact: values.owner_contact.trim(),
      lost_at: values.lost_at,
      location: values.location.trim(),
      description: values.description.trim(),
      station_name: values.station_name.trim(),
      ...(editing && { status: values.status }),
    };
    const saved = await action.run(payload);
    if (saved) onDone?.(saved);
  };

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Tipo de documento" error={err("document_type")}>
          <Select value={values.document_type} onChange={set("document_type")}>
            {documentTypeOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Número do documento" error={err("document_number")}>
          <Input autoComplete="off" className="font-mono uppercase" value={values.document_number} onChange={set("document_number")} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nome do titular" error={err("owner_name")}>
          <Input autoComplete="off" value={values.owner_name} onChange={set("owner_name")} />
        </Field>
        <Field label="Contacto do titular" optional error={err("owner_contact")}>
          <Input type="tel" inputMode="tel" autoComplete="off" value={values.owner_contact} onChange={set("owner_contact")} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Data da perda" error={err("lost_at")}>
          <Input type="date" max={today()} value={values.lost_at} onChange={set("lost_at")} />
        </Field>
        <Field label="Local da perda" error={err("location")}>
          <Input autoComplete="off" value={values.location} onChange={set("location")} />
        </Field>
      </div>

      <Field label="Descrição" optional hint="Circunstâncias da perda e outros detalhes úteis." error={err("description")}>
        <Textarea rows={4} value={values.description} onChange={set("description")} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Esquadra" error={err("station_name")}>
          <Input autoComplete="off" value={values.station_name} onChange={set("station_name")} />
        </Field>
        {editing && (
          <Field label="Estado" error={err("status")}>
            <Select value={values.status} onChange={set("status")}>
              {occurrenceStatusOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>
        )}
      </div>

      {action.error && !action.error.errors && (
        <Alert tone="danger" title="Não foi possível guardar">
          {action.error.message}
        </Alert>
      )}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" loading={action.loading}>
          {action.loading ? "A guardar…" : submitLabel}
        </Button>
        {onCancel && (
          <Button variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}
