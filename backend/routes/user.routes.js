import express from 'express';
import { register, login, getMe } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { getAllUsers, getProfile, updateProfile, uploadAvatar, changePassword, deleteAccount } from '../controllers/user.controller.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// Get all users (for team member selection)
router.get('/', protect, getAllUsers);

// Get specific user profile
// router.get('/:id', protect, getUserProfile);


// ── Multer config (temp local storage before Cloudinary upload) ───────────────
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/temp/'),
    filename: (req, file, cb) => {
        const uniqueName = `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

const fileFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed (jpeg, png, webp, gif)'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
});

// ── Routes (all protected) ────────────────────────────────────────────────────
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);
router.put('/password', protect, changePassword);
router.delete('/profile', protect, deleteAccount);
export default router;