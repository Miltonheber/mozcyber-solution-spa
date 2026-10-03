const LOCALE = "pt-MZ";

export const formatDate = (value) =>
  value ? new Intl.DateTimeFormat(LOCALE, { dateStyle: "medium" }).format(new Date(value)) : "—";

export const formatDateTime = (value) =>
  value ? new Intl.DateTimeFormat(LOCALE, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "—";
