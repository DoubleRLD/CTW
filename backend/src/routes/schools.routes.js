import { Router } from 'express';
import * as SchoolsController from '../controllers/schools.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', SchoolsController.listSchools);
router.post('/', requireAuth, requireAdmin, SchoolsController.createSchool);
router.patch('/:id', requireAuth, requireAdmin, SchoolsController.updateSchool);
router.delete('/:id', requireAuth, requireAdmin, SchoolsController.deleteSchool);
router.post('/:id/domains', requireAuth, requireAdmin, SchoolsController.addDomain);
router.delete('/:id/domains/:domain', requireAuth, requireAdmin, SchoolsController.removeDomain);

export default router;
