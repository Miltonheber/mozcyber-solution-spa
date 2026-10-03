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
npm install && npm run dev            # local: http://localhost:8081 (API em http://localhost:8082)
docker compose -f docker-compose.dev.yml up --build   # dev com hot reload
docker compose up --build             # produção (NEXT_PUBLIC_API_URL é lido em build)
```
