import express from 'express';
import dotenv from 'dotenv';
dotenv.config({
    path: new URL('.env', import.meta.url)
});
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import { errorHandler } from './middleware/error.middleware.js';
import { initSocket } from './socket/socketHandler.js';
import { connectRedis } from './config/redis.js';
import { apiLimiter } from './middleware/rateLimiter.js';
// Routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import projectRoutes from './routes/project.routes.js';
import taskRoutes from './routes/task.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import aiRoutes from './routes/ai.routes.js';

const app = express();
const httpServer = createServer(app);
console.log('========== ENV CHECK ==========');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY);
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'EXISTS' : 'MISSING');
console.log('==============================');

// Socket.io setup
const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true
    }
});

// Connect Database
// connectDB();

// Connect to Redis
const initRedis = async () => {
    try {
        await connectRedis();
    } catch (error) {
        console.error('❌ Redis connection error:', error);
        // Don't exit - continue with memory fallback
        console.warn('⚠️ Running without Redis - using memory storage');
    }
};

// Initialize connections
const initializeApp = async () => {
    await connectDB();
    await initRedis();
};

initializeApp();

// Health check route
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});
// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(apiLimiter);
// Make io accessible to routes
app.set('io', io);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Error Handler (must be last)
app.use(errorHandler);

// Initialize Socket.io
initSocket(io);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Socket.io server ready`);
});