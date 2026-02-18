// src/services/userService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Axios instance with auth token
const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// ── Get current user profile ──────────────────────────────────────────────────
export const getProfile = async () => {
    const { data } = await api.get('/users/profile');
    return data; // { user: { _id, name, email, phone, location, jobTitle, website, bio, avatar, createdAt } }
};

// ── Update profile fields ─────────────────────────────────────────────────────
export const updateProfile = async (profileData) => {
    const { data } = await api.put('/users/profile', profileData);
    return data; // { user: { ...updatedFields } }
};

// ── Upload avatar (multipart/form-data) ───────────────────────────────────────
export const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);

    const { data } = await api.post('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data; // { avatarUrl: 'https://...' }
};

// ── Change password ───────────────────────────────────────────────────────────
export const changePassword = async ({ currentPassword, newPassword }) => {
    const { data } = await api.put('/users/password', { currentPassword, newPassword });
    return data; // { message: 'Password updated' }
};

// ── Delete account ────────────────────────────────────────────────────────────
export const deleteAccount = async () => {
    const { data } = await api.delete('/users/profile');
    return data;
};