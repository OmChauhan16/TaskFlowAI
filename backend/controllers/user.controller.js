import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

// backend/controllers/user.controller.js
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('name email avatar') // Only send necessary fields
            .limit(100); // Limit results

        res.json({
            success: true,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ── GET /api/users/profile ────────────────────────────────────────────────────
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        console.log(user, 'user-30');

        res.json({ user });
    } catch (err) {
        console.error('getProfile error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ── PUT /api/users/profile ────────────────────────────────────────────────────
export const updateProfile = async (req, res) => {
    try {
        const { name, email, phone, location, jobTitle, website, bio } = req.body;

        // Check if new email is taken by another user
        if (email) {
            const existing = await User.findOne({ email, _id: { $ne: req.user.id } });
            if (existing) {
                return res.status(400).json({ message: 'Email is already in use' });
            }
        }

        const updated = await User.findByIdAndUpdate(
            req.user.id,
            { $set: { name, email, phone, location, jobTitle, website, bio } },
            { new: true, runValidators: true }
        ).select('-password');

        res.json({ user: updated });
    } catch (err) {
        console.error('updateProfile error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ── POST /api/users/avatar ────────────────────────────────────────────────────
export const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'taskflow/avatars',
            width: 200,
            height: 200,
            crop: 'fill',
            gravity: 'face',
        });

        // Delete temp file from disk
        fs.unlinkSync(req.file.path);

        // Delete old avatar from Cloudinary if it exists
        const user = await User.findById(req.user.id);
        if (user.avatarPublicId) {
            await cloudinary.uploader.destroy(user.avatarPublicId);
        }

        // Save new avatar URL and public_id
        const updated = await User.findByIdAndUpdate(
            req.user.id,
            { $set: { avatar: result.secure_url, avatarPublicId: result.public_id } },
            { new: true }
        ).select('-password');

        res.json({ avatarUrl: result.secure_url, user: updated });
    } catch (err) {
        console.error('uploadAvatar error:', err);
        // Clean up temp file if upload failed
        if (req.file?.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: 'Failed to upload avatar',err });
    }
};

// ── PUT /api/users/password ───────────────────────────────────────────────────
// export const changePassword = async (req, res) => {
//     try {
//         const { currentPassword, newPassword } = req.body;

//         if (!currentPassword || !newPassword) {
//             return res.status(400).json({ message: 'Both current and new password are required' });
//         }

//         if (newPassword.length < 6) {
//             return res.status(400).json({ message: 'New password must be at least 6 characters' });
//         }

//         const user = await User.findById(req.user.id);
//         console.log(user, 'user-121');

//         const isMatch = await bcrypt.compare(currentPassword, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ message: 'Current password is incorrect' });
//         }

//         const hashed = await bcrypt.hash(newPassword, 12);
//         await User.findByIdAndUpdate(req.user.id, { $set: { password: hashed } });

//         res.json({ message: 'Password updated successfully' });
//     } catch (err) {
//         console.error('changePassword error:', err);
//         res.status(500).json({ message: 'Server error' });
//     }
// };

export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Both current and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters' });
        }

        // Need to explicitly select password field since it's select: false in schema
        const user = await User.findById(req.user.id).select('+password');

        // Check if user signed up with OAuth (no password set)
        if (user.oauthProvider && !user.password) {
            return res.status(400).json({
                message: 'You signed up with Google. Please use Google to sign in, or set a password first.'
            });
        }

        // If user has a password, verify current password
        if (user.password) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }
        }

        const hashed = await bcrypt.hash(newPassword, 12);
        await User.findByIdAndUpdate(req.user.id, { $set: { password: hashed } });

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error('changePassword error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ── DELETE /api/users/profile ─────────────────────────────────────────────────
export const deleteAccount = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        // Delete avatar from Cloudinary
        if (user.avatarPublicId) {
            await cloudinary.uploader.destroy(user.avatarPublicId);
        }

        await User.findByIdAndDelete(req.user.id);
        res.json({ message: 'Account deleted successfully' });
    } catch (err) {
        console.error('deleteAccount error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};






