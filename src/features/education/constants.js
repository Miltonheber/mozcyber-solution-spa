export const TOPIC_LABELS = {
  scams: "Burlas",
  social_engineering: "Engenharia social",
  credentials: "Credenciais",
  sim_swap: "Troca de SIM",
};

export const STATUS_LABELS = { draft: "Rascunho", published: "Publicado" };

export const topicOptions = Object.entries(TOPIC_LABELS).map(([value, label]) => ({ value, label }));
