import { Panel, RiskMeter, StatusPill } from "@/components/ui";
import { CATEGORY_SHORT, NUMBER_STATUS, formatPhone } from "../constants";

/** Reputação pública de um número. `unknown` nunca é apresentado como “seguro”. */
export default function ReputationCard({ reputation, className }) {
  const meta = NUMBER_STATUS[reputation.status] ?? NUMBER_STATUS.unknown;
  const known = reputation.status !== "unknown";
  return (
    <Panel className={`p-5 sm:p-6 ${className ?? ""}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Número</p>
          <p className="mt-1 break-all font-mono text-xl tracking-tight">{formatPhone(reputation.number)}</p>
        </div>
        <StatusPill tone={meta.tone}>{meta.label}</StatusPill>
      </div>

      <p className="mt-3 text-muted">{meta.text}</p>

      {known && (
        <div className="mt-5">
          <RiskMeter value={reputation.risk_score} tone={meta.tone} />
        </div>
      )}

      {known && (
        <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-4 text-sm">
          <div>
            <dt className="text-muted">Denúncias</dt>
            <dd className="mt-0.5 font-mono text-base">{reputation.report_count}</dd>
          </div>
          <div>
            <dt className="text-muted">Tipo de burla</dt>
            <dd className="mt-0.5 text-base">{CATEGORY_SHORT[reputation.category] ?? "Por classificar"}</dd>
          </div>
        </dl>
      )}
    </Panel>
  );
}
