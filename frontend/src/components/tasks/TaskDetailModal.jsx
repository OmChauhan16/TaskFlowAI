import { useState, useEffect } from 'react';
import { X, Calendar, Flag, User, Tag } from 'lucide-react';
import { getTask, updateTask } from '../../services/taskService';
import toast from 'react-hot-toast';

const TaskDetailModal = ({ taskId, onClose, onTaskUpdated }) => {
    const [task, setTask] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchTask();
    }, [taskId]);

    const fetchTask = async () => {
        try {
            setLoading(true);
            const data = await getTask(taskId);
            setTask(data.task);
            setFormData({
                title: data.task.title,
                description: data.task.description,
                priority: data.task.priority,
                status: data.task.status,
                dueDate: data.task.dueDate ? data.task.dueDate.split('T')[0] : ''
            });
        } catch (error) {
            toast.error('Failed to fetch task details');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const data = await updateTask(taskId, formData);
            setTask(data.task);
            setIsEditing(false);
            onTaskUpdated(data.task);
            toast.success('Task updated successfully!');
        } catch (error) {
            toast.error('Failed to update task');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    if (!task) return null;

    const priorityColors = {
        low: 'bg-gray-100 text-gray-600',
        medium: 'bg-yellow-100 text-yellow-600',
        high: 'bg-orange-100 text-orange-600',
        urgent: 'bg-red-100 text-red-600'
    };

    const statusColors = {
        'todo': 'bg-gray-100 text-gray-700',
        'in-progress': 'bg-blue-100 text-blue-700',
        'review': 'bg-purple-100 text-purple-700',
        'done': 'bg-green-100 text-green-700'
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                    <div className="flex-1">
                        {isEditing ? (
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="text-2xl font-bold w-full border-b-2 border-blue-500 outline-none"
                            />
                        ) : (
                            <h2 className="text-2xl font-bold text-gray-900">{task.title}</h2>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition ml-4"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Status and Priority */}
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            {isEditing ? (
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="todo">To Do</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="review">Review</option>
                                    <option value="done">Done</option>
                                </select>
                            ) : (
                                <span className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${statusColors[task.status]}`}>
                                    {task.status.replace('-', ' ').toUpperCase()}
                                </span>
                            )}
                        </div>

                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Priority
                            </label>
                            {isEditing ? (
                                <select
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            ) : (
                                <span className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${priorityColors[task.priority]}`}>
                                    {task.priority.toUpperCase()}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        {isEditing ? (
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none"
                                rows="5"
                            />
                        ) : (
                            <p className="text-gray-600">
                                {task.description || 'No description provided'}
                            </p>
                        )}
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Due Date
                        </label>
                        {isEditing ? (
                            <input
                                type="date"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                className="px-4 py-2 border border-gray-300 rounded-lg"
                            />
                        ) : (
                            <div className="flex items-center gap-2 text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</span>
                            </div>
                        )}
                    </div>

                    {/* Assignees */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Assigned To
                        </label>
                        <div className="flex items-center gap-2">
                            {task.assignees && task.assignees.length > 0 ? (
                                task.assignees.map((assignee) => (
                                    <div key={assignee._id} className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                                        <img
                                            src={assignee.avatar || `https://ui-avatars.com/api/?name=${assignee.name}`}
                                            alt={assignee.name}
                                            className="w-6 h-6 rounded-full"
                                        />
                                        <span className="text-sm">{assignee.name}</span>
                                    </div>
                                ))
                            ) : (
                                <span className="text-gray-500 text-sm">No assignees</span>
                            )}
                        </div>
                    </div>

                    {/* Project */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Project
                        </label>
                        <div className="flex items-center gap-2">
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
                                style={{ backgroundColor: task.project.color }}
                            >
                                {task.project.name.charAt(0)}
                            </div>
                            <span className="font-medium">{task.project.name}</span>
                        </div>
                    </div>

                    {/* Created By */}
                    <div className="text-sm text-gray-500 pt-4 border-t">
                        Created by {task.createdBy.name} on {new Date(task.createdAt).toLocaleDateString()}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-3">
                    {isEditing ? (
                        <>
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setFormData({
                                        title: task.title,
                                        description: task.description,
                                        priority: task.priority,
                                        status: task.status,
                                        dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
                                    });
                                }}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                        >
                            Edit Task
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskDetailModal;
