import { Input, Select } from "@/components/ui";
import { Search } from "@/shared/icons";

/** Barra de pesquisa + filtros. `filters`: [{ name, label, value, onChange, options:[{value,label}], placeholder }]. */
export default function ListToolbar({ search, onSearch, searchPlaceholder = "Pesquisar…", filters = [], children }) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <div className="relative min-w-56 flex-1 sm:max-w-sm">
        <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <Input
          type="search"
          aria-label="Pesquisar"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-10"
        />
      </div>
      {filters.map((f) => (
        <div key={f.name} className="min-w-40">
          <Select aria-label={f.label} value={f.value} onChange={(e) => f.onChange(e.target.value)}>
            <option value="">{f.placeholder ?? f.label}</option>
            {f.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </div>
      ))}
      {children}
    </div>
  );
}
