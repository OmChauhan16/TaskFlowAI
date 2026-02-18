// ProjectDetailModal.jsx
import { useState, useEffect } from 'react';
import { X, Calendar, Folder } from 'lucide-react';
import { getProject, updateProject } from '../../services/projectService';
import toast from 'react-hot-toast';

const ProjectDetailModal = ({ projectId, onClose, onProjectUpdated }) => {
    const [project, setProject] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchProject();
    }, [projectId]);

    const fetchProject = async () => {
        try {
            setLoading(true);
            const data = await getProject(projectId);
            setProject(data.project);
            setFormData({
                name: data.project.name,
                description: data.project.description || '',
                status: data.project.status,
                color: data.project.color || '#3B82F6',
                dueDate: data.project.dueDate ? data.project.dueDate.split('T')[0] : '',
            });
        } catch (error) {
            toast.error('Failed to fetch project details');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const data = await updateProject(projectId, formData);
            setProject(data.project);
            setIsEditing(false);
            onProjectUpdated(data.project);
            toast.success('Project updated successfully!');
        } catch (error) {
            toast.error('Failed to update project');
        } finally {
            setSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setFormData({
            name: project.name,
            description: project.description || '',
            status: project.status,
            color: project.color || '#3B82F6',
            dueDate: project.dueDate ? project.dueDate.split('T')[0] : '',
        });
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

    if (!project) return null;

    const statusColors = {
        active: 'bg-green-100 text-green-700',
        'on-hold': 'bg-yellow-100 text-yellow-700',
        completed: 'bg-blue-100 text-blue-700',
        archived: 'bg-gray-100 text-gray-600',
    };

    const COLOR_OPTIONS = [
        '#3B82F6', '#8B5CF6', '#EC4899', '#EF4444',
        '#F97316', '#EAB308', '#22C55E', '#14B8A6',
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        {isEditing ? (
                            <div className="flex gap-2 flex-wrap">
                                {COLOR_OPTIONS.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setFormData({ ...formData, color })}
                                        className="w-7 h-7 rounded-lg border-2 transition"
                                        style={{
                                            backgroundColor: color,
                                            borderColor: formData.color === color ? '#1e40af' : 'transparent',
                                        }}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                                style={{ backgroundColor: project.color || '#3B82F6' }}
                            >
                                {project.name.charAt(0).toUpperCase()}
                            </div>
                        )}

                        {isEditing ? (
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="text-2xl font-bold w-full border-b-2 border-blue-500 outline-none"
                            />
                        ) : (
                            <h2 className="text-2xl font-bold text-gray-900 truncate">{project.name}</h2>
                        )}
                    </div>

                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition ml-4 flex-shrink-0">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        {isEditing ? (
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            >
                                <option value="active">Active</option>
                                {/* <option value="on-hold">On Hold</option> */}
                                <option value="completed">Completed</option>
                                <option value="archived">Archived</option>
                            </select>
                        ) : (
                            <span className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${statusColors[project.status] || 'bg-gray-100 text-gray-600'}`}>
                                {(project.status || 'active').replace('-', ' ').toUpperCase()}
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        {isEditing ? (
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none"
                                rows="4"
                                placeholder="Add a project description..."
                            />
                        ) : (
                            <p className="text-gray-600">{project.description || 'No description provided'}</p>
                        )}
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
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
                                <span>{project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'No due date'}</span>
                            </div>
                        )}
                    </div>

                    {/* Members */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Members</label>
                        <div className="flex items-center gap-2 flex-wrap">
                            {project.members && project.members.length > 0 ? (
                                project.members.map((member) => (
                                    <div key={member._id} className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                                        <img
                                            src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}`}
                                            alt={member.name}
                                            className="w-6 h-6 rounded-full"
                                        />
                                        <span className="text-sm">{member.name}</span>
                                    </div>
                                ))
                            ) : (
                                <span className="text-gray-500 text-sm">No members</span>
                            )}
                        </div>
                    </div>

                    {/* Task Count */}
                    {project.taskCount !== undefined && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tasks</label>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Folder className="w-4 h-4" />
                                <span>{project.taskCount} task{project.taskCount !== 1 ? 's' : ''}</span>
                            </div>
                        </div>
                    )}

                    {/* Footer meta */}
                    {project.createdBy && (
                        <div className="text-sm text-gray-500 pt-4 border-t">
                            Created by {project.createdBy.name} on {new Date(project.createdAt).toLocaleDateString()}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-3">
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleCancelEdit}
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
                            Edit Project
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailModal;