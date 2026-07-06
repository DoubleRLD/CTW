import { Router } from 'express';
import * as RoomsController from '../controllers/rooms.controller.js';
import { requireAuth } from '../middleware/auth.js';

// mergeParams lets this router read :dormId from the parent route
// it gets mounted under in dorms.routes.js.
const router = Router({ mergeParams: true });

router.get('/', RoomsController.listRoomsForDorm);
router.get('/:roomId', RoomsController.getRoom);
router.post('/', requireAuth, RoomsController.createRoom);

export default router;
