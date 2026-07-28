import { api } from "./client";

export const listingsApi = {
  list: (schoolId) => api.get(schoolId ? `/listings?schoolId=${schoolId}` : "/listings"),
  get: (id) => api.get(`/listings/${id}`),
  setImage: (id, imageUrl) => api.patch(`/listings/${id}/image`, { imageUrl }, { auth: true }),
  update: (id, payload) => api.patch(`/listings/${id}`, payload, { auth: true }),
  delete: (id) => api.delete(`/listings/${id}`, { auth: true }),
};
