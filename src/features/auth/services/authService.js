import api from "@/http/api";

// Chamadas com `skipAuth` não anexam token nem tentam refresh (login falhado devolve 401 normal).
export const login = ({ email, password }) =>
  api.post("/auth/login/", { email, password }, { skipAuth: true }).then((r) => r.data);

export const getMe = (accessToken) =>
  api
    .get("/auth/me/", accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined)
    .then((r) => r.data);
