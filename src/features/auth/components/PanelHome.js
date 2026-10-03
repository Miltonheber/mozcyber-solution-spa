"use client";

import Link from "next/link";
import { PageHeader, Panel } from "@/components/ui";
import { PANEL_NAV } from "@/components/panel/nav";
import { can } from "@/features/auth/permissions";
import { ArrowForward, Icon } from "@/shared/icons";
import useAuthStore from "@/store/useAuthStore";

const HINTS = {
  "/painel/ocorrencias": "Registar e consultar documentos perdidos.",
  "/painel/conteudo": "Escrever e publicar guias de prevenção.",
  "/painel/denuncias": "Rever denúncias recebidas do público.",
  "/painel/lista-negra": "Números marcados como burla.",
};

export default function PanelHome() {
  const user = useAuthStore((s) => s.user);
  const areas = PANEL_NAV.filter((item) => item.permission && can(user, item.permission));
  const first = (user?.name || "").split(" ")[0];

  return (
    <>
      <PageHeader title={first ? `Olá, ${first}.` : "Olá."} description="Escolha por onde quer começar." />
      {areas.length === 0 ? (
        <Panel className="p-6 text-muted">
          A sua conta ainda não tem áreas atribuídas. Fale com um administrador.
        </Panel>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {areas.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group flex h-full items-start gap-4 rounded-panel border border-line bg-surface p-5 transition-colors hover:border-brand"
              >
                <Icon name={item.icon} size={26} className="mt-0.5 text-brand" />
                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-medium">{item.label}</span>
                  <span className="mt-1 block text-[0.9375rem] text-muted">{HINTS[item.href]}</span>
                </span>
                <ArrowForward size={20} className="mt-1 text-muted transition-transform group-hover:translate-x-1" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
