import express from 'express';
import {
    createProject,
    getProjects,
    getProject,
    updateProject,
    deleteProject
} from '../controllers/project.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect); // All routes require authentication

router.route('/')
    .post(createProject)
    .get(getProjects);

router.route('/:id')
    .get(getProject)
    .put(updateProject)
    .delete(deleteProject);

export default router;
