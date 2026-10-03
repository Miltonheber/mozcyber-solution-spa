import api from "@/http/api";
import { unwrapPage } from "@/http/pagination";

const unwrap = (r) => r.data?.data ?? r.data;

export const listExamples = (params) =>
  api.get("/examples/", { params }).then(unwrapPage);

export const getExample = (id) => api.get(`/examples/${id}/`).then(unwrap);

export const createExample = (data) => api.post("/examples/", data).then(unwrap);

export const updateExample = (id, data) =>
  api.patch(`/examples/${id}/`, data).then(unwrap);

export const deleteExample = (id) => api.delete(`/examples/${id}/`);
