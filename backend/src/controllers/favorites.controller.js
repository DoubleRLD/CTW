// Favorites controller
// Handlers for the favorites endpoints added for bookmarking listings.
// Endpoints are protected — `requireAuth` is applied at the router level.
import * as favoritesModel from '../models/favorites.model.js';
import { ApiError } from '../middleware/errorHandler.js';

// GET /api/favorites
// Returns an array of listing IDs the authenticated user has saved.
export async function listFavorites(req, res, next) {
  try {
    const userId = req.user.userId;
    const listingIds = await favoritesModel.getFavoritesByUser(userId);
    res.json(listingIds);
  } catch (err) {
    next(err);
  }
}

// POST /api/favorites { listingId }
// Adds a bookmark for the current user. Duplicate inserts are idempotent.
export async function addFavorite(req, res, next) {
  try {
    const userId = req.user.userId;
    const { listingId } = req.body;
    if (!listingId) throw new ApiError(400, 'listingId is required');
    await favoritesModel.addFavorite(userId, listingId);
    res.status(201).json({ success: true });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/favorites/:listingId
// Removes a bookmark. Returns 404 if the favorite didn't exist.
export async function removeFavorite(req, res, next) {
  try {
    const userId = req.user.userId;
    const listingId = Number(req.params.listingId);
    const removed = await favoritesModel.removeFavorite(userId, listingId);
    if (!removed) return next(new ApiError(404, 'Favorite not found'));
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
