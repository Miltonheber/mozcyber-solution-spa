import api from "@/http/api";
import { unwrapPage } from "@/http/pagination";

// Blacklist (blacklist:read|update)
export const listBlacklist = (params) => api.get("/blacklist/", { params }).then(unwrapPage);
export const updateBlacklistEntry = (id, data) => api.patch(`/blacklist/${id}/`, data).then((r) => r.data);

// Denúncias (report:read|update)
export const listReports = (params) => api.get("/reports/", { params }).then(unwrapPage);
export const updateReport = (id, data) => api.patch(`/reports/${id}/`, data).then((r) => r.data);
