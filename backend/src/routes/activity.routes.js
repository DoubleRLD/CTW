import { Router } from 'express';
import * as ActivityController from '../controllers/activity.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/me', requireAuth, ActivityController.getMyActivity);

export default router;
