/** Permissões do utilizador (claims de `auth/me`). A API é quem decide; isto só serve para mostrar/esconder UI. */
export const permissionsOf = (user) => user?.claims?.permissions ?? [];
export const profilesOf = (user) => user?.claims?.profiles ?? [];

/** Exige TODAS as permissões indicadas (igual ao backend). Sem códigos => basta estar autenticado. */
export const can = (user, ...codes) => {
  const granted = new Set(permissionsOf(user));
  return codes.every((code) => granted.has(code));
};
