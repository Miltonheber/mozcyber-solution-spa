# vigia-spa

Frontend em Next.js (App Router) + Tailwind CSS v4 + Zustand + Axios.

## Estrutura
- `src/app` — apenas rotas/diretórios (páginas e layouts).
- `src/features/<modulo>/{components,services}` — lógica de cada módulo; os services falam com a API.
- `src/http/api.js` — instância central do axios (token + refresh). Usar sempre `import api from "@/http/api"`.
- `src/store` — stores zustand (`useXxxStore.js`), só quando necessário.
- `src/shared`, `src/lib` — utilitários (`cx()` para classes Tailwind).

## Correr
```bash
cp .env.example .env
npm install && npm run dev                      # local
docker compose -f docker-compose.dev.yml up --build   # dev com hot reload
docker compose up --build             # produção (NEXT_PUBLIC_API_URL é lido em build)
```

## Rotas
**Públicas:** `/` · `/verificar` · `/consultar` · `/denunciar` · `/educacao` · `/educacao/[slug]`

**Painel** (login em `/entrar`, sessão em `localStorage` via `useAuthStore`; o menu mostra só o que as permissões do utilizador permitem, mas é a API que decide):

| Rota | Permissão | Perfis típicos |
|---|---|---|
| `/painel/ocorrencias` (`/nova`, `/[id]`) | `occurrence:read` (+ `create`/`update`) | esquadra (criar/editar), entidade (consultar) |
| `/painel/conteudo` (`/nova`, `/[id]`) | `education:read` (+ `create`/`update`/`delete`) | admin |
| `/painel/denuncias` | `report:read` (+ `update`) | admin |
| `/painel/lista-negra` | `blacklist:read` (+ `update`) | admin |

## Convenções do painel
- `src/hooks/usePagedQuery` + `useListFilters`: listagens paginadas/filtráveis (`?page&size&search&<filtro>`); `useAsyncAction`: mutações com erro por campo.
- `src/components/ui`: design system (Button, Field, Input/Select/Textarea, Modal, DataTable, Pagination…); `src/components/panel`: shell, toolbar, estados de lista, `RequirePermission`.
- Para testar contra a API local: `NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1 npm run dev`.
