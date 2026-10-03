"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Container } from "@/components/ui";
import { cx, focusRing } from "@/lib/utils";
import { Close, Login, Menu } from "@/shared/icons";
import { NAV } from "./nav";
import ThemeToggle from "./ThemeToggle";
import Wordmark from "./Wordmark";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className={cx("rounded-control", focusRing)} aria-label="Vigia, página inicial">
          <Wordmark />
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "rounded-control px-3 py-2 text-[0.9375rem] font-medium transition-colors",
                  active ? "bg-brand-soft text-brand" : "text-muted hover:text-ink",
                  focusRing,
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
        <ThemeToggle />
        <Link
          href="/entrar"
          title="Entrar"
          aria-label="Entrar"
          className={cx(
            "grid size-10 place-items-center rounded-control text-muted transition-colors hover:bg-brand-soft hover:text-brand",
            focusRing,
          )}
        >
          <Login size={22} />
        </Link>
        <button
          type="button"
          className={cx("-mr-2 grid size-11 place-items-center rounded-control md:hidden", focusRing)}
          aria-expanded={open}
          aria-controls="menu-movel"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <Close size={24} /> : <Menu size={24} />}
        </button>
        </div>
      </Container>

      {open && (
        <nav id="menu-movel" aria-label="Principal" className="border-t border-line bg-paper md:hidden">
          <Container className="flex flex-col py-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={pathname === item.href ? "page" : undefined}
                className={cx(
                  "rounded-control px-2 py-3.5 text-base font-medium",
                  pathname === item.href ? "text-brand" : "text-ink",
                  focusRing,
                )}
              >
                {item.label}
              </Link>
            ))}
          </Container>
        </nav>
      )}
    </header>
  );
}
