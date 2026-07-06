import { Router } from 'express';
import * as DormReviewsController from '../controllers/dormReviews.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router({ mergeParams: true });

router.get('/', DormReviewsController.listReviewsForDorm);
router.post('/', requireAuth, DormReviewsController.createReviewForDorm);
router.delete('/:reviewId', requireAuth, DormReviewsController.deleteReview);

export default router;
