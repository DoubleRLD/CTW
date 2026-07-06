import { Router } from 'express';
import * as ListingsController from '../controllers/listings.controller.js';
import listingReviewsRouter from './listingReviews.routes.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', ListingsController.listListings);
router.get('/:id', ListingsController.getListing);
router.post('/', requireAuth, ListingsController.createListing);

// Nested resource: /api/listings/:listingId/reviews
router.use('/:listingId/reviews', listingReviewsRouter);

export default router;
