/** Lista de pares rótulo/valor. `items`: [{ label, value, mono?, wide? }]; valores vazios mostram “—”. */
export default function DetailList({ items }) {
  return (
    <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className={item.wide ? "sm:col-span-2" : ""}>
          <dt className="text-[0.8125rem] font-semibold uppercase tracking-[0.06em] text-muted">{item.label}</dt>
          <dd className={`mt-1 whitespace-pre-line break-words ${item.mono ? "font-mono" : ""}`}>
            {item.value || item.value === 0 ? item.value : "—"}
          </dd>
        </div>
      ))}
    </dl>
  );
}
