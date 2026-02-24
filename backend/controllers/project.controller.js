import Project from '../models/Project.js';
import User from '../models/User.js';
import Task from '../models/Task.js';

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req, res) => {
    try {
        const { name, description, color, deadline, startDate } = req.body;
        console.log(deadline, 'deadline');
        console.log(startDate, 'startDate');

        const project = await Project.create({
            name,
            description: description || '',
            color: color || '#3b82f6',
            owner: req.user._id,
            members: [{
                user: req.user._id,
                role: 'owner'
            }],
            startDate: startDate,
            dueDate: deadline
        });

        // Add project to user's projects array
        await User.findByIdAndUpdate(req.user._id, {
            $push: { projects: project._id }
        });

        const populatedProject = await Project.findById(project._id)
            .populate('owner', 'name email avatar')
            .populate('members.user', 'name email avatar');

        res.status(201).json({
            success: true,
            project: populatedProject
        });
    } catch (error) {
        console.error('Create project error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all user's projects
// @route   GET /api/projects
// @access  Private
// export const getProjects = async (req, res) => {
//     try {
//         const projects = await Project.find({
//             $or: [
//                 { owner: req.user._id },
//                 { 'members.user': req.user._id }
//             ],
//             status: { $ne: 'archived' }
//         })
//             .populate('owner', 'name email avatar')
//             .populate('members.user', 'name email avatar')
//             .sort({ updatedAt: -1 });

//         res.json({
//             success: true,
//             count: projects.length,
//             projects
//         });
//     } catch (error) {
//         console.error('Get projects error:', error);
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

export const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            $or: [
                { owner: req.user._id },
                { 'members.user': req.user._id }
            ],
            status: { $ne: 'archived' }
        })
            .populate('owner', 'name email avatar')
            .populate('members.user', 'name email avatar')
            .sort({ updatedAt: -1 });

        // ← ADD THIS: Add task count to each project
        const projectsWithTaskCount = await Promise.all(
            projects.map(async (project) => {
                const taskCount = await Task.countDocuments({
                    project: project._id
                });

                return {
                    ...project.toObject(),
                    taskCount,
                    memberCount: project.members.length // Also add member count for clarity
                };
            })
        );
        console.log(projectsWithTaskCount, 'project');


        res.json({
            success: true,
            count: projectsWithTaskCount.length,
            projects: projectsWithTaskCount // ← Return enhanced projects
        });
    } catch (error) {
        console.error('Get projects error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
export const getProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('owner', 'name email avatar')
            .populate('members.user', 'name email avatar');

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        // Check if user has access
        const isMember = project.members.some(
            member => member.user._id.toString() === req.user._id.toString()
        );

        if (!isMember && project.owner._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this project'
            });
        }

        res.json({
            success: true,
            project
        });
    } catch (error) {
        console.error('Get project error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = async (req, res) => {
    try {
        const { name, description, color, status, dueDate } = req.body;

        let project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        // Check if user is owner or admin
        const member = project.members.find(
            m => m.user.toString() === req.user._id.toString()
        );

        if (!member || (member.role !== 'owner' && member.role !== 'admin')) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this project'
            });
        }

        project.name = name || project.name;
        project.description = description !== undefined ? description : project.description;
        project.color = color || project.color;
        project.status = status || project.status;
        project.dueDate = dueDate || project.dueDate;

        await project.save();

        project = await Project.findById(project._id)
            .populate('owner', 'name email avatar')
            .populate('members.user', 'name email avatar');

        res.json({
            success: true,
            project
        });
    } catch (error) {
        console.error('Update project error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        // Only owner can delete
        if (project.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Only project owner can delete'
            });
        }

        await project.deleteOne();

        res.json({
            success: true,
            message: 'Project deleted successfully'
        });
    } catch (error) {
        console.error('Delete project error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

