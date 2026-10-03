import PanelShell from "@/components/panel/PanelShell";

export const metadata = {
  title: { default: "Painel", template: "%s · Painel" },
  robots: { index: false, follow: false },
};

export default function PanelLayout({ children }) {
  return <PanelShell>{children}</PanelShell>;
}
