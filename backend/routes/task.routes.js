import express from 'express';
import {
    createTask,
    getTasks,
    getTask,
    updateTask,
    updateTaskStatus,
    deleteTask
} from '../controllers/task.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .post(createTask)
    .get(getTasks);

router.route('/:id')
    .get(getTask)
    .put(updateTask)
    .delete(deleteTask);

router.patch('/:id/status', updateTaskStatus);

export default router;
