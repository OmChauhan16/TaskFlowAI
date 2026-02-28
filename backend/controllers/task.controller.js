// import Task from '../models/Task.js';
// import Project from '../models/Project.js';

// // @desc    Create new task
// // @route   POST /api/tasks
// // @access  Private
// export const createTask = async (req, res) => {
//     try {
//         const {
//             title,
//             description,
//             project,
//             assignees,
//             status,
//             priority,
//             dueDate,
//             labels
//         } = req.body;

//         // Verify project exists and user has access
//         const projectDoc = await Project.findById(project);
//         if (!projectDoc) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Project not found'
//             });
//         }

//         const task = await Task.create({
//             title,
//             description: description || '',
//             project,
//             assignees: assignees || [],
//             status: status || 'todo',
//             priority: priority || 'medium',
//             dueDate,
//             labels: labels || [],
//             createdBy: req.user._id
//         });

//         const populatedTask = await Task.findById(task._id)
//             .populate('project', 'name color')
//             .populate('assignees', 'name email avatar')
//             .populate('createdBy', 'name email avatar');

//         // Emit socket event for real-time update
//         const io = req.app.get('io');
//         if (io) {
//             io.to(project).emit('task-created', populatedTask);
//         }

//         res.status(201).json({
//             success: true,
//             task: populatedTask
//         });
//     } catch (error) {
//         console.error('Create task error:', error);
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// // @desc    Get all tasks (with filters)
// // @route   GET /api/tasks?project=xxx&status=xxx&assignee=xxx
// // @access  Private
// export const getTasks = async (req, res) => {
//     try {
//         const { project, status, priority, assignee, search } = req.query;

//         const query = {};

//         // Filter by project
//         if (project) {
//             query.project = project;
//         } else {
//             // Get all projects user has access to
//             const projects = await Project.find({
//                 $or: [
//                     { owner: req.user._id },
//                     { 'members.user': req.user._id }
//                 ]
//             }).select('_id');

//             query.project = { $in: projects.map(p => p._id) };
//         }

//         // Filter by status
//         if (status) {
//             query.status = status;
//         }

//         // Filter by priority
//         if (priority) {
//             query.priority = priority;
//         }

//         // Filter by assignee
//         if (assignee) {
//             query.assignees = assignee;
//         }

//         // Search in title and description
//         if (search) {
//             query.$or = [
//                 { title: { $regex: search, $options: 'i' } },
//                 { description: { $regex: search, $options: 'i' } }
//             ];
//         }

//         const tasks = await Task.find(query)
//             .populate('project', 'name color')
//             .populate('assignees', 'name email avatar')
//             .populate('createdBy', 'name email avatar')
//             .sort({ createdAt: -1 });

//         res.json({
//             success: true,
//             count: tasks.length,
//             tasks
//         });
//     } catch (error) {
//         console.error('Get tasks error:', error);
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// // @desc    Get single task
// // @route   GET /api/tasks/:id
// // @access  Private
// export const getTask = async (req, res) => {
//     try {
//         const task = await Task.findById(req.params.id)
//             .populate('project', 'name color')
//             .populate('assignees', 'name email avatar')
//             .populate('createdBy', 'name email avatar');

//         if (!task) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Task not found'
//             });
//         }

//         res.json({
//             success: true,
//             task
//         });
//     } catch (error) {
//         console.error('Get task error:', error);
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// // @desc    Update task
// // @route   PUT /api/tasks/:id
// // @access  Private
// export const updateTask = async (req, res) => {
//     try {
//         let task = await Task.findById(req.params.id);

//         if (!task) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Task not found'
//             });
//         }

//         const {
//             title,
//             description,
//             status,
//             priority,
//             assignees,
//             dueDate,
//             labels
//         } = req.body;

//         task.title = title || task.title;
//         task.description = description !== undefined ? description : task.description;
//         task.status = status || task.status;
//         task.priority = priority || task.priority;
//         task.assignees = assignees !== undefined ? assignees : task.assignees;
//         task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;
//         task.labels = labels !== undefined ? labels : task.labels;

//         await task.save();

//         task = await Task.findById(task._id)
//             .populate('project', 'name color')
//             .populate('assignees', 'name email avatar')
//             .populate('createdBy', 'name email avatar');

//         // Emit socket event
//         const io = req.app.get('io');
//         if (io) {
//             io.to(task.project._id.toString()).emit('task-updated', task);
//         }

//         res.json({
//             success: true,
//             task
//         });
//     } catch (error) {
//         console.error('Update task error:', error);
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// // @desc    Update task status (for drag-drop)
// // @route   PATCH /api/tasks/:id/status
// // @access  Private
// export const updateTaskStatus = async (req, res) => {
//     try {
//         const { status } = req.body;

//         let task = await Task.findById(req.params.id);

//         if (!task) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Task not found'
//             });
//         }

//         task.status = status;
//         await task.save();

//         task = await Task.findById(task._id)
//             .populate('project', 'name color')
//             .populate('assignees', 'name email avatar')
//             .populate('createdBy', 'name email avatar');

//         // Emit socket event
//         const io = req.app.get('io');
//         if (io) {
//             io.to(task.project._id.toString()).emit('task-updated', task);
//         }

//         res.json({
//             success: true,
//             task
//         });
//     } catch (error) {
//         console.error('Update task status error:', error);
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// // @desc    Delete task
// // @route   DELETE /api/tasks/:id
// // @access  Private
// export const deleteTask = async (req, res) => {
//     try {
//         const task = await Task.findById(req.params.id);

//         if (!task) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Task not found'
//             });
//         }

//         const projectId = task.project.toString();
//         await task.deleteOne();

//         // Emit socket event
//         const io = req.app.get('io');
//         if (io) {
//             io.to(projectId).emit('task-deleted', { taskId: req.params.id });
//         }

//         res.json({
//             success: true,
//             message: 'Task deleted successfully'
//         });
//     } catch (error) {
//         console.error('Delete task error:', error);
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };




import Task from '../models/Task.js';
import Project from '../models/Project.js';

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            project,
            assignees,
            status,
            priority,
            dueDate,
            labels
        } = req.body;

        // Verify project exists and user has access
        const projectDoc = await Project.findById(project);
        if (!projectDoc) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        const task = await Task.create({
            title,
            description: description || '',
            project,
            assignees: assignees || [],
            status: status || 'todo',
            priority: priority || 'medium',
            dueDate,
            labels: labels || [],
            createdBy: req.user._id
        });

        const populatedTask = await Task.findById(task._id)
            .populate('project', 'name color')
            .populate('assignees', 'name email avatar')
            .populate('createdBy', 'name email avatar');

        // ── Socket emit ───────────────────────────────────────────────────────
        // Emit to everyone in the project room EXCEPT the creator
        // Wrapped in { task } to match Kanban's socket.on('task-created', ({ task }) => ...)
        const io = req.app.get('io');
        if (io) {
            io.to(project.toString()).emit('task-created', {
                task: populatedTask,
                projectId: project.toString(),
                createdBy: {
                    _id: req.user._id,
                    name: req.user.name,
                }
            });
        }

        res.status(201).json({
            success: true,
            task: populatedTask
        });
    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all tasks (with filters)
// @route   GET /api/tasks?project=xxx&status=xxx&assignee=xxx
// @access  Private
export const getTasks = async (req, res) => {
    try {
        const { project, status, priority, assignee, search } = req.query;

        const query = {};

        if (project) {
            query.project = project;
        } else {
            const projects = await Project.find({
                $or: [
                    { owner: req.user._id },
                    { 'members.user': req.user._id }
                ]
            }).select('_id');

            query.project = { $in: projects.map(p => p._id) };
        }

        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (assignee) query.assignees = assignee;

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const tasks = await Task.find(query)
            .populate('project', 'name color')
            .populate('assignees', 'name email avatar')
            .populate('createdBy', 'name email avatar')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: tasks.length,
            tasks
        });
    } catch (error) {
        console.error('Get tasks error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
export const getTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('project', 'name color')
            .populate('assignees', 'name email avatar')
            .populate('createdBy', 'name email avatar');

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        res.json({ success: true, task });
    } catch (error) {
        console.error('Get task error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        const {
            title,
            description,
            status,
            priority,
            assignees,
            dueDate,
            labels
        } = req.body;

        task.title = title || task.title;
        task.description = description !== undefined ? description : task.description;
        task.status = status || task.status;
        task.priority = priority || task.priority;
        task.assignees = assignees !== undefined ? assignees : task.assignees;
        task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;
        task.labels = labels !== undefined ? labels : task.labels;

        await task.save();

        task = await Task.findById(task._id)
            .populate('project', 'name color')
            .populate('assignees', 'name email avatar')
            .populate('createdBy', 'name email avatar');

        // ── Socket emit ───────────────────────────────────────────────────────
        const io = req.app.get('io');
        if (io) {
            io.to(task.project._id.toString()).emit('task-updated', {
                task,
                projectId: task.project._id.toString(),
                updatedBy: {
                    _id: req.user._id,
                    name: req.user.name,
                }
            });
        }

        res.json({ success: true, task });
    } catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update task status (for Kanban drag-drop)
// @route   PATCH /api/tasks/:id/status
// @access  Private
export const updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;

        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        const previousStatus = task.status;
        task.status = status;
        await task.save();

        task = await Task.findById(task._id)
            .populate('project', 'name color')
            .populate('assignees', 'name email avatar')
            .populate('createdBy', 'name email avatar');

        // ── Socket emit ───────────────────────────────────────────────────────
        // Use 'task-updated' so the Kanban board moves the card to the right column
        const io = req.app.get('io');
        if (io) {
            io.to(task.project._id.toString()).emit('task-updated', {
                task,
                projectId: task.project._id.toString(),
                previousStatus,               // useful for client-side optimistic revert
                updatedBy: {
                    _id: req.user._id,
                    name: req.user.name,
                }
            });
        }

        res.json({ success: true, task });
    } catch (error) {
        console.error('Update task status error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        const projectId = task.project.toString();
        const taskId = req.params.id;

        await task.deleteOne();

        // ── Socket emit ───────────────────────────────────────────────────────
        const io = req.app.get('io');
        if (io) {
            io.to(projectId).emit('task-deleted', {
                taskId,
                projectId,
                deletedBy: {
                    _id: req.user._id,
                    name: req.user.name,
                }
            });
        }

        res.json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};