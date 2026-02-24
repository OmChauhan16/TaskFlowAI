// import { useState } from 'react';
// import { X } from 'lucide-react';
// import { createProject } from '../../services/projectService';
// import toast from 'react-hot-toast';

// const CreateProjectModal = ({ onClose, onProjectCreated }) => {
//     const [formData, setFormData] = useState({
//         name: '',
//         description: '',
//         color: '#3b82f6'
//     });
//     const [loading, setLoading] = useState(false);

//     const colors = [
//         '#3b82f6', // Blue
//         '#10b981', // Green
//         '#f59e0b', // Orange
//         '#ef4444', // Red
//         '#8b5cf6', // Purple
//         '#ec4899', // Pink
//         '#14b8a6', // Teal
//         '#f97316'  // Orange
//     ];

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!formData.name.trim()) {
//             toast.error('Project name is required');
//             return;
//         }

//         setLoading(true);
//         try {
//             const data = await createProject(formData);
//             onProjectCreated(data.project);
//         } catch (error) {
//             toast.error('Failed to create project');
//             console.error(error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-xl max-w-md w-full p-6">
//                 <div className="flex items-center justify-between mb-6">
//                     <h2 className="text-2xl font-bold text-gray-900">Create New Project</h2>
//                     <button
//                         onClick={onClose}
//                         className="p-2 hover:bg-gray-100 rounded-lg transition"
//                     >
//                         <X className="w-5 h-5" />
//                     </button>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Project Name *
//                         </label>
//                         <input
//                             type="text"
//                             value={formData.name}
//                             onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//                             placeholder="Enter project name"
//                             required
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Description
//                         </label>
//                         <textarea
//                             value={formData.description}
//                             onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
//                             placeholder="Enter project description"
//                             rows="3"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Project Color
//                         </label>
//                         <div className="flex gap-3">
//                             {colors.map((color) => (
//                                 <button
//                                     key={color}
//                                     type="button"
//                                     onClick={() => setFormData({ ...formData, color })}
//                                     className={`w-10 h-10 rounded-lg transition ${formData.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
//                                         }`}
//                                     style={{ backgroundColor: color }}
//                                 />
//                             ))}
//                         </div>
//                     </div>

//                     <div className="flex gap-3 pt-4">
//                         <button
//                             type="button"
//                             onClick={onClose}
//                             className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
//                         >
//                             {loading ? 'Creating...' : 'Create Project'}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default CreateProjectModal;


import { useState, useEffect } from 'react';
import { X, Users, Check } from 'lucide-react';
import { createProject } from '../../services/projectService';
import { getUsers } from '../../services/userService'; 
import toast from 'react-hot-toast';

const CreateProjectModal = ({ onClose, onProjectCreated }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        color: '#3B82F6',
        startDate: '',
        deadline: '',
        members: [] // Array of user IDs
    });
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [showMemberDropdown, setShowMemberDropdown] = useState(false);

    const colors = [
        { name: 'Blue', value: '#3B82F6' },
        { name: 'Green', value: '#10B981' },
        { name: 'Orange', value: '#F59E0B' },
        { name: 'Red', value: '#EF4444' },
        { name: 'Purple', value: '#8B5CF6' },
        { name: 'Pink', value: '#EC4899' },
        { name: 'Teal', value: '#14B8A6' },
        { name: 'Amber', value: '#F97316' }
    ];

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoadingUsers(true);
            // Fetch all users/team members
            const response = await getUsers();
            setUsers(response.users || []);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            // If endpoint doesn't exist yet, we'll show a fallback
            toast.error('Could not load team members');
        } finally {
            setLoadingUsers(false);
        }
    };

    const toggleMember = (userId) => {
        setFormData(prev => ({
            ...prev,
            members: prev.members.includes(userId)
                ? prev.members.filter(id => id !== userId)
                : [...prev.members, userId]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error('Project name is required');
            return;
        }

        setLoading(true);
        try {
            const projectData = {
                name: formData.name,
                description: formData.description,
                color: formData.color,
                startDate: formData.startDate || undefined,
                deadline: formData.deadline || undefined,
                members: formData.members.length > 0 ? formData.members : undefined
            };

            const data = await createProject(projectData);
            onProjectCreated(data.project);
            toast.success('Project created successfully!');
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create project');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const selectedUsers = users.filter(user => formData.members.includes(user._id));

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl">
                    <h2 className="text-2xl font-bold text-gray-900">Create New Project</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Project Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Project Name *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            placeholder="Enter project name"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                            placeholder="Enter project description"
                            rows="4"
                        />
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Deadline
                            </label>
                            <input
                                type="date"
                                value={formData.deadline}
                                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                        </div>
                    </div>

                    {/* Team Members */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Team Members
                        </label>

                        {/* Selected Members Display */}
                        {selectedUsers.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                {selectedUsers.map(user => (
                                    <div
                                        key={user._id}
                                        className="flex items-center gap-2 bg-white rounded-lg px-3 py-1.5 shadow-sm"
                                    >
                                        <img
                                            src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                            alt={user.name}
                                            className="w-6 h-6 rounded-full"
                                        />
                                        <span className="text-sm font-medium">{user.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => toggleMember(user._id)}
                                            className="text-gray-400 hover:text-red-500 ml-1"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Add Members Button */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setShowMemberDropdown(!showMemberDropdown)}
                                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600"
                            >
                                <Users className="w-5 h-5" />
                                <span className="font-medium">
                                    {formData.members.length > 0
                                        ? `${formData.members.length} member(s) selected`
                                        : 'Add Team Members'
                                    }
                                </span>
                            </button>

                            {/* Members Dropdown */}
                            {showMemberDropdown && (
                                <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-10 max-h-64 overflow-y-auto">
                                    {loadingUsers ? (
                                        <div className="p-4 text-center text-gray-500">
                                            Loading team members...
                                        </div>
                                    ) : users.length === 0 ? (
                                        <div className="p-4 text-center text-gray-500">
                                            <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                            <p className="text-sm">No team members available</p>
                                        </div>
                                    ) : (
                                        <div className="p-2">
                                            {users.map(user => (
                                                <button
                                                    key={user._id}
                                                    type="button"
                                                    onClick={() => toggleMember(user._id)}
                                                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition text-left"
                                                >
                                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                                        formData.members.includes(user._id)
                                                            ? 'bg-blue-600 border-blue-600'
                                                            : 'border-gray-300'
                                                    }`}>
                                                        {formData.members.includes(user._id) && (
                                                            <Check className="w-3 h-3 text-white" />
                                                        )}
                                                    </div>
                                                    <img
                                                        src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                                        alt={user.name}
                                                        className="w-8 h-8 rounded-full"
                                                    />
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900">{user.name}</p>
                                                        <p className="text-xs text-gray-500">{user.email}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Select team members who will work on this project
                        </p>
                    </div>

                    {/* Project Color */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Project Color
                        </label>
                        <div className="flex flex-wrap gap-3">
                            {colors.map((color) => (
                                <button
                                    key={color.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, color: color.value })}
                                    className={`w-12 h-12 rounded-xl transition-all ${
                                        formData.color === color.value
                                            ? 'ring-4 ring-offset-2 ring-gray-400 scale-110'
                                            : 'hover:scale-105'
                                    }`}
                                    style={{ backgroundColor: color.value }}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold text-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                            {loading ? 'Creating...' : 'Create Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProjectModal;