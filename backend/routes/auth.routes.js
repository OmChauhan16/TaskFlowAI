import express from 'express';
import { register, login, getMe, sendOtp, oauthLogin, firebaseLogin,logout } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js';
import { authLimiter, otpLimiter, registerLimiter } from '../middleware/rateLimiter.js';
const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register user with OTP verification
// @access  Public
router.post('/register', registerLimiter, register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', authLimiter, login);

router.get('/me', protect, getMe);

// @route   POST /api/auth/send-otp
// @desc    Send OTP to email for registration
// @access  Public
router.post('/send-otp', otpLimiter, sendOtp);

// @route   POST /api/auth/oauth-login
// @desc    Login/Register with OAuth (Google/GitHub)
// @access  Public
router.post('/oauth-login', authLimiter, oauthLogin);


router.post('/firebase-login', verifyFirebaseToken, firebaseLogin);

router.post('/logout', protect, logout);  // ← Add this line







export default router;