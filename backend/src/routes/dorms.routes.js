import { Router } from 'express';
import * as DormsController from '../controllers/dorms.controller.js';
import roomsRouter from './rooms.routes.js';
import dormReviewsRouter from './dormReviews.routes.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', DormsController.listDorms);
router.get('/:id', DormsController.getDorm);
router.post('/', requireAuth, DormsController.createDorm);
router.patch('/:id/image', requireAuth, DormsController.setDormImage);
router.patch('/:id', requireAuth, requireAdmin, DormsController.updateDorm);
router.delete('/:id', requireAuth, requireAdmin, DormsController.deleteDorm);

// Nested resources: /api/dorms/:dormId/rooms, /api/dorms/:dormId/reviews
router.use('/:dormId/rooms', roomsRouter);
router.use('/:dormId/reviews', dormReviewsRouter);

export default router;
