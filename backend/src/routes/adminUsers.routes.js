import { Router } from 'express';
import * as AdminUsersController from '../controllers/adminUsers.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, requireAdmin, AdminUsersController.listUsers);
router.patch('/:id/ban', requireAuth, requireAdmin, AdminUsersController.setBanned);
router.patch('/:id/admin', requireAuth, requireAdmin, AdminUsersController.setAdmin);

export default router;
