const RECOGNIZED_TOP_LEVEL_KEYS = new Set(["detail", "message", "errors", "success", "code", "status", "statusCode"]);

function isPlainErrorObject(value) {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

function isFieldErrorValue(value) {
  if (typeof value === "string") return true;
  return Array.isArray(value) && value.every((v) => typeof v === "string");
}

// Extracts field-level messages from a flat DRF-style validation error body,
// e.g. { sale_price: ["Este campo é obrigatório."] }, which has no "errors" wrapper.
// Only applies when there is no "errors" key at all — when one exists (object or array),
// it is the source of truth and the remaining keys are just envelope metadata (success, code, ...).
function extractFlatFieldErrors(data) {
  if (!isPlainErrorObject(data)) return {};
  if (Object.prototype.hasOwnProperty.call(data, "errors")) return {};
  const entries = Object.entries(data).filter(
    ([key, value]) => !RECOGNIZED_TOP_LEVEL_KEYS.has(key) && isFieldErrorValue(value)
  );
  return Object.fromEntries(entries);
}

function extractNonFieldMessage(fieldErrors) {
  const nonField = fieldErrors.non_field_errors ?? fieldErrors.non_field_error;
  if (!nonField) return null;
  const msgs = Array.isArray(nonField) ? nonField : [nonField];
  return msgs.filter((v) => typeof v === "string").join(" ") || null;
}

// Handles a bare list of messages, e.g. { errors: ["O preço não pode ser inferior ao custo."] },
// a shape some endpoints use instead of a per-field object.
function extractArrayErrors(data) {
  return Array.isArray(data?.errors) ? data.errors.filter((v) => typeof v === "string") : [];
}

export function getApiError(error) {
  const data = error?.response?.data ?? {};
  const raw = data.detail ?? data.message;

  const nestedErrors = data.errors && typeof data.errors === "object" && !Array.isArray(data.errors)
    ? data.errors
    : null;
  const arrayErrors = extractArrayErrors(data);

  const flatErrors = nestedErrors ? {} : extractFlatFieldErrors(data);
  const { non_field_errors, non_field_error, ...fieldErrors } = flatErrors;
  const nonFieldMessage = extractNonFieldMessage(flatErrors);

  let message = typeof raw === "string"
    ? raw
    : nonFieldMessage ?? getFriendlyHttpErrorMessage(error);

  if (arrayErrors.length > 0) {
    const suffix = arrayErrors.join(" ");
    message = message && message !== suffix ? `${message} ${suffix}` : suffix;
  }

  const errors = nestedErrors ?? (Object.keys(fieldErrors).length > 0 ? fieldErrors : null);

  return { message, errors };
}

export function getFriendlyHttpErrorMessage(error, fallback = "Não foi possível concluir a operação.") {
  const status = error?.response?.status;
  const data = error?.response?.data;
  const detail = data?.detail;
  const message = data?.message;
  const nestedErrors = data?.errors && typeof data.errors === "object" && !Array.isArray(data.errors)
    ? data.errors
    : null;
  const arrayErrors = extractArrayErrors(data);
  const flatErrors = nestedErrors ? null : extractFlatFieldErrors(data);
  const errors = nestedErrors ?? (flatErrors && Object.keys(flatErrors).length > 0 ? flatErrors : null);

  let base;
  if (detail) base = typeof detail === "string" ? detail : null;
  if (!base && message) base = message;

  if (!base) {
    switch (status) {
      case 400: base = "Os dados enviados não são válidos. Verifique os campos e tente novamente."; break;
      case 401: base = "A sua sessão não é válida. Faça login novamente."; break;
      case 403: base = "Não tem permissão para executar esta operação."; break;
      case 404: base = "O recurso solicitado não foi encontrado."; break;
      case 409: base = "Já existe um registo com estes dados."; break;
      case 422: base = "Existem campos obrigatórios em falta ou com valores inválidos."; break;
      case 429: base = "Muitas tentativas em pouco tempo. Aguarde um momento e volte a tentar."; break;
      case 500: base = "Ocorreu um erro no servidor. Tente novamente mais tarde."; break;
      default: break;
    }
  }

  if (!base && error?.message === "Network Error") {
    base = "Não foi possível comunicar com o servidor. Verifique a ligação.";
  }

  if (errors && typeof errors === "object" && !Array.isArray(errors)) {
    const details = Object.values(errors).flat().filter((v) => typeof v === "string");
    if (details.length > 0) {
      const suffix = details.join(" ");
      base = base ? `${base} ${suffix}` : suffix;
    }
  }

  if (arrayErrors.length > 0) {
    const suffix = arrayErrors.join(" ");
    base = base && base !== suffix ? `${base} ${suffix}` : suffix;
  }

  return base ?? fallback;
}
