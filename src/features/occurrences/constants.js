export const DOCUMENT_TYPES = {
  bi: "Bilhete de identidade",
  passport: "Passaporte",
  driving_license: "Carta de condução",
  dire: "DIRE",
  other: "Outro",
};

export const OCCURRENCE_STATUS = {
  open: { label: "Aberta", tone: "warn" },
  found: { label: "Encontrado", tone: "safe" },
  closed: { label: "Fechada", tone: "neutral" },
};

export const documentTypeOptions = Object.entries(DOCUMENT_TYPES).map(([value, label]) => ({ value, label }));
export const occurrenceStatusOptions = Object.entries(OCCURRENCE_STATUS).map(([value, m]) => ({
  value,
  label: m.label,
}));

export const occurrenceOrderingOptions = [
  { value: "-lost_at", label: "Perdidas há menos tempo" },
  { value: "lost_at", label: "Perdidas há mais tempo" },
  { value: "created_at", label: "Registo mais antigo" },
];
