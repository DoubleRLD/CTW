import { Router } from 'express';
import * as ListingReviewsController from '../controllers/listingReviews.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router({ mergeParams: true });

router.get('/', ListingReviewsController.listReviewsForListing);
router.post('/', requireAuth, ListingReviewsController.createReviewForListing);
router.delete('/:reviewId', requireAuth, ListingReviewsController.deleteReview);
router.post('/:reviewId/report', requireAuth, ListingReviewsController.reportReview);

export default router;
