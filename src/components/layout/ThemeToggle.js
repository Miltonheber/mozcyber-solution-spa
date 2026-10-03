"use client";

import { useSyncExternalStore } from "react";
import { cx, focusRing } from "@/lib/utils";
import { DarkMode, LightMode, SettingsBrightness } from "@/shared/icons";

const OPTIONS = [
  { value: "light", label: "Claro", Icon: LightMode },
  { value: "dark", label: "Escuro", Icon: DarkMode },
  { value: "system", label: "Sistema", Icon: SettingsBrightness },
];

const listeners = new Set();
const media = () => window.matchMedia("(prefers-color-scheme: dark)");

function read() {
  try {
    const t = localStorage.getItem("theme");
    return t === "light" || t === "dark" ? t : "system";
  } catch {
    return "system";
  }
}

function apply(choice) {
  const dark = choice === "dark" || (choice === "system" && media().matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
}

function setChoice(choice) {
  try {
    if (choice === "system") localStorage.removeItem("theme");
    else localStorage.setItem("theme", choice);
  } catch {}
  apply(choice);
  listeners.forEach((l) => l());
}

function subscribe(listener) {
  listeners.add(listener);
  const mq = media();
  const onSystemChange = () => {
    if (read() === "system") apply("system");
  };
  mq.addEventListener("change", onSystemChange);
  return () => {
    listeners.delete(listener);
    mq.removeEventListener("change", onSystemChange);
  };
}

export default function ThemeToggle() {
  const choice = useSyncExternalStore(subscribe, read, () => "system");

  return (
    <div role="group" aria-label="Tema" className="flex rounded-control border border-line p-0.5">
      {OPTIONS.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          title={label}
          aria-label={label}
          aria-pressed={choice === value}
          onClick={() => setChoice(value)}
          className={cx(
            "grid size-7 place-items-center rounded-[8px] sm:size-8 transition-colors",
            choice === value ? "bg-brand-soft text-brand" : "text-muted hover:text-ink",
            focusRing,
          )}
        >
          <Icon size={18} />
        </button>
      ))}
    </div>
  );
}
