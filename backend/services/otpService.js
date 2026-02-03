// services/otpService.js
// import { redisClient } from '../config/redis.js';
import { getRedisClient } from '../config/redis.js';

const redisClient = getRedisClient();

// Fallback to memory storage if Redis is not available
const memoryStore = new Map();

class OTPService {
    // Generate 6-digit OTP
    generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Store OTP
    async storeOTP(email, otp, expiryMinutes = 10) {
        const data = {
            otp,
            expiresAt: Date.now() + expiryMinutes * 60 * 1000,
            attempts: 0
        };

        try {
            if (redisClient.isOpen) {
                // Store in Redis with TTL (time to live)
                await redisClient.setEx(
                    `otp:${email}`,
                    expiryMinutes * 60, // TTL in seconds
                    JSON.stringify(data)
                );
            } else {
                // Fallback to memory
                memoryStore.set(email, data);
            }
        } catch (error) {
            console.error('Error storing OTP:', error);
            // Fallback to memory on error
            memoryStore.set(email, data);
        }
    }

    // Get OTP
    async getOTP(email) {
        try {
            if (redisClient.isOpen) {
                const data = await redisClient.get(`otp:${email}`);
                return data ? JSON.parse(data) : null;
            } else {
                // Fallback to memory
                return memoryStore.get(email) || null;
            }
        } catch (error) {
            console.error('Error getting OTP:', error);
            return memoryStore.get(email) || null;
        }
    }

    // Update OTP (for incrementing attempts)
    async updateOTP(email, data) {
        try {
            if (redisClient.isOpen) {
                const ttl = await redisClient.ttl(`otp:${email}`);
                if (ttl > 0) {
                    await redisClient.setEx(
                        `otp:${email}`,
                        ttl,
                        JSON.stringify(data)
                    );
                }
            } else {
                // Fallback to memory
                memoryStore.set(email, data);
            }
        } catch (error) {
            console.error('Error updating OTP:', error);
            memoryStore.set(email, data);
        }
    }

    // Delete OTP
    async deleteOTP(email) {
        try {
            if (redisClient.isOpen) {
                await redisClient.del(`otp:${email}`);
            } else {
                // Fallback to memory
                memoryStore.delete(email);
            }
        } catch (error) {
            console.error('Error deleting OTP:', error);
            memoryStore.delete(email);
        }
    }

    // Verify OTP
    async verifyOTP(email, otp) {
        const otpData = await this.getOTP(email);

        if (!otpData) {
            return {
                success: false,
                message: 'OTP expired or not found. Please request a new one.'
            };
        }

        // Check expiry
        if (Date.now() > otpData.expiresAt) {
            await this.deleteOTP(email);
            return {
                success: false,
                message: 'OTP has expired. Please request a new one.'
            };
        }

        // Check attempts
        if (otpData.attempts >= 3) {
            await this.deleteOTP(email);
            return {
                success: false,
                message: 'Too many failed attempts. Please request a new OTP.'
            };
        }

        // Verify OTP
        if (otpData.otp !== otp) {
            otpData.attempts += 1;
            await this.updateOTP(email, otpData);
            return {
                success: false,
                message: `Invalid OTP. ${3 - otpData.attempts} attempts remaining.`
            };
        }

        // Success - delete OTP
        await this.deleteOTP(email);
        return {
            success: true,
            message: 'OTP verified successfully'
        };
    }
}

export default new OTPService();