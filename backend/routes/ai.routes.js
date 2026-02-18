// const express = require('express');
// const router = express.Router();
// const aiController = require('../controllers/ai.controller');
// const authMiddleware = require('../middleware/auth.middleware');

import express from "express";
// import aiController from "../controllers/ai.controller";
const router = express.Router();
import { protect } from '../middleware/auth.middleware.js';
import { suggestPriority, generateDescription, suggestAssignee, detectBottlenecks, extractActionItems, parseNaturalLanguageTask, generateProjectInsights } from "../controllers/ai.controller.js";
// All AI routes require authentication
router.use(protect);

/**
 * @route   POST /api/ai/suggest-priority
 * @desc    Get AI-powered priority suggestion for a task
 * @access  Private
 */
router.post('/suggest-priority', suggestPriority);

/**
 * @route   POST /api/ai/generate-description
 * @desc    Generate comprehensive task description from brief input
 * @access  Private
 */
router.post('/generate-description', generateDescription);

/**
 * @route   POST /api/ai/suggest-assignee
 * @desc    Get AI suggestion for best team member to assign task
 * @access  Private
 */
router.post('/suggest-assignee', suggestAssignee);

/**
 * @route   POST /api/ai/detect-bottlenecks
 * @desc    Detect workflow bottlenecks in a project
 * @access  Private
 */
router.post('/detect-bottlenecks', detectBottlenecks);

/**
 * @route   POST /api/ai/extract-action-items
 * @desc    Extract action items from meeting notes
 * @access  Private
 */
router.post('/extract-action-items', extractActionItems);

/**
 * @route   POST /api/ai/parse-task
 * @desc    Parse natural language input into structured task
 * @access  Private
 */
router.post('/parse-task', parseNaturalLanguageTask);

/**
 * @route   GET /api/ai/project-insights/:projectId
 * @desc    Generate AI insights for a project
 * @access  Private
 */
router.get('/project-insights/:projectId', generateProjectInsights);

// module.exports = router;

export default router