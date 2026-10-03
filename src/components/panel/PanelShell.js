"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Wordmark from "@/components/layout/Wordmark";
import { Spinner } from "@/components/ui";
import { can, profilesOf } from "@/features/auth/permissions";
import { getMe } from "@/features/auth/services/authService";
import useHydrated from "@/hooks/useHydrated";
import { cx, focusRing } from "@/lib/utils";
import { Close, Icon, Logout, Menu } from "@/shared/icons";
import useAuthStore from "@/store/useAuthStore";
import { PANEL_NAV } from "./nav";

const PROFILE_LABELS = { admin: "Administrador", esquadra: "Esquadra", entidade: "Entidade" };

function NavLinks({ user, pathname, onNavigate }) {
  const items = PANEL_NAV.filter((item) => !item.permission || can(user, item.permission));
  return (
    <ul className="flex flex-col gap-1">
      {items.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cx(
                "flex items-center gap-3 rounded-control px-3 py-2.5 text-[0.9375rem] font-medium transition-colors",
                active ? "bg-brand-soft text-brand" : "text-muted hover:bg-brand-soft/60 hover:text-ink",
                focusRing,
              )}
            >
              <Icon name={item.icon} size={20} fill={active} />
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function Sidebar({ user, pathname, onNavigate, onLogout }) {
  const profiles = profilesOf(user);
  return (
    <div className="flex h-full flex-col">
      <div className="px-5 pb-4 pt-5">
        <Link href="/painel" onClick={onNavigate} className={cx("inline-flex rounded-control", focusRing)}>
          <Wordmark />
        </Link>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted">Painel</p>
      </div>
      <nav aria-label="Painel" className="flex-1 overflow-y-auto px-3 py-2">
        <NavLinks user={user} pathname={pathname} onNavigate={onNavigate} />
      </nav>
      <div className="border-t border-line p-4">
        <p className="truncate text-sm font-medium">{user?.name || user?.email}</p>
        {user?.name && <p className="truncate text-xs text-muted">{user.email}</p>}
        {profiles.length > 0 && (
          <p className="mt-1 text-xs text-muted">{profiles.map((p) => PROFILE_LABELS[p] ?? p).join(" · ")}</p>
        )}
        <div className="mt-3 flex items-center gap-2">
          <Link href="/" className="text-sm text-muted underline-offset-4 hover:text-ink hover:underline">
            Ver site
          </Link>
          <span className="flex-1" />
          <button
            type="button"
            onClick={onLogout}
            className={cx(
              "inline-flex items-center gap-1.5 rounded-control px-2.5 py-1.5 text-sm font-medium text-muted hover:bg-brand-soft hover:text-ink",
              focusRing,
            )}
          >
            <Logout size={18} /> Sair
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PanelShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = useHydrated();
  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);
  const [open, setOpen] = useState(false);
  const leaving = useRef(false); // logout em curso: não guardar a rota actual em ?next

  // Sem sessão -> /entrar (guardando a rota pedida)
  useEffect(() => {
    if (hydrated && !accessToken && !leaving.current) router.replace(`/entrar?next=${encodeURIComponent(pathname)}`);
  }, [hydrated, accessToken, pathname, router]);

  // Actualiza utilizador e permissões (podem ter mudado desde o último login)
  useEffect(() => {
    if (!hydrated || !accessToken) return;
    let cancelled = false;
    getMe()
      .then((me) => !cancelled && setUser(me))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [hydrated, accessToken, setUser]);

  if (!hydrated || !accessToken || !user) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Spinner label="A abrir o painel…" />
      </div>
    );
  }

  const onLogout = () => {
    leaving.current = true;
    logout();
    router.replace("/entrar");
  };

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="sticky top-0 hidden h-screen border-r border-line bg-surface lg:block">
        <Sidebar user={user} pathname={pathname} onLogout={onLogout} />
      </aside>

      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-paper px-4 lg:hidden">
        <Link href="/painel" className={cx("rounded-control", focusRing)}>
          <Wordmark />
        </Link>
        <button
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={cx("-mr-2 grid size-11 place-items-center rounded-control", focusRing)}
        >
          {open ? <Close size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 top-14 z-20 bg-surface lg:hidden">
          <Sidebar user={user} pathname={pathname} onNavigate={() => setOpen(false)} onLogout={onLogout} />
        </div>
      )}

      <main id="conteudo" className="min-w-0 px-4 py-8 sm:px-8 lg:py-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
