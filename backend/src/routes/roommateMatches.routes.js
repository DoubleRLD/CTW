import { Router } from 'express';
import * as MatchesController from '../controllers/roommateMatches.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/me', requireAuth, MatchesController.getMyMatches);
router.post('/:matchId/respond', requireAuth, MatchesController.respondToMatch);

export default router;
