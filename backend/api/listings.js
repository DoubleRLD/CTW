import { api } from "./client";

// NOTE: the backend scaffold so far only implements /api/dorms.
// Add a listings.routes.js + controller + model on the backend
// (same pattern as dorms) before these will actually work — the
// route map from earlier already spells out the shape:
//   GET  /api/listings
//   GET  /api/listings/:id
//   POST /api/listings
export const listingsApi = {
  list: (schoolId) => api.get(schoolId ? `/listings?schoolId=${schoolId}` : "/listings"),
  get: (id) => api.get(`/listings/${id}`),
};
