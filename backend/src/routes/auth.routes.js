import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { loginLimiter, registerLimiter, resendVerificationLimiter } from '../middleware/rateLimit.js';

const router = Router();

router.post('/register', registerLimiter, AuthController.register);
router.post('/login', loginLimiter, AuthController.login);
router.post('/verify-email', AuthController.verifyEmail);
router.post('/resend-verification', resendVerificationLimiter, AuthController.resendVerification);
router.get('/me', requireAuth, AuthController.me);

export default router;
