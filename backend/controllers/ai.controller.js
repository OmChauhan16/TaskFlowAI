// const aiService = require('../services/ai.service');
// const Task = require('../models/Task');
// const Project = require('../models/Project');
// const User = require('../models/User');

// class AIController {
//     /**
//      * Suggest task priority
//      * POST /api/ai/suggest-priority
//      */
//     async suggestPriority(req, res) {
//         try {
//             const { taskId, taskData } = req.body;

//             let task;
//             let contextData = taskData;

//             // If taskId provided, fetch task from database
//             if (taskId) {
//                 task = await Task.findById(taskId)
//                     .populate('assignee', 'name workload performanceMetrics')
//                     .populate('project', 'deadline')
//                     .populate('dependencies');

//                 if (!task) {
//                     return res.status(404).json({ message: 'Task not found' });
//                 }

//                 // Prepare context data
//                 contextData = {
//                     title: task.title,
//                     description: task.description,
//                     dueDate: task.dueDate,
//                     dependencies: task.dependencies,
//                     assigneeWorkload: task.assignee?.workload || 0,
//                     projectDeadline: task.project?.deadline,
//                     historicalData: {
//                         averageCompletionTime: await this.getAverageCompletionTime(task.project?._id),
//                         similarTasksCompleted: await this.getSimilarTasksCount(task.title)
//                     }
//                 };
//             }

//             const suggestion = await aiService.suggestTaskPriority(contextData);

//             res.json({
//                 success: true,
//                 suggestion,
//                 taskId: taskId || null
//             });
//         } catch (error) {
//             console.error('Suggest Priority Error:', error);
//             res.status(500).json({
//                 success: false,
//                 message: error.message || 'Failed to generate priority suggestion'
//             });
//         }
//     }

//     /**
//      * Generate task description
//      * POST /api/ai/generate-description
//      */
//     async generateDescription(req, res) {
//         try {
//             const { briefInput, projectId } = req.body;

//             if (!briefInput) {
//                 return res.status(400).json({ message: 'Brief input is required' });
//             }

//             let projectContext = {};

//             if (projectId) {
//                 const project = await Project.findById(projectId);
//                 if (project) {
//                     projectContext = {
//                         type: project.type,
//                         techStack: project.techStack,
//                         teamSize: project.members?.length || 0
//                     };
//                 }
//             }

//             const description = await aiService.generateTaskDescription(briefInput, projectContext);

//             res.json({
//                 success: true,
//                 description
//             });
//         } catch (error) {
//             console.error('Generate Description Error:', error);
//             res.status(500).json({
//                 success: false,
//                 message: error.message || 'Failed to generate task description'
//             });
//         }
//     }

//     /**
//      * Suggest assignee
//      * POST /api/ai/suggest-assignee
//      */
//     async suggestAssignee(req, res) {
//         try {
//             const { taskData, projectId } = req.body;

//             // Get team members from project
//             const project = await Project.findById(projectId)
//                 .populate({
//                     path: 'members',
//                     select: 'name email skills currentWorkload availability performanceMetrics'
//                 });

//             if (!project) {
//                 return res.status(404).json({ message: 'Project not found' });
//             }

//             // Enhance team member data with task history
//             const teamMembers = await Promise.all(
//                 project.members.map(async (member) => {
//                     const pastTasks = await Task.find({
//                         assignee: member._id,
//                         status: 'completed'
//                     }).limit(5).select('title estimatedHours actualHours');

//                     return {
//                         id: member._id,
//                         name: member.name,
//                         skills: member.skills || [],
//                         currentWorkload: member.currentWorkload || 0,
//                         availability: member.availability || 'Available',
//                         performanceMetrics: member.performanceMetrics || {},
//                         pastTasks: pastTasks.map(t => ({
//                             title: t.title,
//                             estimatedHours: t.estimatedHours,
//                             actualHours: t.actualHours
//                         }))
//                     };
//                 })
//             );

//             const suggestion = await aiService.suggestAssignee(taskData, teamMembers);

//             res.json({
//                 success: true,
//                 suggestion
//             });
//         } catch (error) {
//             console.error('Suggest Assignee Error:', error);
//             res.status(500).json({
//                 success: false,
//                 message: error.message || 'Failed to suggest assignee'
//             });
//         }
//     }

//     /**
//      * Detect bottlenecks
//      * POST /api/ai/detect-bottlenecks
//      */
//     async detectBottlenecks(req, res) {
//         try {
//             const { projectId } = req.body;

//             const project = await Project.findById(projectId)
//                 .populate('members', 'name currentWorkload capacity')
//                 .populate('tasks');

//             if (!project) {
//                 return res.status(404).json({ message: 'Project not found' });
//             }

//             const tasks = await Task.find({ project: projectId })
//                 .populate('assignee', 'name')
//                 .populate('dependencies');

//             const projectData = {
//                 name: project.name,
//                 totalTasks: tasks.length,
//                 completedTasks: tasks.filter(t => t.status === 'completed').length,
//                 inProgressTasks: tasks.filter(t => t.status === 'in-progress').length,
//                 blockedTasks: tasks.filter(t => t.status === 'blocked').length,
//                 tasks: tasks.map(t => ({
//                     id: t._id,
//                     title: t.title,
//                     status: t.status,
//                     assignee: t.assignee?.name,
//                     dueDate: t.dueDate,
//                     dependencies: t.dependencies?.length || 0,
//                     priority: t.priority
//                 })),
//                 teamCapacity: project.members.map(m => ({
//                     name: m.name,
//                     currentWorkload: m.currentWorkload || 0,
//                     capacity: m.capacity || 40
//                 }))
//             };

//             const bottlenecks = await aiService.detectBottlenecks(projectData);

//             res.json({
//                 success: true,
//                 bottlenecks
//             });
//         } catch (error) {
//             console.error('Detect Bottlenecks Error:', error);
//             res.status(500).json({
//                 success: false,
//                 message: error.message || 'Failed to detect bottlenecks'
//             });
//         }
//     }

//     /**
//      * Extract action items from meeting notes
//      * POST /api/ai/extract-action-items
//      */
//     async extractActionItems(req, res) {
//         try {
//             const { meetingNotes } = req.body;

//             if (!meetingNotes) {
//                 return res.status(400).json({ message: 'Meeting notes are required' });
//             }

//             const result = await aiService.extractActionItems(meetingNotes);

//             res.json({
//                 success: true,
//                 result
//             });
//         } catch (error) {
//             console.error('Extract Action Items Error:', error);
//             res.status(500).json({
//                 success: false,
//                 message: error.message || 'Failed to extract action items'
//             });
//         }
//     }

//     /**
//      * Parse natural language task
//      * POST /api/ai/parse-task
//      */
//     async parseNaturalLanguageTask(req, res) {
//         try {
//             const { input, workspaceId } = req.body;

//             if (!input) {
//                 return res.status(400).json({ message: 'Input is required' });
//             }

//             // Get context: team members and projects
//             const teamMembers = await User.find({ workspace: workspaceId })
//                 .select('name');

//             const projects = await Project.find({ workspace: workspaceId })
//                 .select('name');

//             const context = {
//                 currentUser: req.user.name,
//                 teamMembers: teamMembers.map(m => m.name),
//                 projects: projects.map(p => p.name)
//             };

//             const parsedTask = await aiService.parseNaturalLanguageTask(input, context);

//             res.json({
//                 success: true,
//                 parsedTask
//             });
//         } catch (error) {
//             console.error('Parse Natural Language Task Error:', error);
//             res.status(500).json({
//                 success: false,
//                 message: error.message || 'Failed to parse natural language task'
//             });
//         }
//     }

//     /**
//      * Generate project insights
//      * GET /api/ai/project-insights/:projectId
//      */
//     async generateProjectInsights(req, res) {
//         try {
//             const { projectId } = req.params;

//             const project = await Project.findById(projectId)
//                 .populate('members', 'name currentWorkload')
//                 .populate('tasks');

//             if (!project) {
//                 return res.status(404).json({ message: 'Project not found' });
//             }

//             const tasks = await Task.find({ project: projectId });

//             const projectData = {
//                 name: project.name,
//                 status: project.status,
//                 totalTasks: tasks.length,
//                 completedTasks: tasks.filter(t => t.status === 'completed').length,
//                 inProgressTasks: tasks.filter(t => t.status === 'in-progress').length,
//                 teamSize: project.members.length,
//                 startDate: project.startDate,
//                 deadline: project.deadline,
//                 tasks: tasks.map(t => ({
//                     status: t.status,
//                     priority: t.priority,
//                     estimatedHours: t.estimatedHours,
//                     actualHours: t.actualHours,
//                     createdAt: t.createdAt,
//                     completedAt: t.completedAt
//                 })),
//                 members: project.members.map(m => ({
//                     name: m.name,
//                     workload: m.currentWorkload || 0
//                 }))
//             };

//             // Get historical data from past projects
//             const historicalProjects = await Project.find({
//                 workspace: project.workspace,
//                 status: 'completed'
//             }).limit(5);

//             const historicalData = historicalProjects.map(p => ({
//                 name: p.name,
//                 totalTasks: p.tasks?.length || 0,
//                 duration: p.completedAt && p.startDate
//                     ? Math.ceil((p.completedAt - p.startDate) / (1000 * 60 * 60 * 24))
//                     : null,
//                 teamSize: p.members?.length || 0
//             }));

//             const insights = await aiService.generateProjectInsights(projectData, historicalData);

//             res.json({
//                 success: true,
//                 insights
//             });
//         } catch (error) {
//             console.error('Generate Project Insights Error:', error);
//             res.status(500).json({
//                 success: false,
//                 message: error.message || 'Failed to generate project insights'
//             });
//         }
//     }

//     // Helper methods
//     async getAverageCompletionTime(projectId) {
//         if (!projectId) return null;

//         const completedTasks = await Task.find({
//             project: projectId,
//             status: 'completed',
//             completedAt: { $exists: true }
//         });

//         if (completedTasks.length === 0) return null;

//         const totalTime = completedTasks.reduce((sum, task) => {
//             if (task.createdAt && task.completedAt) {
//                 return sum + (task.completedAt - task.createdAt);
//             }
//             return sum;
//         }, 0);

//         return Math.ceil(totalTime / completedTasks.length / (1000 * 60 * 60 * 24)); // in days
//     }

//     async getSimilarTasksCount(taskTitle) {
//         if (!taskTitle) return 0;

//         const keywords = taskTitle.toLowerCase().split(' ').filter(w => w.length > 3);

//         const similarTasks = await Task.countDocuments({
//             status: 'completed',
//             title: { $regex: keywords.join('|'), $options: 'i' }
//         });

//         return similarTasks;
//     }
// }

// module.exports = new AIController();





// import aiService from '../services/ai.service.js';
import Task from '../models/Task.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import aiService from '../services/aiService.js';
/**
 * Suggest task priority
 * POST /api/ai/suggest-priority
 */
export const suggestPriority = async (req, res) => {
    try {
        const { taskId, taskData } = req.body;

        let task;
        let contextData = taskData;

        if (taskId && mongoose.Types.ObjectId.isValid(taskId)) {
            task = await Task.findById(taskId)
                .populate('assignee', 'name workload performanceMetrics')
                .populate('project', 'deadline')
                .populate('dependencies');

            if (!task) {
                return res.status(404).json({ message: 'Task not found' });
            }

            contextData = {
                title: task.title,
                description: task.description,
                dueDate: task.dueDate,
                dependencies: task.dependencies,
                assigneeWorkload: task.assignee?.workload || 0,
                projectDeadline: task.project?.deadline,
                historicalData: {
                    averageCompletionTime: await getAverageCompletionTime(task.project?._id),
                    similarTasksCompleted: await getSimilarTasksCount(task.title)
                }
            };
        }

        const suggestion = await aiService.suggestTaskPriority(contextData);

        res.json({
            success: true,
            suggestion,
            taskId: taskId || null
        });

    } catch (error) {
        console.error('Suggest Priority Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to generate priority suggestion'
        });
    }
};


/**
 * Generate task description
 */
export const generateDescription = async (req, res) => {
    try {
        const { briefInput, projectId } = req.body;

        if (!briefInput) {
            return res.status(400).json({ message: 'Brief input is required' });
        }

        let projectContext = {};

        if (projectId && mongoose.Types.ObjectId.isValid(projectId)) {
            const project = await Project.findById(projectId);

            if (project) {
                projectContext = {
                    type: project.type,
                    techStack: project.techStack,
                    teamSize: project.members?.length || 0
                };
            }
        }

        const description = await aiService.generateTaskDescription(
            briefInput,
            projectContext
        );

        res.json({
            success: true,
            description
        });

    } catch (error) {
        console.error('Generate Description Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to generate task description'
        });
    }
};


/**
 * Suggest assignee
 */
export const suggestAssignee = async (req, res) => {
    try {
        const { taskData, projectId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({ message: 'Invalid projectId' });
        }

        const project = await Project.findById(projectId).populate({
            path: 'members',
            select: 'name email skills currentWorkload availability performanceMetrics'
        });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const teamMembers = await Promise.all(
            project.members.map(async (member) => {
                const pastTasks = await Task.find({
                    assignee: member._id,
                    status: 'completed'
                }).limit(5).select('title estimatedHours actualHours');

                return {
                    id: member._id,
                    name: member.name,
                    skills: member.skills || [],
                    currentWorkload: member.currentWorkload || 0,
                    availability: member.availability || 'Available',
                    performanceMetrics: member.performanceMetrics || {},
                    pastTasks: pastTasks.map(t => ({
                        title: t.title,
                        estimatedHours: t.estimatedHours,
                        actualHours: t.actualHours
                    }))
                };
            })
        );

        const suggestion = await aiService.suggestAssignee(taskData, teamMembers);

        res.json({
            success: true,
            suggestion
        });

    } catch (error) {
        console.error('Suggest Assignee Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to suggest assignee'
        });
    }
};


/**
 * Detect bottlenecks
 */
export const detectBottlenecks = async (req, res) => {
    try {
        const { projectId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({ message: 'Invalid projectId' });
        }

        const project = await Project.findById(projectId)
            .populate('members', 'name currentWorkload capacity');

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const tasks = await Task.find({ project: projectId })
            .populate('assignee', 'name')
            .populate('dependencies');

        const projectData = {
            name: project.name,
            totalTasks: tasks.length,
            completedTasks: tasks.filter(t => t.status === 'completed').length,
            inProgressTasks: tasks.filter(t => t.status === 'in-progress').length,
            blockedTasks: tasks.filter(t => t.status === 'blocked').length,
            tasks: tasks.map(t => ({
                id: t._id,
                title: t.title,
                status: t.status,
                assignee: t.assignee?.name,
                dueDate: t.dueDate,
                dependencies: t.dependencies?.length || 0,
                priority: t.priority
            })),
            teamCapacity: project.members.map(m => ({
                name: m.name,
                currentWorkload: m.currentWorkload || 0,
                capacity: m.capacity || 40
            }))
        };

        const bottlenecks = await aiService.detectBottlenecks(projectData);

        res.json({
            success: true,
            bottlenecks
        });

    } catch (error) {
        console.error('Detect Bottlenecks Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to detect bottlenecks'
        });
    }
};


/**
 * Extract action items
 */
export const extractActionItems = async (req, res) => {
    try {
        const { meetingNotes } = req.body;

        if (!meetingNotes) {
            return res.status(400).json({ message: 'Meeting notes are required' });
        }

        const result = await aiService.extractActionItems(meetingNotes);

        res.json({
            success: true,
            result
        });

    } catch (error) {
        console.error('Extract Action Items Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to extract action items'
        });
    }
};


/**
 * Parse natural language task
 */
export const parseNaturalLanguageTask = async (req, res) => {
    try {
        const { input, workspaceId } = req.body;

        if (!input) {
            return res.status(400).json({ message: 'Input is required' });
        }

        const teamMembers = await User.find({ workspace: workspaceId }).select('name');
        const projects = await Project.find({ workspace: workspaceId }).select('name');

        const context = {
            currentUser: req.user?.name,
            teamMembers: teamMembers.map(m => m.name),
            projects: projects.map(p => p.name)
        };

        const parsedTask = await aiService.parseNaturalLanguageTask(input, context);

        res.json({
            success: true,
            parsedTask
        });

    } catch (error) {
        console.error('Parse Natural Language Task Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to parse natural language task'
        });
    }
};


/**
 * Generate project insights
 */
export const generateProjectInsights = async (req, res) => {
    try {
        const { projectId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({ message: 'Invalid projectId' });
        }

        const project = await Project.findById(projectId)
            .populate('members', 'name currentWorkload');

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const tasks = await Task.find({ project: projectId });

        const projectData = {
            name: project.name,
            status: project.status,
            totalTasks: tasks.length,
            completedTasks: tasks.filter(t => t.status === 'completed').length,
            inProgressTasks: tasks.filter(t => t.status === 'in-progress').length,
            teamSize: project.members.length,
            startDate: project.startDate,
            deadline: project.deadline,
            tasks: tasks.map(t => ({
                status: t.status,
                priority: t.priority,
                estimatedHours: t.estimatedHours,
                actualHours: t.actualHours,
                createdAt: t.createdAt,
                completedAt: t.completedAt
            })),
            members: project.members.map(m => ({
                name: m.name,
                workload: m.currentWorkload || 0
            }))
        };

        const insights = await aiService.generateProjectInsights(projectData, []);

        res.json({
            success: true,
            insights
        });

    } catch (error) {
        console.error('Generate Project Insights Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to generate project insights'
        });
    }
};


/* =========================
   Helper Functions
========================= */

const getAverageCompletionTime = async (projectId) => {
    if (!projectId) return null;

    const completedTasks = await Task.find({
        project: projectId,
        status: 'completed',
        completedAt: { $exists: true }
    });

    if (completedTasks.length === 0) return null;

    const totalTime = completedTasks.reduce((sum, task) => {
        if (task.createdAt && task.completedAt) {
            return sum + (task.completedAt - task.createdAt);
        }
        return sum;
    }, 0);

    return Math.ceil(totalTime / completedTasks.length / (1000 * 60 * 60 * 24));
};


const getSimilarTasksCount = async (taskTitle) => {
    if (!taskTitle) return 0;

    const keywords = taskTitle
        .toLowerCase()
        .split(' ')
        .filter(w => w.length > 3);

    const similarTasks = await Task.countDocuments({
        status: 'completed',
        title: { $regex: keywords.join('|'), $options: 'i' }
    });

    return similarTasks;
};
