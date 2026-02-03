// import { createClient } from 'redis';

// console.log(process.env.REDIS_URL,'process.env.REDIS_URL');

// const redisClient = createClient({
//     url: process.env.REDIS_URL ,
//     socket: {
//         reconnectStrategy: (retries) => {
//             if (retries > 10) {
//                 console.error('Redis: Too many reconnection attempts');
//                 return new Error('Redis reconnection failed');
//             }
//             return retries * 100; // Reconnect after retries * 100ms
//         }
//     }
// });

// redisClient.on('error', (err) => {
//     console.error('Redis Client Error:', err);
// });

// redisClient.on('connect', () => {
//     console.log('✅ Redis connected successfully');
// });

// redisClient.on('ready', () => {
//     console.log('✅ Redis ready to use');
// });

// // Connect to Redis
// const connectRedis = async () => {
//     try {
//         if (!redisClient.isOpen) {
//             await redisClient.connect();
//         }
//     } catch (error) {
//         console.error('Redis connection error:', error);
//         // For development: continue without Redis (fallback to memory)
//         if (process.env.NODE_ENV === 'development') {
//             console.warn('⚠️ Continuing without Redis in development mode');
//         } else {
//             throw error; // In production, fail if Redis is unavailable
//         }
//     }
// };

// // Graceful shutdown
// process.on('SIGINT', async () => {
//     await redisClient.quit();
//     console.log('Redis connection closed');
//     process.exit(0);
// });

// export { redisClient, connectRedis };



// import { createClient } from 'redis';

// let redisClient;

// export const connectRedis = async () => {
//     if (!process.env.REDIS_URL) {
//         throw new Error('REDIS_URL is missing');
//     }

//     if (!redisClient) {
//         redisClient = createClient({
//             url: process.env.REDIS_URL,
//             socket: {
//                 reconnectStrategy: (retries) =>
//                     retries > 10 ? new Error('Redis reconnection failed') : retries * 100
//             }
//         });

//         redisClient.on('error', (err) => {
//             console.error('Redis Client Error:', err);
//         });
//     }

//     if (!redisClient.isOpen) {
//         await redisClient.connect();
//         console.log('✅ Redis connected');
//     }

//     return redisClient;
// };

// export { redisClient };




import { createClient } from "redis";

let redisClient;

export const connectRedis = async () => {
    if (!process.env.REDIS_URL) {
        throw new Error("REDIS_URL is missing");
    }

    if (!redisClient) {
        redisClient = createClient({
            url: process.env.REDIS_URL,
            tls: true,          // REQUIRED for Redis Cloud
            rejectUnauthorized: false, // IMPORTANT (dev-safe)
            socket: {
                reconnectStrategy: (retries) =>
                    retries > 10 ? new Error("Redis reconnection failed") : retries * 100
            }
        });

        redisClient.on("error", (err) => {
            console.error("Redis Client Error:", err);
        });
    }

    if (!redisClient.isOpen) {
        await redisClient.connect();
        console.log("✅ Redis connected");
    }

    return redisClient;
};

export const getRedisClient = () => redisClient;
