"use client";

import { useEffect, useRef, useState } from "react";
import { Alert, Button, Field, Input, Textarea } from "@/components/ui";
import useAsyncAction from "@/hooks/useAsyncAction";
import { classifyMessage } from "../services/reputationService";
import VerdictPanel from "./VerdictPanel";

const MAX_MESSAGE = 2000;

export default function ClassifyForm() {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [localErrors, setLocalErrors] = useState({});
  const action = useAsyncAction(classifyMessage);
  const headingRef = useRef(null);
  const resultRef = action.data;

  useEffect(() => {
    if (resultRef) headingRef.current?.focus();
  }, [resultRef]);

  const fieldErrors = { ...(action.error?.errors ?? {}), ...localErrors };
  const firstError = (key) => [fieldErrors[key]].flat()[0];

  const onSubmit = (event) => {
    event.preventDefault();
    const errors = {};
    if (!phone.trim()) errors.phone = "Indique o número que enviou a mensagem.";
    if (!message.trim()) errors.message = "Cole aqui o texto da mensagem que recebeu.";
    setLocalErrors(errors);
    if (Object.keys(errors).length) return;
    action.run({ phone: phone.trim(), message: message.trim() });
  };

  const reset = () => {
    action.reset();
    setLocalErrors({});
    setPhone("");
    setMessage("");
  };

  if (action.data) {
    return (
      <div className="flex flex-col gap-5" aria-live="polite">
        <VerdictPanel
          result={action.data}
          headingRef={headingRef}
          reportHref={`/denunciar?phone=${encodeURIComponent(action.data.reputation.number)}`}
        />
        <div>
          <Button variant="secondary" onClick={reset}>
            Verificar outra mensagem
          </Button>
        </div>
      </div>
    );
  }

  const showAlert = action.error && !action.error.errors;

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <Field
        label="Número de quem enviou"
        hint="Pode escrever com ou sem indicativo, por exemplo 84 123 4567."
        error={firstError("phone")}
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

      <Field
        label="Mensagem recebida"
        hint="Copie e cole o texto tal como chegou. Não escreva dados seus."
        error={firstError("message")}
      >
        <Textarea
          rows={6}
          maxLength={MAX_MESSAGE}
          placeholder="Cole aqui o texto da mensagem…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </Field>

      {showAlert && <Alert tone="danger" title="Não foi possível verificar">{action.error.message}</Alert>}

      <div>
        <Button type="submit" size="lg" loading={action.loading}>
          {action.loading ? "A analisar…" : "Verificar mensagem"}
        </Button>
      </div>
    </form>
  );
}
