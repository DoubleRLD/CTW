// Routes for Favorites (bookmarking) feature
// This router exposes simple CRUD for a user's saved listings.
import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import * as favoritesCtrl from '../controllers/favorites.controller.js';

const router = express.Router();

// All favorites routes require authentication
router.use(requireAuth);

// List, create, and delete favorites for the authenticated user
router.get('/', favoritesCtrl.listFavorites);
router.post('/', favoritesCtrl.addFavorite);
router.delete('/:listingId', favoritesCtrl.removeFavorite);

export default router;
