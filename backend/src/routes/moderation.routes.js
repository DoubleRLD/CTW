import { Router } from 'express';
import * as ModerationController from '../controllers/moderation.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/reports', requireAuth, requireAdmin, ModerationController.listReports);
router.post('/reports/:reportId/resolve', requireAuth, requireAdmin, ModerationController.resolveReport);

export default router;
