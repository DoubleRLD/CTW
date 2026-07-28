import { api } from "./client";

export const dormsApi = {
  list: (schoolId) => api.get(schoolId ? `/dorms?schoolId=${schoolId}` : "/dorms"),
  get: (id) => api.get(`/dorms/${id}`),
  listRooms: (dormId) => api.get(`/dorms/${dormId}/rooms`),
  createRoom: (dormId, payload) => api.post(`/dorms/${dormId}/rooms`, payload, { auth: true }),
  setImage: (id, imageUrl) => api.patch(`/dorms/${id}/image`, { imageUrl }, { auth: true }),
  update: (id, payload) => api.patch(`/dorms/${id}`, payload, { auth: true }),
  delete: (id) => api.delete(`/dorms/${id}`, { auth: true }),
};
