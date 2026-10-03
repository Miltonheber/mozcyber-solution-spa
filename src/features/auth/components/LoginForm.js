"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Alert, Button, Field, Input } from "@/components/ui";
import useAsyncAction from "@/hooks/useAsyncAction";
import useHydrated from "@/hooks/useHydrated";
import useAuthStore from "@/store/useAuthStore";
import { getMe, login } from "../services/authService";

// Só aceita destinos internos do painel (evita redirecionamentos abertos).
const safeNext = (next) => (typeof next === "string" && /^\/painel(\/|$)/.test(next) ? next : "/painel");

async function signIn(credentials) {
  const { access, refresh } = await login(credentials);
  const user = await getMe(access);
  return { accessToken: access, refreshToken: refresh, user };
}

export default function LoginForm({ next }) {
  const router = useRouter();
  const hydrated = useHydrated();
  const accessToken = useAuthStore((s) => s.accessToken);
  const setAuthSession = useAuthStore((s) => s.setAuthSession);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localErrors, setLocalErrors] = useState({});
  const action = useAsyncAction(signIn);

  // Já tem sessão -> vai directo
  useEffect(() => {
    if (hydrated && accessToken) router.replace(safeNext(next));
  }, [hydrated, accessToken, next, router]);

  const fieldErrors = { ...(action.error?.errors ?? {}), ...localErrors };
  const firstError = (key) => [fieldErrors[key]].flat()[0];

  const onSubmit = async (event) => {
    event.preventDefault();
    const errors = {};
    if (!email.trim()) errors.email = "Indique o seu email.";
    if (!password) errors.password = "Indique a palavra-passe.";
    setLocalErrors(errors);
    if (Object.keys(errors).length) return;
    const session = await action.run({ email: email.trim(), password });
    if (session) {
      setAuthSession(session);
      router.replace(safeNext(next));
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <Field label="Email" error={firstError("email")}>
        <Input
          type="email"
          autoComplete="username"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Field>
      <Field label="Palavra-passe" error={firstError("password")}>
        <Input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Field>

      {action.error && !action.error.errors && (
        <Alert tone="danger" title="Não foi possível entrar">
          {action.error.message}
        </Alert>
      )}

      <Button type="submit" size="lg" block loading={action.loading}>
        {action.loading ? "A entrar…" : "Entrar"}
      </Button>
    </form>
  );
}
