import { Button, Panel } from "@/components/ui";
import { ArrowForward, CheckCircle, ErrorCircle, Warning } from "@/shared/icons";
import { VERDICTS } from "../constants";
import ReputationCard from "./ReputationCard";

const TONE = {
  danger: { band: "border-danger-line bg-danger-soft", text: "text-danger", icon: ErrorCircle },
  warn: { band: "border-warn-line bg-warn-soft", text: "text-warn", icon: Warning },
  safe: { band: "border-safe-line bg-safe-soft", text: "text-safe", icon: CheckCircle },
};

/** Resultado de uma classificação: veredicto, motivos, confiança e reputação do número. */
export default function VerdictPanel({ result, reportHref, headingRef }) {
  const verdict = VERDICTS[result.verdict] ?? VERDICTS.suspicious;
  const tone = TONE[verdict.tone];
  const Icon = tone.icon;
  const confidence = Math.round((result.confidence ?? 0) * 100);

  return (
    <div className="flex flex-col gap-4">
      <Panel className="overflow-hidden">
        <div className={`border-b px-5 py-5 sm:px-6 ${tone.band}`}>
          <p className={`flex items-center gap-2 text-sm font-semibold ${tone.text}`}>
            <Icon size={20} />
            {verdict.label}
          </p>
          <h2 ref={headingRef} tabIndex={-1} className="display-md mt-2 outline-none">
            {verdict.headline}
          </h2>
          <p className="mt-2 text-ink/80">{verdict.advice}</p>
        </div>

        <div className="px-5 py-5 sm:px-6">
          <h3 className="text-sm font-semibold">Porque chegámos a esta conclusão</h3>
          <p className="mt-1.5 text-muted">{result.explanation}</p>
          {result.verdict !== "safe" && (
            <p className="mt-4 text-sm text-muted">
              Confiança da análise: <span className="font-mono text-ink">{confidence}%</span>. A análise é automática
              e indicativa.
            </p>
          )}
        </div>
      </Panel>

      <ReputationCard reputation={result.reputation} />

      {reportHref && (
        <div className="flex flex-col items-start gap-3 rounded-panel border border-line bg-brand-soft px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="max-w-md text-[0.9375rem]">
            {result.verdict === "safe"
              ? "Recebeu algo estranho deste número mesmo assim? Pode denunciá-lo."
              : "Ajude a proteger outras pessoas: denuncie este número."}
          </p>
          <Button href={reportHref} variant={result.verdict === "safe" ? "secondary" : "primary"}>
            Denunciar este número
            <ArrowForward size={18} />
          </Button>
        </div>
      )}
    </div>
  );
}
