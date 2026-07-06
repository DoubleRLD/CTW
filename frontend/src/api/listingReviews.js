import { api } from "./client";

export const listingReviewsApi = {
  list: (listingId) => api.get(`/listings/${listingId}/reviews`),
  create: (listingId, payload) => api.post(`/listings/${listingId}/reviews`, payload, { auth: true }),
  delete: (listingId, reviewId) => api.delete(`/listings/${listingId}/reviews/${reviewId}`, { auth: true }),
};
