import api from "@/http/api";
import { unwrapPage } from "@/http/pagination";

// Público (sem login): só publicações `published`.
export const listPublicPosts = (params) => api.get("/public/posts/", { params }).then(unwrapPage);
export const getPublicPost = (slug) => api.get(`/public/posts/${encodeURIComponent(slug)}/`).then((r) => r.data);

// Painel (permissões education:*): inclui rascunhos.
export const listPosts = (params) => api.get("/posts/", { params }).then(unwrapPage);
export const getPost = (id) => api.get(`/posts/${id}/`).then((r) => r.data);
export const createPost = (data) => api.post("/posts/", data).then((r) => r.data);
export const updatePost = (id, data) => api.patch(`/posts/${id}/`, data).then((r) => r.data);
export const deletePost = (id) => api.delete(`/posts/${id}/`);
