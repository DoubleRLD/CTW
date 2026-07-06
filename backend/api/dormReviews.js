import { api } from "./client";

export const dormReviewsApi = {
  list: (dormId) => api.get(`/dorms/${dormId}/reviews`),
  create: (dormId, payload) => api.post(`/dorms/${dormId}/reviews`, payload, { auth: true }),
  delete: (dormId, reviewId) => api.delete(`/dorms/${dormId}/reviews/${reviewId}`, { auth: true }),
};
