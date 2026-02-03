// // middleware/rateLimiter.js
// import rateLimit from 'express-rate-limit';
// import RedisStore from 'rate-limit-redis';
// import { redisClient } from '../config/redis.js';

// // Create rate limiter with Redis store
// const createRateLimiter = (options = {}) => {
//     const defaultOptions = {
//         windowMs: 15 * 60 * 1000, // 15 minutes
//         max: 100, // Max requests per window
//         standardHeaders: true, // Return rate limit info in headers
//         legacyHeaders: false, // Disable X-RateLimit-* headers
//         message: 'Too many requests, please try again later.',
//         ...options
//     };

//     // Use Redis store if available, otherwise use memory store
//     if (redisClient.isOpen) {
//         defaultOptions.store = new RedisStore({
//             client: redisClient,
//             prefix: 'rate-limit:',
//         });
//     }

//     return rateLimit(defaultOptions);
// };

// // Specific rate limiters for different endpoints

// // General API rate limiter (100 requests per 15 minutes)
// export const apiLimiter = createRateLimiter({
//     windowMs: 15 * 60 * 1000,
//     max: 100,
//     message: 'Too many API requests, please try again after 15 minutes.'
// });

// // Strict rate limiter for auth endpoints (5 requests per 15 minutes)
// export const authLimiter = createRateLimiter({
//     windowMs: 15 * 60 * 1000,
//     max: 5,
//     message: 'Too many login attempts, please try again after 15 minutes.',
//     skipSuccessfulRequests: true, // Don't count successful requests
// });

// // OTP rate limiter (3 requests per 15 minutes per email)
// export const otpLimiter = createRateLimiter({
//     windowMs: 15 * 60 * 1000,
//     max: 3,
//     message: 'Too many OTP requests. Please try again after 15 minutes.',
//     keyGenerator: (req) => {
//         // Rate limit by email instead of IP
//         return req.body.email || req.ip;
//     }
// });

// // Registration rate limiter (3 registrations per hour per IP)
// export const registerLimiter = createRateLimiter({
//     windowMs: 60 * 60 * 1000, // 1 hour
//     max: 3,
//     message: 'Too many accounts created from this IP, please try again after an hour.'
// });

// // Password reset limiter (3 requests per hour)
// export const passwordResetLimiter = createRateLimiter({
//     windowMs: 60 * 60 * 1000,
//     max: 3,
//     message: 'Too many password reset requests, please try again after an hour.'
// });

// // Very strict limiter for sensitive operations (1 per 5 minutes)
// export const strictLimiter = createRateLimiter({
//     windowMs: 5 * 60 * 1000,
//     max: 1,
//     message: 'Please wait 5 minutes before trying again.'
// });

// export default createRateLimiter;


// middleware/rateLimiter.js
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { getRedisClient } from "../config/redis.js";

// Create rate limiter with optional Redis store
const createRateLimiter = (options = {}) => {
    const redisClient = getRedisClient();

    const defaultOptions = {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100,
        standardHeaders: true,
        legacyHeaders: false,
        message: "Too many requests, please try again later.",
        ...options,
    };

    // ✅ Use Redis store only if Redis is connected
    if (redisClient?.isOpen) {
        console.log("✅ Rate limiter using Redis store");

        defaultOptions.store = new RedisStore({
            sendCommand: (...args) => redisClient.sendCommand(args),
            prefix: "rate-limit:",
        });
    } else {
        console.warn("⚠️ Redis not available, using in-memory rate limiter");
    }

    return rateLimit(defaultOptions);
};

/* ----------------------- Specific Rate Limiters ----------------------- */

// General API limiter
export const apiLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many API requests, please try again after 15 minutes.",
});

// Auth limiter (login)
export const authLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: "Too many login attempts, please try again after 15 minutes.",
    skipSuccessfulRequests: true,
});

// OTP limiter (by email)
export const otpLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 3,
    message: "Too many OTP requests. Please try again after 15 minutes.",
    keyGenerator: (req) => req.body.email || req.ip,
});

// Registration limiter
export const registerLimiter = createRateLimiter({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: "Too many accounts created from this IP, please try again after an hour.",
});

// Password reset limiter
export const passwordResetLimiter = createRateLimiter({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: "Too many password reset requests, please try again after an hour.",
});

// Very strict limiter
export const strictLimiter = createRateLimiter({
    windowMs: 5 * 60 * 1000,
    max: 1,
    message: "Please wait 5 minutes before trying again.",
});

export default createRateLimiter;
