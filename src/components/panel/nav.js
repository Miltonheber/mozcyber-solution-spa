// Itens do menu do painel. `permission`: código exigido (vazio = qualquer utilizador autenticado).
export const PANEL_NAV = [
  { href: "/painel", label: "Visão geral", icon: "home", exact: true },
  { href: "/painel/ocorrencias", label: "Ocorrências", icon: "assignment", permission: "occurrence:read" },
  { href: "/painel/integracao", label: "Integração", icon: "code", permission: "occurrence:read" },
  { href: "/painel/conteudo", label: "Conteúdo educativo", icon: "article", permission: "education:read" },
  { href: "/painel/denuncias", label: "Denúncias", icon: "flag", permission: "report:read" },
  { href: "/painel/lista-negra", label: "Lista negra", icon: "block", permission: "blacklist:read" },
];
