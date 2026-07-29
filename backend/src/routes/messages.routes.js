import { Router } from "express";
import { requireAuth } from '../middleware/auth.js';
import * as MessagesController from "../controllers/messages.controller.js";

const router = Router({ mergeParams: true });

router.get("/:matchId", requireAuth, MessagesController.getConversation);

router.post("/:matchId", requireAuth, MessagesController.sendMessage);

export default router;