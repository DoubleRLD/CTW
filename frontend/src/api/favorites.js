// Frontend API wrapper for Favorites endpoints (bookmarks)
// Mirrors the backend routes at /api/favorites and attaches auth.
import { api } from './client';

export const favoritesApi = {
  list: () => api.get('/favorites', { auth: true }),
  add: (listingId) => api.post('/favorites', { listingId }, { auth: true }),
  remove: (listingId) => api.delete(`/favorites/${listingId}`, { auth: true }),
};
