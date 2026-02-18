import Task from '../models/Task.js';
import Project from '../models/Project.js';
import User from '../models/User.js';

export const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;

        // Get all projects user is part of
        const userProjects = await Project.find({
            $or: [
                { owner: userId },
                { 'members.user': userId }
            ]
        }).select('_id');

        const projectIds = userProjects.map(p => p._id);

        // Get all tasks from user's projects
        const allTasks = await Task.find({
            project: { $in: projectIds }
        });

        // Calculate stats
        const totalTasks = allTasks.length;
        const completedTasks = allTasks.filter(t => t.status === 'done').length;
        const inProgressTasks = allTasks.filter(t => t.status === 'in-progress').length;
        const todoTasks = allTasks.filter(t => t.status === 'todo').length;
        const reviewTasks = allTasks.filter(t => t.status === 'review').length;

        // High priority tasks that need attention
        const highPriorityTasks = allTasks.filter(
            t => (t.priority === 'high' || t.priority === 'urgent') && t.status !== 'done'
        ).length;

        // Overdue tasks
        const now = new Date();
        const overdueTasks = allTasks.filter(
            t => t.dueDate && new Date(t.dueDate) < now && t.status !== 'done'
        ).length;

        // Get team members count (unique users across all projects)
        const teamMembersSet = new Set();
        userProjects.forEach(project => {
            const fullProject = userProjects.find(p => p._id.equals(project._id));
            if (fullProject && fullProject.members) {
                fullProject.members.forEach(member => {
                    teamMembersSet.add(member.user.toString());
                });
            }
        });

        // Calculate completion rate
        const completionRate = totalTasks > 0
            ? Math.round((completedTasks / totalTasks) * 100)
            : 0;

        // Get recent tasks (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentTasks = await Task.find({
            project: { $in: projectIds },
            createdAt: { $gte: sevenDaysAgo }
        });

        const recentCompletedTasks = recentTasks.filter(t => t.status === 'done').length;

        res.json({
            success: true,
            stats: {
                totalTasks,
                completedTasks,
                inProgressTasks,
                todoTasks,
                reviewTasks,
                highPriorityTasks,
                overdueTasks,
                teamMembers: teamMembersSet.size,
                completionRate,
                recentTasksCount: recentTasks.length,
                recentCompletedCount: recentCompletedTasks
            }
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

