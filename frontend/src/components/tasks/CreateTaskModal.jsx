// import { useState, useEffect } from 'react';
// import { X, Calendar, User, Flag } from 'lucide-react';
// import { createTask } from '../../services/taskService';
// import { getProjects } from '../../services/projectService';
// import toast from 'react-hot-toast';

// const CreateTaskModal = ({ onClose, onTaskCreated, defaultProjectId = null }) => {
//     const [formData, setFormData] = useState({
//         title: '',
//         description: '',
//         project: defaultProjectId || '',
//         priority: 'medium',
//         dueDate: '',
//         assignees: [],
//         labels: []
//     });
//     const [projects, setProjects] = useState([]);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         fetchProjects();
//     }, []);

//     const fetchProjects = async () => {
//         try {
//             const data = await getProjects();
//             setProjects(data.projects);
//             if (!defaultProjectId && data.projects.length > 0) {
//                 setFormData(prev => ({ ...prev, project: data.projects[0]._id }));
//             }
//         } catch (error) {
//             toast.error('Failed to fetch projects');
//         }
//     };

//     const handleSubmit = async (e) => {
//         console.log('handlesubmit-37');

//         e.preventDefault();

//         if (!formData.title.trim()) {
//             toast.error('Task title is required');
//             return;
//         }

//         if (!formData.project) {
//             toast.error('Please select a project');
//             return;
//         }

//         setLoading(true);
//         try {
//             const data = await createTask(formData);
//             onTaskCreated(data.task);
//             toast.success('Task created successfully!');
//         } catch (error) {
//             toast.error('Failed to create task');
//             console.error(error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
//                 <div className="flex items-center justify-between mb-6">
//                     <h2 className="text-2xl font-bold text-gray-900">Create New Task</h2>
//                     <button
//                         onClick={onClose}
//                         className="p-2 hover:bg-gray-100 rounded-lg transition"
//                     >
//                         <X className="w-5 h-5" />
//                     </button>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     {/* Title */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Task Title *
//                         </label>
//                         <input
//                             type="text"
//                             value={formData.title}
//                             onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//                             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//                             placeholder="Enter task title"
//                             required
//                         />
//                     </div>

//                     {/* Description */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Description
//                         </label>
//                         <textarea
//                             value={formData.description}
//                             onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
//                             placeholder="Enter task description"
//                             rows="4"
//                         />
//                     </div>

//                     {/* Project Selection */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Project *
//                         </label>
//                         <select
//                             value={formData.project}
//                             onChange={(e) => setFormData({ ...formData, project: e.target.value })}
//                             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//                             required
//                         >
//                             <option value="">Select a project</option>
//                             {projects.map((project) => (
//                                 <option key={project._id} value={project._id}>
//                                     {project.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     {/* Priority and Due Date */}
//                     <div className="grid grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Priority
//                             </label>
//                             <select
//                                 value={formData.priority}
//                                 onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
//                                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//                             >
//                                 <option value="low">Low</option>
//                                 <option value="medium">Medium</option>
//                                 <option value="high">High</option>
//                                 <option value="urgent">Urgent</option>
//                             </select>
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Due Date
//                             </label>
//                             <input
//                                 type="date"
//                                 value={formData.dueDate}
//                                 onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
//                                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//                             />
//                         </div>
//                     </div>

//                     {/* Action Buttons */}
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
//                             {loading ? 'Creating...' : 'Create Task'}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default CreateTaskModal;


import { useState, useEffect } from 'react';
import { X, Calendar, User, Flag, Wand2, Brain, Sparkles, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { createTask } from '../../services/taskService';
import { getProjects } from '../../services/projectService';
import { useAI } from '../../context/AIContext';
import toast from 'react-hot-toast';

const CreateTaskModal = ({ onClose, onTaskCreated, defaultProjectId = null }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        project: defaultProjectId || '',
        priority: 'medium',
        dueDate: '',
        assignees: [],
        labels: []
    });
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAIHelper, setShowAIHelper] = useState(false);
    const [briefInput, setBriefInput] = useState('');
    const [showPrioritySuggestion, setShowPrioritySuggestion] = useState(false);
    const [activeTab, setActiveTab] = useState('manual'); // 'manual' or 'ai'

    const {
        generatedDescription,
        descriptionLoading,
        generateDescription,
        clearGeneratedDescription,
        prioritySuggestion,
        priorityLoading,
        getSuggestedPriority,
        clearPrioritySuggestion
    } = useAI();

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        // Auto-fill form when AI generates description
        if (generatedDescription) {
            setFormData(prev => ({
                ...prev,
                description: generatedDescription.description || prev.description,
                // Don't override title, keep user's input
            }));
            setActiveTab('manual'); // Switch to manual tab to show generated content
        }
    }, [generatedDescription]);

    useEffect(() => {
        // Auto-fill priority when AI suggests
        if (prioritySuggestion) {
            setFormData(prev => ({
                ...prev,
                priority: prioritySuggestion.priority.toLowerCase()
            }));
        }
    }, [prioritySuggestion]);

    const fetchProjects = async () => {
        try {
            const data = await getProjects();
            setProjects(data.projects);
            if (!defaultProjectId && data.projects.length > 0) {
                setFormData(prev => ({ ...prev, project: data.projects[0]._id }));
            }
        } catch (error) {
            toast.error('Failed to fetch projects');
        }
    };

    const handleGenerateWithAI = async () => {
        if (!briefInput.trim()) {
            toast.error('Please enter a brief description');
            return;
        }

        try {
            await generateDescription(briefInput, formData.project);
            // Set the title from brief input
            setFormData(prev => ({ ...prev, title: briefInput }));
            setBriefInput(''); // Clear input after successful generation
        } catch (error) {
            console.error('AI generation failed:', error);
        }
    };

    const handleGetPrioritySuggestion = async () => {
        if (!formData.title.trim()) {
            toast.error('Please enter a task title first');
            return;
        }

        try {
            await getSuggestedPriority({
                title: formData.title,
                description: formData.description,
                dueDate: formData.dueDate,
                project: formData.project
            });
            setShowPrioritySuggestion(true);
        } catch (error) {
            console.error('Priority suggestion failed:', error);
        }
    };

    const handleApplyAIContent = () => {
        if (!generatedDescription) return;

        // Apply all AI-generated content
        setFormData(prev => ({
            ...prev,
            description: generatedDescription.description || prev.description,
        }));

        setActiveTab('manual');
        clearGeneratedDescription();
        toast.success('AI content applied!');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            toast.error('Task title is required');
            return;
        }

        if (!formData.project) {
            toast.error('Please select a project');
            return;
        }

        setLoading(true);
        try {
            const data = await createTask(formData);
            onTaskCreated(data.task);
            toast.success('Task created successfully!');
            onClose();
        } catch (error) {
            toast.error('Failed to create task');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getPriorityColor = (priority) => {
        const colors = {
            low: 'bg-gray-100 text-gray-700 border-gray-300',
            medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
            high: 'bg-orange-100 text-orange-700 border-orange-300',
            urgent: 'bg-red-100 text-red-700 border-red-300'
        };
        return colors[priority] || colors.medium;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Create New Task</h2>
                        <p className="text-sm text-gray-500 mt-1">Use AI to help or create manually</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tab Switcher */}
                <div className="flex border-b bg-gray-50">
                    <button
                        onClick={() => setActiveTab('manual')}
                        className={`flex-1 px-6 py-3 font-medium transition ${activeTab === 'manual'
                                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        ✏️ Manual Entry
                    </button>
                    <button
                        onClick={() => setActiveTab('ai')}
                        className={`flex-1 px-6 py-3 font-medium transition flex items-center justify-center gap-2 ${activeTab === 'ai'
                                ? 'bg-white text-purple-600 border-b-2 border-purple-600'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        <Sparkles className="w-4 h-4" />
                        AI Assistant
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {activeTab === 'ai' ? (
                            /* AI Assistant Tab */
                            <div className="space-y-6">
                                {/* AI Quick Generator */}
                                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="bg-purple-600 p-2 rounded-lg">
                                            <Wand2 className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">AI Task Generator</h3>
                                            <p className="text-sm text-gray-600">Describe what needs to be done</p>
                                        </div>
                                    </div>

                                    <textarea
                                        value={briefInput}
                                        onChange={(e) => setBriefInput(e.target.value)}
                                        placeholder="E.g., Implement user authentication with email and password"
                                        className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none mb-4"
                                        rows="3"
                                        disabled={descriptionLoading}
                                    />

                                    <button
                                        type="button"
                                        onClick={handleGenerateWithAI}
                                        disabled={descriptionLoading || !briefInput.trim()}
                                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-lg disabled:cursor-not-allowed"
                                    >
                                        {descriptionLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <Wand2 className="w-5 h-5" />
                                                Generate Task Details
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Generated Content Preview */}
                                {generatedDescription && (
                                    <div className="bg-white border-2 border-purple-200 rounded-xl p-6 space-y-4 animate-fadeIn">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                                <Sparkles className="w-5 h-5 text-purple-600" />
                                                AI Generated Content
                                            </h4>
                                            <button
                                                type="button"
                                                onClick={handleApplyAIContent}
                                                className="text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition"
                                            >
                                                Apply to Form
                                            </button>
                                        </div>

                                        {/* Description */}
                                        <div className="bg-purple-50 rounded-lg p-4">
                                            <p className="text-sm font-semibold text-purple-900 mb-2">Description</p>
                                            <p className="text-gray-700">{generatedDescription.description}</p>
                                        </div>

                                        {/* Acceptance Criteria */}
                                        {generatedDescription.acceptanceCriteria && (
                                            <div className="bg-blue-50 rounded-lg p-4">
                                                <p className="text-sm font-semibold text-blue-900 mb-2">Acceptance Criteria</p>
                                                <ul className="space-y-1">
                                                    {generatedDescription.acceptanceCriteria.map((criteria, idx) => (
                                                        <li key={idx} className="text-gray-700 text-sm flex items-start gap-2">
                                                            <span className="text-blue-600 mt-1">✓</span>
                                                            <span>{criteria}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Subtasks */}
                                        {generatedDescription.subtasks && generatedDescription.subtasks.length > 0 && (
                                            <div className="bg-green-50 rounded-lg p-4">
                                                <p className="text-sm font-semibold text-green-900 mb-2">Suggested Subtasks</p>
                                                <div className="space-y-2">
                                                    {generatedDescription.subtasks.slice(0, 3).map((subtask, idx) => (
                                                        <div key={idx} className="text-sm">
                                                            <p className="font-medium text-gray-900">{idx + 1}. {subtask.title}</p>
                                                            <p className="text-gray-600 text-xs ml-4">{subtask.description}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Estimated Hours & Skills */}
                                        <div className="grid grid-cols-2 gap-4">
                                            {generatedDescription.estimatedHours && (
                                                <div className="bg-orange-50 rounded-lg p-4">
                                                    <p className="text-sm font-semibold text-orange-900 mb-1">Estimated Effort</p>
                                                    <p className="text-2xl font-bold text-orange-700">{generatedDescription.estimatedHours}h</p>
                                                </div>
                                            )}
                                            {generatedDescription.requiredSkills && (
                                                <div className="bg-purple-50 rounded-lg p-4">
                                                    <p className="text-sm font-semibold text-purple-900 mb-2">Required Skills</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {generatedDescription.requiredSkills.slice(0, 3).map((skill, idx) => (
                                                            <span key={idx} className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded">
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Switch to Manual Entry Hint */}
                                {generatedDescription && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                                        <p className="text-sm text-blue-800 mb-2">
                                            Content generated! Click "Apply to Form" or switch to Manual Entry tab to review and submit.
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Manual Entry Tab */
                            <div className="space-y-4">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Task Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        placeholder="Enter task title"
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
                                        placeholder="Enter task description"
                                        rows="4"
                                    />
                                </div>

                                {/* Project Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Project *
                                    </label>
                                    <select
                                        value={formData.project}
                                        onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        required
                                    >
                                        <option value="">Select a project</option>
                                        {projects.map((project) => (
                                            <option key={project._id} value={project._id}>
                                                {project.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Priority with AI Suggestion */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Priority
                                        </label>
                                        <button
                                            type="button"
                                            onClick={handleGetPrioritySuggestion}
                                            disabled={priorityLoading || !formData.title.trim()}
                                            className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {priorityLoading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Analyzing...
                                                </>
                                            ) : (
                                                <>
                                                    <Brain className="w-4 h-4" />
                                                    AI Suggest
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <select
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="urgent">Urgent</option>
                                    </select>

                                    {/* Priority Suggestion Display */}
                                    {prioritySuggestion && showPrioritySuggestion && (
                                        <div className="mt-3 bg-purple-50 border border-purple-200 rounded-lg p-4 animate-fadeIn">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Brain className="w-4 h-4 text-purple-600" />
                                                    <span className="text-sm font-semibold text-purple-900">AI Recommendation</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setShowPrioritySuggestion(false);
                                                        clearPrioritySuggestion();
                                                    }}
                                                    className="text-gray-400 hover:text-gray-600"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${getPriorityColor(prioritySuggestion.priority.toLowerCase())}`}>
                                                {prioritySuggestion.priority}
                                            </div>
                                            <p className="text-sm text-gray-700">{prioritySuggestion.reasoning}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Due Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Due Date
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.dueDate}
                                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    />
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                {/* Footer - Action Buttons */}
                <div className="border-t p-6 bg-gray-50">
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={loading || !formData.title.trim() || !formData.project}
                            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Task'
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default CreateTaskModal;