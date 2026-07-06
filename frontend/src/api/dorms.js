import { api } from "./client";

export const dormsApi = {
  list: (schoolId) => api.get(schoolId ? `/dorms?schoolId=${schoolId}` : "/dorms"),
  get: (id) => api.get(`/dorms/${id}`),
  listRooms: (dormId) => api.get(`/dorms/${dormId}/rooms`),
  createRoom: (dormId, payload) => api.post(`/dorms/${dormId}/rooms`, payload, { auth: true }),
};
