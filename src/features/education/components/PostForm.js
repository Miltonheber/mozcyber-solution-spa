"use client";

import { useState } from "react";
import { Alert, Button, Field, Input, Select, Textarea } from "@/components/ui";
import useAsyncAction from "@/hooks/useAsyncAction";
import { STATUS_LABELS, topicOptions } from "../constants";

const EMPTY = { title: "", summary: "", body: "", topic: "scams", status: "draft", cover_image_url: "" };

/** Criar (sem `initial`) ou editar uma publicação. `onSubmit(data)` devolve a publicação gravada. */
export default function PostForm({ initial, onSubmit, onDone, submitLabel = "Guardar" }) {
  const [values, setValues] = useState({ ...EMPTY, ...(initial ?? {}) });
  const [localErrors, setLocalErrors] = useState({});
  const action = useAsyncAction(onSubmit);

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));
  const fieldErrors = { ...(action.error?.errors ?? {}), ...localErrors };
  const err = (key) => [fieldErrors[key]].flat()[0];

  const submit = async (event) => {
    event.preventDefault();
    const errors = {};
    if (!values.title.trim()) errors.title = "Indique o título.";
    if (!values.body.trim()) errors.body = "Escreva o texto da publicação.";
    setLocalErrors(errors);
    if (Object.keys(errors).length) return;

    const saved = await action.run({
      title: values.title.trim(),
      summary: values.summary.trim(),
      body: values.body.trim(),
      topic: values.topic,
      status: values.status,
      cover_image_url: values.cover_image_url.trim(),
    });
    if (saved) onDone?.(saved);
  };

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-5">
      <Field label="Título" error={err("title")}>
        <Input value={values.title} maxLength={200} onChange={set("title")} />
      </Field>

      <Field
        label="Resumo"
        optional
        hint="Aparece na lista de publicações. Uma ou duas frases."
        error={err("summary")}
      >
        <Textarea rows={2} maxLength={500} value={values.summary} onChange={set("summary")} />
      </Field>

      <Field
        label="Texto"
        hint="Texto simples. Separe os parágrafos com uma linha em branco."
        error={err("body")}
      >
        <Textarea rows={16} value={values.body} onChange={set("body")} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Tema" error={err("topic")}>
          <Select value={values.topic} onChange={set("topic")}>
            {topicOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field
          label="Estado"
          hint={values.status === "published" ? "Visível para todos no site." : "Só visível no painel."}
          error={err("status")}
        >
          <Select value={values.status} onChange={set("status")}>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="Imagem de capa (endereço)" optional error={err("cover_image_url")}>
        <Input type="url" inputMode="url" placeholder="https://…" value={values.cover_image_url} onChange={set("cover_image_url")} />
      </Field>

      {action.error && !action.error.errors && (
        <Alert tone="danger" title="Não foi possível guardar">
          {action.error.message}
        </Alert>
      )}

      <div>
        <Button type="submit" loading={action.loading}>
          {action.loading ? "A guardar…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
