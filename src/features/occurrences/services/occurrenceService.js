import api from "@/http/api";
import { unwrapPage } from "@/http/pagination";

export const listOccurrences = (params) => api.get("/occurrences/", { params }).then(unwrapPage);
export const getOccurrence = (id) => api.get(`/occurrences/${id}/`).then((r) => r.data);
export const createOccurrence = (data) => api.post("/occurrences/", data).then((r) => r.data);
export const updateOccurrence = (id, data) => api.patch(`/occurrences/${id}/`, data).then((r) => r.data);
