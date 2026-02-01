import express from 'express';
import { register, login, getMe, sendOtp, oauthLogin,firebaseLogin } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js';
const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register user with OTP verification
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', login);

router.get('/me', protect, getMe);

// @route   POST /api/auth/send-otp
// @desc    Send OTP to email for registration
// @access  Public
router.post('/send-otp', sendOtp);

// @route   POST /api/auth/oauth-login
// @desc    Login/Register with OAuth (Google/GitHub)
// @access  Public
router.post('/oauth-login', oauthLogin);

// @route   GET /auth/google
// @desc    Initiate Google OAuth
// router.get('/google',
//     passport.authenticate('google', {
//         scope: ['profile', 'email']
//     })
// );

// @route   GET /auth/google/callback
// @desc    Google OAuth callback
// router.get('/google/callback',
//     passport.authenticate('google', {
//         failureRedirect: '/login',
//         session: false
//     }),
//     (req, res) => {
//         // Generate JWT token
//         const token = generateToken(req.user);

//         // Redirect to frontend with token
//         res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
//     }
// );

// @route   GET /auth/github
// @desc    Initiate GitHub OAuth
// router.get('/github',
//     passport.authenticate('github', {
//         scope: ['user:email']
//     })
// );

// @route   GET /auth/github/callback
// @desc    GitHub OAuth callback
// router.get('/github/callback',
//     passport.authenticate('github', {
//         failureRedirect: '/login',
//         session: false
//     }),
//     (req, res) => {
//         const token = generateToken(req.user);
//         res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
//     }
// );







router.post('/firebase-login', verifyFirebaseToken, firebaseLogin);







export default router;