import { Router } from 'express';
import * as ProfilesController from '../controllers/roommateProfiles.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/me', requireAuth, ProfilesController.getMyProfile);
router.post('/', requireAuth, ProfilesController.upsertMyProfile);
router.get('/browse', requireAuth, ProfilesController.browseProfiles);

export default router;
