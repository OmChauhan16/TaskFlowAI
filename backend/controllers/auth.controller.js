// import User from '../models/User.js';
// import { generateToken } from '../utils/tokenUtils.js';
// import admin from '../config/firebaseAdmin.js';
// import bcrypt from 'bcryptjs/dist/bcrypt.js';
// import { sendOTPEmail } from '../utils/mailer.js';

// // Store OTPs temporarily (use Redis in production)
// const otpStore = new Map();

// // Generate 6-digit OTP
// const generateOTP = () => {
//     return Math.floor(100000 + Math.random() * 900000).toString();
// };

// export const register = async (req, res) => {
//     // try {
//     //     const { name, email, password } = req.body;

//     //     // Check if user exists
//     //     const userExists = await User.findOne({ email });
//     //     if (userExists) {
//     //         return res.status(400).json({ message: 'User already exists' });
//     //     }

//     //     // Create user
//     //     const user = await User.create({ name, email, password });

//     //     // Generate token
//     //     const token = generateToken(user._id);

//     //     res.status(201).json({
//     //         _id: user._id,
//     //         name: user.name,
//     //         email: user.email,
//     //         avatar: user.avatar,
//     //         token
//     //     });
//     // } catch (error) {
//     //     res.status(500).json({ message: error.message });
//     // }


//     try {
//         const { name, email, password, otp } = req.body;

//         // Validate input
//         if (!name || !email || !password || !otp) {
//             return res.status(400).json({ message: 'Please provide all required fields' });
//         }

//         // Check if user already exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: 'User already exists' });
//         }

//         // Verify OTP
//         const otpData = otpStore.get(email);

//         if (!otpData) {
//             return res.status(400).json({ message: 'OTP expired or not found. Please request a new one.' });
//         }

//         if (Date.now() > otpData.expiresAt) {
//             otpStore.delete(email);
//             return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
//         }

//         if (otpData.attempts >= 3) {
//             otpStore.delete(email);
//             return res.status(400).json({ message: 'Too many failed attempts. Please request a new OTP.' });
//         }

//         if (otpData.otp !== otp) {
//             otpData.attempts += 1;
//             otpStore.set(email, otpData);
//             return res.status(400).json({
//                 message: `Invalid OTP. ${3 - otpData.attempts} attempts remaining.`
//             });
//         }

//         // OTP verified, delete from store
//         otpStore.delete(email);


//         // Create user
//         const user = await User.create({
//             name,
//             email,
//             password,
//             // avatar: user.avatar,
//             isEmailVerified: true // Email is verified through OTP
//         });

//         // Generate JWT token
//         const token = generateToken(user._id);


//         res.status(201).json({
//             token,
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 avatar: user.avatar,
//                 isEmailVerified: user.isEmailVerified
//             }
//         });
//     } catch (error) {
//         console.error('Registration error:', error);
//         res.status(500).json({ message: 'Registration failed. Please try again.' });
//     }
// };

// export const login = async (req, res) => {
//     // try {
//     //     const { email, password } = req.body;

//     //     // Find user
//     //     const user = await User.findOne({ email }).select('+password');
//     //     if (!user) {
//     //         return res.status(401).json({ message: 'Invalid credentials' });
//     //     }

//     //     // Check password
//     //     const isMatch = await user.comparePassword(password);
//     //     if (!isMatch) {
//     //         return res.status(401).json({ message: 'Invalid credentials' });
//     //     }

//     //     // Generate token
//     //     const token = generateToken(user._id);

//     //     res.json({
//     //         _id: user._id,
//     //         name: user.name,
//     //         email: user.email,
//     //         avatar: user.avatar,
//     //         token
//     //     });
//     // } catch (error) {
//     //     res.status(500).json({ message: error.message });
//     // }


//     try {
//         const { email, password } = req.body;

//         // Check if user exists
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(401).json({ message: 'Invalid credentials' });
//         }

//         // Check password
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(401).json({ message: 'Invalid credentials' });
//         }

//         // Generate JWT token
//         const token = generateToken(user._id);


//         res.json({
//             token,
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 avatar: user.avatar,
//                 isEmailVerified: user.isEmailVerified
//             }
//         });
//     } catch (error) {
//         console.error('Login error:', error);
//         res.status(500).json({ message: 'Login failed. Please try again.' });
//     }
// };

// export const getMe = async (req, res) => {
//     try {
//         const user = await User.findById(req.user._id).select('-password');;
//         res.json(user);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };


// export const sendOtp = async (req, res) => {
//     try {
//         const { email, name } = req.body;

//         // Check if user already exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: 'User already exists with this email' });
//         }

//         // Generate OTP
//         const otp = generateOTP();

//         // Store OTP with 10-minute expiration
//         otpStore.set(email, {
//             otp,
//             expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
//             attempts: 0
//         });

//         // Send OTP email
//         await sendOTPEmail(email, name, otp);

//         res.json({
//             message: 'OTP sent successfully to your email',
//             expiresIn: 600 // 10 minutes in seconds
//         });
//     } catch (error) {
//         console.error('Send OTP error:', error);
//         res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
//     }
// }


// export const oauthLogin = async (req, res) => {
//     try {
//         const authHeader = req.headers.authorization;

//         if (!authHeader || !authHeader.startsWith('Bearer ')) {
//             return res.status(401).json({ message: 'Missing Firebase token' });
//         }

//         const firebaseToken = authHeader.split(' ')[1];

//         // ✅ Verify token
//         const decoded = await admin.auth().verifyIdToken(firebaseToken);

//         const firebaseUid = decoded.uid;
//         const email = decoded.email;
//         const name =
//             decoded.name ||
//             decoded.displayName ||
//             email?.split('@')[0] ||
//             'User';

//         const avatar = decoded.picture || '/avatars/avatar1.png';

//         const rawProvider = decoded.firebase?.sign_in_provider;

//         let provider = 'email';
//         if (rawProvider === 'google.com') provider = 'google';
//         if (rawProvider === 'github.com') provider = 'github';

//         if (!email) {
//             return res.status(400).json({
//                 message: 'Email not available from OAuth provider'
//             });
//         }

//         // ✅ Find or create user
//         let user = await User.findOne({ email });

//         if (!user) {
//             user = await User.create({
//                 firebaseUid,
//                 name,
//                 email,
//                 password: Math.random().toString(36).slice(-8),
//                 avatar,
//                 oauthProvider: provider,
//                 isEmailVerified: true
//             });
//         }


//         const token = await generateToken(user._id);

//         res.json({
//             token,
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 avatar: user.avatar,
//                 oauthProvider: user.oauthProvider
//             }
//         });
//     } catch (error) {
//         console.error('OAuth login error:', error);
//         res.status(500).json({ message: 'OAuth login failed' });
//     }
// };






// controllers/auth.controller.js
import User from '../models/User.js';
import { generateToken } from '../utils/tokenUtils.js';
import admin from '../config/firebaseAdmin.js';
import bcrypt from 'bcryptjs/dist/bcrypt.js';
import { sendOTPEmail } from '../utils/mailer.js';
import otpService from '../services/otpService.js';

// @route   POST /api/auth/send-otp
// @desc    Send OTP to email for registration
// @access  Public
export const sendOtp = async (req, res) => {
    try {
        const { email, name } = req.body;

        // Validate input
        if (!email || !name) {
            return res.status(400).json({
                message: 'Email and name are required'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists with this email'
            });
        }

        // Generate OTP
        const otp = otpService.generateOTP();

        // Store OTP in Redis (10 minutes expiry)
        await otpService.storeOTP(email, otp, 10);

        // Send OTP email
        await sendOTPEmail(email, name, otp);

        res.json({
            success: true,
            message: 'OTP sent successfully to your email',
            expiresIn: 600 // 10 minutes in seconds
        });
    } catch (error) {
        console.error('Send OTP error:', error);
        res.status(500).json({
            message: 'Failed to send OTP. Please try again.'
        });
    }
};

// @route   POST /api/auth/register
// @desc    Register user with OTP verification
// @access  Public
export const register = async (req, res) => {
    try {
        const { name, email, password, avatar, otp } = req.body;

        // Validate input
        if (!name || !email || !password || !otp) {
            return res.status(400).json({
                message: 'Please provide all required fields'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }

        // Verify OTP using OTP service
        const otpVerification = await otpService.verifyOTP(email, otp);

        if (!otpVerification.success) {
            return res.status(400).json({
                message: otpVerification.message
            });
        }

        // Create user (password will be hashed by model pre-save hook)
        const user = await User.create({
            name,
            email,
            password,
            avatar: avatar || '/avatars/avatar1.png',
            isEmailVerified: true
        });

        // Generate JWT token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
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
        res.status(500).json({
            message: 'Registration failed. Please try again.'
        });
    }
};

// @route   POST /api/auth/login
// @desc    Login user with email/password
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        // Check if user exists (select password field)
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        // Generate JWT token
        const token = generateToken(user._id);

        res.json({
            success: true,
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
        res.status(500).json({
            message: 'Login failed. Please try again.'
        });
    }
};

// @route   POST /api/auth/oauth-login
// @desc    Login/Register with OAuth (Google/GitHub)
// @access  Public
// export const oauthLogin = async (req, res) => {
//     try {
//         const authHeader = req.headers.authorization;

//         if (!authHeader || !authHeader.startsWith('Bearer ')) {
//             return res.status(401).json({
//                 message: 'Missing Firebase token'
//             });
//         }

//         const firebaseToken = authHeader.split(' ')[1];

//         // Verify Firebase ID token
//         const decoded = await admin.auth().verifyIdToken(firebaseToken);

//         const firebaseUid = decoded.uid;
//         const email = decoded.email;
//         const name = decoded.name || decoded.displayName || email?.split('@')[0] || 'User';
//         const avatar = decoded.picture || '/avatars/avatar1.png';

//         // Determine provider
//         const rawProvider = decoded.firebase?.sign_in_provider;
//         let provider = 'email';
//         if (rawProvider === 'google.com') provider = 'google';
//         if (rawProvider === 'github.com') provider = 'github';

//         if (!email) {
//             return res.status(400).json({
//                 message: 'Email not available from OAuth provider'
//             });
//         }

//         // Find or create user
//         let user = await User.findOne({ email });

//         if (user) {
//             // Update existing user if Firebase UID not set
//             if (!user.firebaseUid) {
//                 user.firebaseUid = firebaseUid;
//                 user.oauthProvider = provider;
//                 user.isEmailVerified = true;
//                 await user.save();
//             }
//         } else {
//             // Create new user (password will be hashed by model)
//             user = await User.create({
//                 firebaseUid,
//                 name,
//                 email,
//                 password: Math.random().toString(36).slice(-8),
//                 avatar,
//                 oauthProvider: provider,
//                 isEmailVerified: true
//             });
//         }

//         // Generate JWT token
//         const token = generateToken(user._id);

//         res.json({
//             success: true,
//             token,
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 avatar: user.avatar,
//                 isEmailVerified: user.isEmailVerified,
//                 oauthProvider: user.oauthProvider
//             }
//         });
//     } catch (error) {
//         console.error('OAuth login error:', error);

//         // Handle specific Firebase errors
//         if (error.code === 'auth/id-token-expired') {
//             return res.status(401).json({
//                 message: 'Token expired. Please sign in again.'
//             });
//         }
//         if (error.code === 'auth/argument-error') {
//             return res.status(400).json({
//                 message: 'Invalid token format'
//             });
//         }

//         res.status(500).json({
//             message: 'OAuth login failed. Please try again.'
//         });
//     }
// };

// controllers/auth.controller.js - OAuth Login with DEBUG

export const oauthLogin = async (req, res) => {
    try {
        console.log('\n🔵 ===== OAuth Login Request =====');
        console.log('📋 Headers:', req.headers);

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('❌ No Bearer token found');
            return res.status(401).json({
                message: 'Missing Firebase token'
            });
        }

        const firebaseToken = authHeader.split(' ')[1];

        console.log('🔑 Token received:');
        console.log('   - Length:', firebaseToken.length);
        console.log('   - First 100 chars:', firebaseToken.substring(0, 100));
        console.log('   - Last 50 chars:', firebaseToken.substring(firebaseToken.length - 50));

        // Check if it looks like a JWT
        const parts = firebaseToken.split('.');
        console.log('   - JWT parts:', parts.length, '(should be 3)');

        if (parts.length === 3) {
            try {
                const header = JSON.parse(Buffer.from(parts[0], 'base64').toString());
                console.log('   - JWT Header:', header);
            } catch (e) {
                console.log('   - Failed to decode JWT header:', e.message);
            }
        }

        console.log('\n🔐 Attempting to verify token...');

        let decoded;
        try {
            decoded = await admin.auth().verifyIdToken(firebaseToken);
            console.log('✅ Token verified successfully!');
        } catch (verifyError) {
            console.error('❌ Token verification FAILED:');
            console.error('   - Error code:', verifyError.code);
            console.error('   - Error message:', verifyError.message);
            console.error('   - Full error:', verifyError);

            if (verifyError.code === 'auth/id-token-expired') {
                return res.status(401).json({
                    message: 'Token expired. Please sign in again.'
                });
            }
            if (verifyError.code === 'auth/argument-error') {
                return res.status(400).json({
                    message: 'Invalid token format. Please try signing in again.',
                    debug: process.env.NODE_ENV === 'development' ? {
                        error: verifyError.message,
                        tokenLength: firebaseToken.length,
                        tokenParts: firebaseToken.split('.').length
                    } : undefined
                });
            }

            throw verifyError;
        }

        console.log('👤 Decoded token data:');
        console.log('   - UID:', decoded.uid);
        console.log('   - Email:', decoded.email);
        console.log('   - Provider:', decoded.firebase?.sign_in_provider);
        console.log('   - Email verified:', decoded.email_verified);

        const firebaseUid = decoded.uid;
        const email = decoded.email;
        const name = decoded.name || decoded.displayName || email?.split('@')[0] || 'User';
        const avatar = decoded.picture || '/avatars/avatar1.png';

        const rawProvider = decoded.firebase?.sign_in_provider;
        let provider = 'email';
        if (rawProvider === 'google.com') provider = 'google';
        if (rawProvider === 'github.com') provider = 'github';

        if (!email) {
            console.log('❌ No email in token');
            return res.status(400).json({
                message: 'Email not available from OAuth provider'
            });
        }

        console.log('\n💾 Looking for user in database...');
        let user = await User.findOne({ email });

        if (user) {
            console.log('✅ User found:', user.email);
            if (!user.firebaseUid) {
                console.log('📝 Updating user with Firebase UID');
                user.firebaseUid = firebaseUid;
                user.oauthProvider = provider;
                user.isEmailVerified = true;
                await user.save();
            }
        } else {
            console.log('📝 Creating new user');
            user = await User.create({
                firebaseUid,
                name,
                email,
                password: Math.random().toString(36).slice(-8),
                avatar,
                oauthProvider: provider,
                isEmailVerified: true
            });
            console.log('✅ User created:', user.email);
        }

        const token = generateToken(user._id);

        console.log('✅ OAuth login successful!');
        console.log('🔵 ===== End OAuth Login =====\n');

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                isEmailVerified: user.isEmailVerified,
                oauthProvider: user.oauthProvider
            }
        });
    } catch (error) {
        console.error('\n❌ ===== OAuth Login Error =====');
        console.error('Error:', error);
        console.error('Stack:', error.stack);
        console.error('===== End Error =====\n');

        res.status(500).json({
            message: 'OAuth login failed. Please try again.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            message: 'Failed to get user data'
        });
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

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
    try {
        // If using cookies, clear the cookie
        res.cookie('token', '', {
            httpOnly: true,
            expires: new Date(0)
        });

        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error during logout'
        });
    }
};