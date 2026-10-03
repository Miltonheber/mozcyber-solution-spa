import api from "@/http/api";
import { unwrapPage } from "@/http/pagination";

// Endpoints públicos: não exigem login.

export const classifyMessage = ({ phone, message }) =>
  api.post("/public/classify/", { phone, message }).then((r) => r.data);

export const reportNumber = (payload) => api.post("/public/reports/", payload).then((r) => r.data);

export const getNumberReputation = (phone) =>
  api.get(`/public/numbers/${encodeURIComponent(phone)}/`).then((r) => r.data);

export const listHallOfFame = (params) => api.get("/public/hall-of-fame/", { params }).then(unwrapPage);
