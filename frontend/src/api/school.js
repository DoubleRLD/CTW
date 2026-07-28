import { api } from "./client";

export const schoolsApi = {
  list: () => api.get("/schools"),
  create: (payload) => api.post("/schools", payload, { auth: true }),
  update: (id, name) => api.patch(`/schools/${id}`, { name }, { auth: true }),
  delete: (id) => api.delete(`/schools/${id}`, { auth: true }),
  addDomain: (id, domain) => api.post(`/schools/${id}/domains`, { domain }, { auth: true }),
  removeDomain: (id, domain) =>
    api.delete(`/schools/${id}/domains/${encodeURIComponent(domain)}`, { auth: true }),
};
