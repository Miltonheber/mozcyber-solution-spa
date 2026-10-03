export const CATEGORY_LABELS = {
  phishing: "Phishing (pedido de dados ou códigos)",
  sim_swap: "Troca de SIM (SIM swap)",
  fake_prize: "Falso prémio ou sorteio",
  impersonation: "Falsa identidade (banco, operadora, familiar)",
  loan_scam: "Falso empréstimo",
  other: "Outro",
};

export const CATEGORY_SHORT = {
  phishing: "Phishing",
  sim_swap: "Troca de SIM",
  fake_prize: "Falso prémio",
  impersonation: "Falsa identidade",
  loan_scam: "Falso empréstimo",
  other: "Outro",
};

export const CHANNEL_LABELS = {
  sms: "SMS",
  call: "Chamada",
  whatsapp: "WhatsApp",
  email: "Email",
  other: "Outro",
};

export const categoryOptions = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ value, label }));
export const channelOptions = Object.entries(CHANNEL_LABELS).map(([value, label]) => ({ value, label }));

// verdict -> apresentação do resultado de uma classificação
export const VERDICTS = {
  fraud: {
    tone: "danger",
    label: "Provável burla",
    headline: "Esta mensagem tem sinais claros de burla.",
    advice: "Não responda, não clique em ligações e não partilhe PIN, códigos nem dados pessoais.",
  },
  suspicious: {
    tone: "warn",
    label: "Suspeita",
    headline: "Esta mensagem tem sinais suspeitos.",
    advice: "Confirme por um canal oficial (linha da operadora ou do banco) antes de agir.",
  },
  safe: {
    tone: "safe",
    label: "Sem sinais de burla",
    headline: "Não encontrámos sinais de burla nesta mensagem.",
    advice: "A análise é indicativa. Se algo continuar a parecer estranho, confie no seu instinto e confirme.",
  },
};

// status de um número -> apresentação da reputação
export const NUMBER_STATUS = {
  blacklisted: {
    tone: "danger",
    label: "Na lista negra",
    text: "Este número está associado a burlas. Evite responder ou atender.",
  },
  suspicious: {
    tone: "warn",
    label: "Suspeito",
    text: "Há sinais ou denúncias associados a este número. Tenha cuidado.",
  },
  unknown: {
    tone: "neutral",
    label: "Sem registos",
    text: "Ainda não temos informação sobre este número. Isso não garante que seja de confiança.",
  },
  cleared: {
    tone: "neutral",
    label: "Verificado sem problemas",
    text: "Este número foi revisto e não tem denúncias activas.",
  },
};

export const digitsOf = (value) => (value ?? "").replace(/\D/g, "");

/** Um número plausível tem entre 8 e 15 dígitos (o servidor faz a validação final). */
export const looksLikePhone = (value) => {
  const n = digitsOf(value).length;
  return n >= 8 && n <= 15;
};

/** +258841234567 -> +258 84 123 4567 (só números moçambicanos; outros ficam como vêm). */
export const formatPhone = (value) => {
  const m = /^\+258(\d{2})(\d{3})(\d{4})$/.exec(value ?? "");
  return m ? `+258 ${m[1]} ${m[2]} ${m[3]}` : (value ?? "");
};
