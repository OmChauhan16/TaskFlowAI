import User from '../models/User.js';
import { generateToken } from '../utils/tokenUtils.js';
import admin from '../config/firebaseAdmin.js';
import bcrypt from 'bcryptjs/dist/bcrypt.js';
import { sendOTPEmail } from '../utils/mailer.js';

// Store OTPs temporarily (use Redis in production)
const otpStore = new Map();

// Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const register = async (req, res) => {
    // try {
    //     const { name, email, password } = req.body;

    //     // Check if user exists
    //     const userExists = await User.findOne({ email });
    //     if (userExists) {
    //         return res.status(400).json({ message: 'User already exists' });
    //     }

    //     // Create user
    //     const user = await User.create({ name, email, password });

    //     // Generate token
    //     const token = generateToken(user._id);

    //     res.status(201).json({
    //         _id: user._id,
    //         name: user.name,
    //         email: user.email,
    //         avatar: user.avatar,
    //         token
    //     });
    // } catch (error) {
    //     res.status(500).json({ message: error.message });
    // }


    try {
        const { name, email, password, otp } = req.body;

        // Validate input
        if (!name || !email || !password || !otp) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Verify OTP
        const otpData = otpStore.get(email);

        if (!otpData) {
            return res.status(400).json({ message: 'OTP expired or not found. Please request a new one.' });
        }

        if (Date.now() > otpData.expiresAt) {
            otpStore.delete(email);
            return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
        }

        if (otpData.attempts >= 3) {
            otpStore.delete(email);
            return res.status(400).json({ message: 'Too many failed attempts. Please request a new OTP.' });
        }

        if (otpData.otp !== otp) {
            otpData.attempts += 1;
            otpStore.set(email, otpData);
            return res.status(400).json({
                message: `Invalid OTP. ${3 - otpData.attempts} attempts remaining.`
            });
        }

        // OTP verified, delete from store
        otpStore.delete(email);


        // Create user
        const user = await User.create({
            name,
            email,
            password,
            // avatar: user.avatar,
            isEmailVerified: true // Email is verified through OTP
        });

        // Generate JWT token
        const token = generateToken(user._id);


        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                isEmailVerified: user.isEmailVerified
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Registration failed. Please try again.' });
    }
};

export const login = async (req, res) => {
    // try {
    //     const { email, password } = req.body;

    //     // Find user
    //     const user = await User.findOne({ email }).select('+password');
    //     if (!user) {
    //         return res.status(401).json({ message: 'Invalid credentials' });
    //     }

    //     // Check password
    //     const isMatch = await user.comparePassword(password);
    //     if (!isMatch) {
    //         return res.status(401).json({ message: 'Invalid credentials' });
    //     }

    //     // Generate token
    //     const token = generateToken(user._id);

    //     res.json({
    //         _id: user._id,
    //         name: user.name,
    //         email: user.email,
    //         avatar: user.avatar,
    //         token
    //     });
    // } catch (error) {
    //     res.status(500).json({ message: error.message });
    // }


    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = generateToken(user._id);


        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                isEmailVerified: user.isEmailVerified
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed. Please try again.' });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');;
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const sendOtp = async (req, res) => {
    try {
        const { email, name } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Generate OTP
        const otp = generateOTP();

        // Store OTP with 10-minute expiration
        otpStore.set(email, {
            otp,
            expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
            attempts: 0
        });

        // Send OTP email
        await sendOTPEmail(email, name, otp);

        res.json({
            message: 'OTP sent successfully to your email',
            expiresIn: 600 // 10 minutes in seconds
        });
    } catch (error) {
        console.error('Send OTP error:', error);
        res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
    }
}


export const oauthLogin = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Missing Firebase token' });
        }

        const firebaseToken = authHeader.split(' ')[1];

        // ✅ Verify token
        const decoded = await admin.auth().verifyIdToken(firebaseToken);

        const firebaseUid = decoded.uid;
        const email = decoded.email;
        const name =
            decoded.name ||
            decoded.displayName ||
            email?.split('@')[0] ||
            'User';

        const avatar = decoded.picture || '/avatars/avatar1.png';

        const rawProvider = decoded.firebase?.sign_in_provider;

        let provider = 'email';
        if (rawProvider === 'google.com') provider = 'google';
        if (rawProvider === 'github.com') provider = 'github';

        if (!email) {
            return res.status(400).json({
                message: 'Email not available from OAuth provider'
            });
        }

        // ✅ Find or create user
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                firebaseUid,
                name,
                email,
                password: Math.random().toString(36).slice(-8),
                avatar,
                oauthProvider: provider,
                isEmailVerified: true
            });
        }


        const token = await generateToken(user._id);

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                oauthProvider: user.oauthProvider
            }
        });
    } catch (error) {
        console.error('OAuth login error:', error);
        res.status(500).json({ message: 'OAuth login failed' });
    }
};


export const firebaseLogin = async (req, res) => {
    const { uid, email, name, picture } = req.firebaseUser;

    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
        user = await User.create({
            firebaseUid: uid,
            email,
            name,
            avatar: picture,
            provider: 'firebase'
        });
    }

    const token = await generateToken(user._id);

    res.json({ user, token });
};
