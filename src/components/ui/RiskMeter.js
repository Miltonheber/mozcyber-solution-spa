const FILL = { danger: "bg-danger", warn: "bg-warn", safe: "bg-safe", neutral: "bg-muted" };

/** Barra de risco 0–100. `tone` decide a cor; o valor é anunciado a leitores de ecrã. */
export default function RiskMeter({ value = 0, tone = "neutral", label = "Nível de risco" }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div>
      <div
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-valuetext={`${pct} em 100`}
        className="h-2 overflow-hidden rounded-full bg-line"
      >
        <div
          className={`h-full rounded-full transition-[width] duration-500 ease-out ${FILL[tone]}`}
          style={{ width: `${Math.max(pct, pct > 0 ? 4 : 0)}%` }}
        />
      </div>
      <div className="mt-1.5 flex justify-between text-xs text-muted" aria-hidden="true">
        <span>Baixo</span>
        <span className="font-mono">{pct}/100</span>
        <span>Alto</span>
      </div>
    </div>
  );
}
