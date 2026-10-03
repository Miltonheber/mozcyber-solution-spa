import { Panel } from "@/components/ui";

const FILTERS = [
  ["status", "Exacto", "open, found ou closed"],
  ["document_type", "Exacto", "bi, passport, driving_license, dire ou other"],
  ["document_number", "Exacto", "Número do documento, em maiúsculas"],
  ["station_name", "Exacto", "Nome da esquadra"],
  ["reference", "Exacto", "Referência, ex.: OC-2026-000001"],
  ["search", "Pesquisa", "Referência, número do documento ou nome do titular (contém)"],
  ["lost_at_from / lost_at_to", "Intervalo", "Data da perda, inclusivo (AAAA-MM-DD)"],
  ["created_from / created_to", "Intervalo", "Data de registo, inclusivo (AAAA-MM-DD ou data-hora ISO)"],
  ["ordering", "Ordenação", "created_at, updated_at, lost_at, reference ou closed_at; prefixo - para descendente; vários separados por vírgula"],
  ["page / size", "Paginação", "Página (a partir de 1) e itens por página (máximo 100)"],
];

const ERRORS = [
  ["400", "invalid_filter", "Data inválida, intervalo invertido ou campo de ordenação não permitido"],
  ["401", "unauthorized", "Token em falta ou expirado: renove com /auth/refresh/"],
  ["403", "permission_denied", "A conta não tem a permissão occurrence:read"],
  ["404", "not_found", "Ocorrência inexistente"],
  ["429", "throttled", "Demasiados pedidos: aguarde o tempo indicado em Retry-After"],
];

function Code({ children }) {
  return (
    <pre className="overflow-x-auto rounded-control border border-line bg-paper p-4 font-mono text-[0.8125rem] leading-relaxed">
      <code>{children}</code>
    </pre>
  );
}

function Section({ title, children }) {
  return (
    <section className="mt-10 first:mt-0">
      <h2 className="font-display text-2xl">{title}</h2>
      <div className="mt-3 flex flex-col gap-4 text-[0.9375rem] leading-relaxed">{children}</div>
    </section>
  );
}

function Table({ head, rows }) {
  return (
    <div className="overflow-x-auto rounded-control border border-line">
      <table className="w-full text-left text-sm">
        <thead className="bg-paper text-muted">
          <tr>
            {head.map((h) => (
              <th key={h} className="px-3 py-2 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]} className="border-t border-line align-top">
              {row.map((cell, i) => (
                <td key={i} className={i === 0 ? "px-3 py-2 font-mono" : "px-3 py-2"}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Documentação para entidades que integram a consulta de ocorrências. Só conteúdo estático. */
export default function IntegrationDocs({ baseUrl }) {
  const base = baseUrl.replace(/\/$/, "");
  return (
    <Panel className="max-w-4xl p-5 sm:p-8">
      <Section title="Visão geral">
        <p>
          A API devolve JSON. Todos os pedidos usam HTTPS e o prefixo <code className="font-mono">{base}</code>. Uma conta
          com o perfil <strong>Entidade</strong> tem permissão de leitura (<code className="font-mono">occurrence:read</code>
          ): consulta, filtra e pesquisa ocorrências, mas não as cria nem altera. Peça ao administrador uma conta dedicada à
          integração.
        </p>
      </Section>

      <Section title="1. Autenticação">
        <p>
          Faça login para obter um par de tokens. O <code className="font-mono">access</code> é de curta duração e vai no
          cabeçalho <code className="font-mono">Authorization</code>; quando expirar (401), troque o{" "}
          <code className="font-mono">refresh</code> por um novo.
        </p>
        <Code>{`curl -X POST ${base}/auth/login/ \\
  -H "Content-Type: application/json" \\
  -d '{"email": "integracao@entidade.co.mz", "password": "••••••••"}'
# -> { "access": "...", "refresh": "..." }

curl -X POST ${base}/auth/refresh/ \\
  -H "Content-Type: application/json" \\
  -d '{"refresh": "<refresh>"}'
# -> { "access": "..." }`}</Code>
        <p className="text-muted">Guarde as credenciais e os tokens no servidor da entidade, nunca em código cliente.</p>
      </Section>

      <Section title="2. Listar e filtrar ocorrências">
        <p>
          <code className="font-mono">GET {base}/occurrences/</code> devolve{" "}
          <code className="font-mono">{"{ count, next, previous, results }"}</code>. Os filtros combinam-se entre si; parâmetros
          desconhecidos são ignorados.
        </p>
        <Table head={["Parâmetro", "Tipo", "Descrição"]} rows={FILTERS} />
        <Code>{`# Procurar um documento perdido
curl "${base}/occurrences/?document_number=1100123456A" \\
  -H "Authorization: Bearer <access>"

# Sincronizar: abertas em Setembro, as mais recentes primeiro
curl "${base}/occurrences/?status=open&lost_at_from=2026-09-01&lost_at_to=2026-09-30&ordering=-lost_at&size=50" \\
  -H "Authorization: Bearer <access>"`}</Code>
        <Code>{`const res = await fetch(
  "${base}/occurrences/?" + new URLSearchParams({ document_number: "1100123456A" }),
  { headers: { Authorization: \`Bearer \${access}\` } },
);
const { count, results, next } = await res.json(); // siga "next" até ser null`}</Code>
      </Section>

      <Section title="3. Detalhe e campos">
        <p>
          <code className="font-mono">GET {base}/occurrences/&#123;id&#125;/</code> devolve uma ocorrência. Campos principais:
        </p>
        <Code>{`{
  "id": "uuid",
  "reference": "OC-2026-000001",
  "document_type": "bi",
  "document_number": "1100123456A",
  "owner_name": "Ana Macuácua",
  "lost_at": "2026-09-30",
  "location": "Mercado Central",
  "status": "open",
  "station_name": "Esquadra da Polícia Nº 1",
  "closed_at": null,
  "created_at": "2026-10-01T09:30:00+02:00",
  "updated_at": "2026-10-01T09:30:00+02:00"
}`}</Code>
        <p className="text-muted">
          Os dados contêm informação pessoal: use-os apenas para devolver o documento ao titular e proteja-os conforme a
          lei de protecção de dados.
        </p>
      </Section>

      <Section title="4. Erros">
        <p>
          Os erros têm sempre o formato <code className="font-mono">{'{ "code", "message", "details" }'}</code>.
        </p>
        <Table head={["HTTP", "code", "Quando"]} rows={ERRORS} />
        <p className="text-muted">
          Há limites de pedidos por minuto: em caso de 429, respeite o cabeçalho{" "}
          <code className="font-mono">Retry-After</code>. A referência interactiva completa está no Swagger da API.
        </p>
      </Section>
    </Panel>
  );
}
