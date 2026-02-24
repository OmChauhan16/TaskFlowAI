// import React, { useState } from 'react';
// import { MessageSquare, Send, Sparkles, X, Check } from 'lucide-react';
// import { useAI } from '../../context/AIContext';
// import { useTasks } from '../../context/TaskContext';
// import toast from 'react-hot-toast';

// const QuickAddBar = () => {
//     const [isExpanded, setIsExpanded] = useState(false);
//     const [input, setInput] = useState('');
//     const [showPreview, setShowPreview] = useState(false);

//     const {
//         parsedTask,
//         parseLoading,
//         parseNaturalLanguage,
//         clearParsedTask
//     } = useAI();

//     const { createTask } = useTasks();

//     const handleParse = async () => {
//         if (!input.trim()) return;

//         try {
//             // Get workspace ID from localStorage or context
//             const workspaceId = localStorage.getItem('workspaceId') || 'default';
//             await parseNaturalLanguage(input, workspaceId);
//             setShowPreview(true);
//         } catch (error) {
//             console.error('Parse failed:', error);
//         }
//     };

//     const handleCreate = async () => {
//         if (!parsedTask) return;

//         try {
//             await createTask({
//                 title: parsedTask.title,
//                 description: parsedTask.description,
//                 priority: parsedTask.priority?.toLowerCase(),
//                 dueDate: parsedTask.dueDate,
//                 labels: parsedTask.labels || []
//             });

//             // Reset
//             setInput('');
//             setShowPreview(false);
//             setIsExpanded(false);
//             clearParsedTask();
//             toast.success('Task created!');
//         } catch (error) {
//             console.error('Create failed:', error);
//             toast.error('Failed to create task');
//         }
//     };

//     const handleCancel = () => {
//         setInput('');
//         setShowPreview(false);
//         clearParsedTask();
//     };

//     return (
//         <>
//             {/* Floating Button (when collapsed) */}
//             {!isExpanded && (
//                 <button
//                     onClick={() => setIsExpanded(true)}
//                     className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 z-50 group"
//                     title="Quick Add Task"
//                 >
//                     <MessageSquare className="w-6 h-6" />
//                     <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
//                         AI
//                     </span>
//                 </button>
//             )}

//             {/* Expanded Quick Add Bar */}
//             {isExpanded && (
//                 <div className="fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-200 animate-slideUp">
//                     {/* Header */}
//                     <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 flex items-center justify-between">
//                         <div className="flex items-center gap-2">
//                             <Sparkles className="w-5 h-5 text-white" />
//                             <h3 className="text-white font-semibold">Quick Add Task</h3>
//                         </div>
//                         <button
//                             onClick={() => {
//                                 setIsExpanded(false);
//                                 handleCancel();
//                             }}
//                             className="text-white hover:bg-white/20 p-1 rounded transition"
//                         >
//                             <X className="w-4 h-4" />
//                         </button>
//                     </div>

//                     {/* Content */}
//                     <div className="p-4">
//                         {!showPreview ? (
//                             /* Input Mode */
//                             <div>
//                                 <p className="text-sm text-gray-600 mb-3">
//                                     Describe your task in plain English
//                                 </p>
//                                 <div className="relative">
//                                     <textarea
//                                         value={input}
//                                         onChange={(e) => setInput(e.target.value)}
//                                         onKeyDown={(e) => {
//                                             if (e.key === 'Enter' && e.ctrlKey) {
//                                                 handleParse();
//                                             }
//                                         }}
//                                         placeholder="E.g., Remind me to review the marketing deck by Friday"
//                                         className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
//                                         rows="3"
//                                         disabled={parseLoading}
//                                         autoFocus
//                                     />
//                                     <button
//                                         onClick={handleParse}
//                                         disabled={parseLoading || !input.trim()}
//                                         className="absolute bottom-3 right-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white p-2 rounded-lg transition"
//                                     >
//                                         {parseLoading ? (
//                                             <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                                         ) : (
//                                             <Send className="w-5 h-5" />
//                                         )}
//                                     </button>
//                                 </div>
//                                 <p className="text-xs text-gray-500 mt-2">
//                                     Press Ctrl+Enter to parse
//                                 </p>

//                                 {/* Example prompts */}
//                                 <div className="mt-3">
//                                     <p className="text-xs text-gray-500 mb-2">Try these:</p>
//                                     <div className="space-y-1">
//                                         {[
//                                             "Fix login bug by tomorrow high priority",
//                                             "Schedule meeting with design team next week",
//                                             "Review PRs assigned to me by Friday"
//                                         ].map((example, idx) => (
//                                             <button
//                                                 key={idx}
//                                                 onClick={() => setInput(example)}
//                                                 className="text-xs text-purple-600 hover:text-purple-700 hover:underline block"
//                                             >
//                                                 "{example}"
//                                             </button>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>
//                         ) : (
//                             /* Preview Mode */
//                             parsedTask && (
//                                 <div className="space-y-3">
//                                     <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
//                                         <p className="font-semibold text-gray-900 mb-1">
//                                             {parsedTask.title}
//                                         </p>
//                                         {parsedTask.description && (
//                                             <p className="text-sm text-gray-600">
//                                                 {parsedTask.description}
//                                             </p>
//                                         )}
//                                     </div>

//                                     <div className="grid grid-cols-2 gap-2">
//                                         {parsedTask.priority && (
//                                             <div className="bg-white border rounded-lg p-2">
//                                                 <p className="text-xs text-gray-500">Priority</p>
//                                                 <p className="font-semibold text-sm">
//                                                     {parsedTask.priority}
//                                                 </p>
//                                             </div>
//                                         )}
//                                         {parsedTask.dueDate && (
//                                             <div className="bg-white border rounded-lg p-2">
//                                                 <p className="text-xs text-gray-500">Due Date</p>
//                                                 <p className="font-semibold text-sm">
//                                                     {new Date(parsedTask.dueDate).toLocaleDateString()}
//                                                 </p>
//                                             </div>
//                                         )}
//                                     </div>

//                                     {parsedTask.labels && parsedTask.labels.length > 0 && (
//                                         <div className="flex flex-wrap gap-1">
//                                             {parsedTask.labels.map((label, idx) => (
//                                                 <span
//                                                     key={idx}
//                                                     className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded"
//                                                 >
//                                                     {label}
//                                                 </span>
//                                             ))}
//                                         </div>
//                                     )}

//                                     <div className="flex gap-2 pt-2">
//                                         <button
//                                             onClick={handleCreate}
//                                             className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2"
//                                         >
//                                             <Check className="w-4 h-4" />
//                                             Create Task
//                                         </button>
//                                         <button
//                                             onClick={handleCancel}
//                                             className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
//                                         >
//                                             Edit
//                                         </button>
//                                     </div>
//                                 </div>
//                             )
//                         )}
//                     </div>
//                 </div>
//             )}

//             <style jsx>{`
//                 @keyframes slideUp {
//                     from {
//                         opacity: 0;
//                         transform: translateY(20px);
//                     }
//                     to {
//                         opacity: 1;
//                         transform: translateY(0);
//                     }
//                 }

//                 .animate-slideUp {
//                     animation: slideUp 0.3s ease-out;
//                 }
//             `}</style>
//         </>
//     );
// };

// export default QuickAddBar;




// import React, { useState, useEffect } from 'react';
// import { MessageSquare, Send, Sparkles, X, Check, Folder } from 'lucide-react';
// import { useAI } from '../../context/AIContext';
// import { useTasks } from '../../context/TaskContext';
// import { getProjects } from '../../services/projectService';
// import toast from 'react-hot-toast';

// const QuickAddBar = () => {
//     const [isExpanded, setIsExpanded] = useState(false);
//     const [input, setInput] = useState('');
//     const [showPreview, setShowPreview] = useState(false);
//     const [projects, setProjects] = useState([]);
//     const [selectedProject, setSelectedProject] = useState('');
//     const [loadingProjects, setLoadingProjects] = useState(false);

//     const {
//         parsedTask,
//         parseLoading,
//         parseNaturalLanguage,
//         clearParsedTask
//     } = useAI();

//     const { createTask } = useTasks();

//     // Fetch projects when component mounts
//     useEffect(() => {
//         if (isExpanded) {
//             fetchProjects();
//         }
//     }, [isExpanded]);

//     const fetchProjects = async () => {
//         try {
//             setLoadingProjects(true);
//             const data = await getProjects();
//             setProjects(data.projects || []);

//             // Auto-select first project or get from localStorage
//             const savedProjectId = localStorage.getItem('currentProjectId');
//             if (savedProjectId && data.projects.some(p => p._id === savedProjectId)) {
//                 setSelectedProject(savedProjectId);
//             } else if (data.projects.length > 0) {
//                 setSelectedProject(data.projects[0]._id);
//             }
//         } catch (error) {
//             console.error('Failed to fetch projects:', error);
//             toast.error('Failed to load projects');
//         } finally {
//             setLoadingProjects(false);
//         }
//     };

//     const handleParse = async () => {
//         if (!input.trim()) {
//             toast.error('Please enter a task description');
//             return;
//         }

//         if (!selectedProject) {
//             toast.error('Please select a project');
//             return;
//         }

//         try {
//             // Get workspace ID from localStorage or context
//             const workspaceId = localStorage.getItem('workspaceId') || 'default';
//             await parseNaturalLanguage(input, workspaceId);
//             setShowPreview(true);
//         } catch (error) {
//             console.error('Parse failed:', error);
//         }
//     };

//     const handleCreate = async () => {
//         if (!parsedTask) {
//             toast.error('Please parse the task first');
//             return;
//         }

//         if (!selectedProject) {
//             toast.error('Please select a project');
//             return;
//         }

//         try {
//             await createTask({
//                 title: parsedTask.title,
//                 description: parsedTask.description,
//                 priority: parsedTask.priority?.toLowerCase() || 'medium',
//                 dueDate: parsedTask.dueDate,
//                 project: selectedProject,  // ← Add project here!
//                 labels: parsedTask.labels || []
//             });

//             // Reset
//             setInput('');
//             setShowPreview(false);
//             setIsExpanded(false);
//             clearParsedTask();
//             toast.success('Task created successfully!');
//         } catch (error) {
//             console.error('Create failed:', error);
//             toast.error(error.response?.data?.message || 'Failed to create task');
//         }
//     };

//     const handleCancel = () => {
//         setInput('');
//         setShowPreview(false);
//         clearParsedTask();
//     };

//     const handleClose = () => {
//         setIsExpanded(false);
//         handleCancel();
//     };

//     return (
//         <>
//             {/* Floating Button (when collapsed) */}
//             {!isExpanded && (
//                 <button
//                     onClick={() => setIsExpanded(true)}
//                     className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 z-50 group"
//                     title="Quick Add Task"
//                 >
//                     <MessageSquare className="w-6 h-6" />
//                     <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
//                         AI
//                     </span>
//                 </button>
//             )}

//             {/* Expanded Quick Add Bar */}
//             {isExpanded && (
//                 <div className="fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-200 animate-slideUp">
//                     {/* Header */}
//                     <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 flex items-center justify-between">
//                         <div className="flex items-center gap-2">
//                             <Sparkles className="w-5 h-5 text-white" />
//                             <h3 className="text-white font-semibold">Quick Add Task</h3>
//                         </div>
//                         <button
//                             onClick={handleClose}
//                             className="text-white hover:bg-white/20 p-1 rounded transition"
//                         >
//                             <X className="w-4 h-4" />
//                         </button>
//                     </div>

//                     {/* Content */}
//                     <div className="p-4">
//                         {!showPreview ? (
//                             /* Input Mode */
//                             <div>
//                                 <p className="text-sm text-gray-600 mb-3">
//                                     Describe your task in plain English
//                                 </p>

//                                 {/* Project Selection */}
//                                 <div className="mb-4">
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                                         Project *
//                                     </label>
//                                     <div className="relative">
//                                         <Folder className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                                         <select
//                                             value={selectedProject}
//                                             onChange={(e) => setSelectedProject(e.target.value)}
//                                             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none appearance-none bg-white"
//                                             disabled={loadingProjects}
//                                         >
//                                             <option value="">Select a project</option>
//                                             {projects.map((project) => (
//                                                 <option key={project._id} value={project._id}>
//                                                     {project.name}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                         {loadingProjects && (
//                                             <div className="absolute right-3 top-1/2 -translate-y-1/2">
//                                                 <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
//                                             </div>
//                                         )}
//                                     </div>
//                                     {projects.length === 0 && !loadingProjects && (
//                                         <p className="text-xs text-orange-600 mt-1">
//                                             ⚠️ No projects found. Create a project first.
//                                         </p>
//                                     )}
//                                 </div>

//                                 {/* Task Input */}
//                                 <div className="relative">
//                                     <textarea
//                                         value={input}
//                                         onChange={(e) => setInput(e.target.value)}
//                                         onKeyDown={(e) => {
//                                             if (e.key === 'Enter' && e.ctrlKey) {
//                                                 handleParse();
//                                             }
//                                         }}
//                                         placeholder="E.g., Remind me to review the marketing deck by Friday"
//                                         className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
//                                         rows="3"
//                                         disabled={parseLoading || !selectedProject}
//                                         autoFocus={selectedProject !== ''}
//                                     />
//                                     <button
//                                         onClick={handleParse}
//                                         disabled={parseLoading || !input.trim() || !selectedProject}
//                                         className="absolute bottom-3 right-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white p-2 rounded-lg transition disabled:cursor-not-allowed"
//                                         title={!selectedProject ? 'Select a project first' : 'Parse task'}
//                                     >
//                                         {parseLoading ? (
//                                             <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                                         ) : (
//                                             <Send className="w-5 h-5" />
//                                         )}
//                                     </button>
//                                 </div>
//                                 <p className="text-xs text-gray-500 mt-2">
//                                     Press Ctrl+Enter to parse
//                                 </p>

//                                 {/* Example prompts */}
//                                 <div className="mt-3">
//                                     <p className="text-xs text-gray-500 mb-2">Try these:</p>
//                                     <div className="space-y-1">
//                                         {[
//                                             "Fix login bug by tomorrow high priority",
//                                             "Schedule meeting with design team next week",
//                                             "Review PRs assigned to me by Friday"
//                                         ].map((example, idx) => (
//                                             <button
//                                                 key={idx}
//                                                 onClick={() => setInput(example)}
//                                                 disabled={!selectedProject}
//                                                 className="text-xs text-purple-600 hover:text-purple-700 hover:underline block disabled:text-gray-400 disabled:cursor-not-allowed"
//                                             >
//                                                 "{example}"
//                                             </button>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>
//                         ) : (
//                             /* Preview Mode */
//                             parsedTask && (
//                                 <div className="space-y-3">
//                                     {/* Selected Project Display */}
//                                     <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 flex items-center gap-2">
//                                         <Folder className="w-4 h-4 text-purple-600" />
//                                         <div className="flex-1">
//                                             <p className="text-xs text-purple-600 font-medium">Project</p>
//                                             <p className="text-sm font-semibold text-purple-900">
//                                                 {projects.find(p => p._id === selectedProject)?.name || 'Unknown'}
//                                             </p>
//                                         </div>
//                                     </div>

//                                     {/* Task Preview */}
//                                     <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
//                                         <p className="font-semibold text-gray-900 mb-1">
//                                             {parsedTask.title}
//                                         </p>
//                                         {parsedTask.description && (
//                                             <p className="text-sm text-gray-600">
//                                                 {parsedTask.description}
//                                             </p>
//                                         )}
//                                     </div>

//                                     <div className="grid grid-cols-2 gap-2">
//                                         {parsedTask.priority && (
//                                             <div className="bg-white border rounded-lg p-2">
//                                                 <p className="text-xs text-gray-500">Priority</p>
//                                                 <p className="font-semibold text-sm capitalize">
//                                                     {parsedTask.priority}
//                                                 </p>
//                                             </div>
//                                         )}
//                                         {parsedTask.dueDate && (
//                                             <div className="bg-white border rounded-lg p-2">
//                                                 <p className="text-xs text-gray-500">Due Date</p>
//                                                 <p className="font-semibold text-sm">
//                                                     {new Date(parsedTask.dueDate).toLocaleDateString()}
//                                                 </p>
//                                             </div>
//                                         )}
//                                     </div>

//                                     {parsedTask.labels && parsedTask.labels.length > 0 && (
//                                         <div className="flex flex-wrap gap-1">
//                                             {parsedTask.labels.map((label, idx) => (
//                                                 <span
//                                                     key={idx}
//                                                     className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded"
//                                                 >
//                                                     {label}
//                                                 </span>
//                                             ))}
//                                         </div>
//                                     )}

//                                     <div className="flex gap-2 pt-2">
//                                         <button
//                                             onClick={handleCreate}
//                                             className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2"
//                                         >
//                                             <Check className="w-4 h-4" />
//                                             Create Task
//                                         </button>
//                                         <button
//                                             onClick={handleCancel}
//                                             className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
//                                         >
//                                             Edit
//                                         </button>
//                                     </div>
//                                 </div>
//                             )
//                         )}
//                     </div>
//                 </div>
//             )}

//             <style jsx>{`
//                 @keyframes slideUp {
//                     from {
//                         opacity: 0;
//                         transform: translateY(20px);
//                     }
//                     to {
//                         opacity: 1;
//                         transform: translateY(0);
//                     }
//                 }

//                 .animate-slideUp {
//                     animation: slideUp 0.3s ease-out;
//                 }
//             `}</style>
//         </>
//     );
// };

// export default QuickAddBar;


import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Sparkles, X, Check, Folder } from 'lucide-react';
import { useAI } from '../../context/AIContext';
import { useTasks } from '../../context/TaskContext';
import { getProjects } from '../../services/projectService';
import toast from 'react-hot-toast';

const QuickAddBar = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [input, setInput] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [loadingProjects, setLoadingProjects] = useState(false);
    const [creatingTask, setCreatingTask] = useState(false); 

    const {
        parsedTask,
        parseLoading,
        parseNaturalLanguage,
        clearParsedTask
    } = useAI();

    const { createTask } = useTasks();

    // Fetch projects when component mounts
    useEffect(() => {
        if (isExpanded) {
            fetchProjects();
        }
    }, [isExpanded]);

    const fetchProjects = async () => {
        try {
            setLoadingProjects(true);
            const data = await getProjects();
            setProjects(data.projects || []);

            // Auto-select first project or get from localStorage
            const savedProjectId = localStorage.getItem('currentProjectId');
            if (savedProjectId && data.projects.some(p => p._id === savedProjectId)) {
                setSelectedProject(savedProjectId);
            } else if (data.projects.length > 0) {
                setSelectedProject(data.projects[0]._id);
            }
        } catch (error) {
            console.error('Failed to fetch projects:', error);
            toast.error('Failed to load projects');
        } finally {
            setLoadingProjects(false);
        }
    };

    const handleParse = async () => {
        if (!input.trim()) {
            toast.error('Please enter a task description');
            return;
        }

        if (!selectedProject) {
            toast.error('Please select a project');
            return;
        }

        try {
            // Get workspace ID from localStorage or context
            const workspaceId = localStorage.getItem('workspaceId') || 'default';
            await parseNaturalLanguage(input, workspaceId);
            setShowPreview(true);
        } catch (error) {
            console.error('Parse failed:', error);
        }
    };

    const handleCreate = async () => {
        if (!parsedTask) {
            toast.error('Please parse the task first');
            return;
        }

        if (!selectedProject) {
            toast.error('Please select a project');
            return;
        }

        try {
            setCreatingTask(true);
            await createTask({
                title: parsedTask.title,
                description: parsedTask.description,
                priority: parsedTask.priority?.toLowerCase() || 'medium',
                dueDate: parsedTask.dueDate,
                project: selectedProject,
                labels: parsedTask.labels || []
            });

            // Show success toast first
            toast.success('✅ Task created successfully!', {
                duration: 3000,
                position: 'top-center'
            });

            // Reset after delay to ensure toast is visible
            setTimeout(() => {
                setInput('');
                setShowPreview(false);
                setIsExpanded(false);
                clearParsedTask();
                setCreatingTask(false);
            }, 800);
        } catch (error) {
            console.error('Create failed:', error);
            setCreatingTask(false);
            toast.error(error.response?.data?.message || 'Failed to create task', {
                duration: 4000
            });
        }
    };

    const handleCancel = () => {
        setInput('');
        setShowPreview(false);
        clearParsedTask();
    };

    const handleClose = () => {
        setIsExpanded(false);
        handleCancel();
    };

    return (
        <>
            {/* Floating Button (when collapsed) */}
            {!isExpanded && (
                <button
                    onClick={() => setIsExpanded(true)}
                    className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 z-50 group"
                    title="Quick Add Task"
                >
                    <MessageSquare className="w-6 h-6" />
                    <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        AI
                    </span>
                </button>
            )}

            {/* Expanded Quick Add Bar */}
            {isExpanded && (
                <div className="fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-200 animate-slideUp">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-white" />
                            <h3 className="text-white font-semibold">Quick Add Task</h3>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-white hover:bg-white/20 p-1 rounded transition"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                        {!showPreview ? (
                            /* Input Mode */
                            <div>
                                <p className="text-sm text-gray-600 mb-3">
                                    Describe your task in plain English
                                </p>

                                {/* Project Selection */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Project *
                                    </label>
                                    <div className="relative">
                                        <Folder className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <select
                                            value={selectedProject}
                                            onChange={(e) => setSelectedProject(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none appearance-none bg-white"
                                            disabled={loadingProjects}
                                        >
                                            <option value="">Select a project</option>
                                            {projects.map((project) => (
                                                <option key={project._id} value={project._id}>
                                                    {project.name}
                                                </option>
                                            ))}
                                        </select>
                                        {loadingProjects && (
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                        )}
                                    </div>
                                    {projects.length === 0 && !loadingProjects && (
                                        <p className="text-xs text-orange-600 mt-1">
                                            ⚠️ No projects found. Create a project first.
                                        </p>
                                    )}
                                </div>

                                {/* Task Input */}
                                <div className="relative">
                                    <textarea
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && e.ctrlKey) {
                                                handleParse();
                                            }
                                        }}
                                        placeholder="E.g., Remind me to review the marketing deck by Friday"
                                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                                        rows="3"
                                        disabled={parseLoading || !selectedProject}
                                        autoFocus={selectedProject !== ''}
                                    />
                                    <button
                                        onClick={handleParse}
                                        disabled={parseLoading || !input.trim() || !selectedProject}
                                        className="absolute bottom-3 right-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white p-2 rounded-lg transition disabled:cursor-not-allowed"
                                        title={!selectedProject ? 'Select a project first' : 'Parse task'}
                                    >
                                        {parseLoading ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <Send className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Press Ctrl+Enter to parse
                                </p>

                                {/* Example prompts */}
                                <div className="mt-3">
                                    <p className="text-xs text-gray-500 mb-2">Try these:</p>
                                    <div className="space-y-1">
                                        {[
                                            "Fix login bug by tomorrow high priority",
                                            "Schedule meeting with design team next week",
                                            "Review PRs assigned to me by Friday"
                                        ].map((example, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setInput(example)}
                                                disabled={!selectedProject}
                                                className="text-xs text-purple-600 hover:text-purple-700 hover:underline block disabled:text-gray-400 disabled:cursor-not-allowed"
                                            >
                                                "{example}"
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Preview Mode */
                            parsedTask && (
                                <div className="space-y-3">
                                    {/* Selected Project Display */}
                                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 flex items-center gap-2">
                                        <Folder className="w-4 h-4 text-purple-600" />
                                        <div className="flex-1">
                                            <p className="text-xs text-purple-600 font-medium">Project</p>
                                            <p className="text-sm font-semibold text-purple-900">
                                                {projects.find(p => p._id === selectedProject)?.name || 'Unknown'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Task Preview */}
                                    <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                                        <p className="font-semibold text-gray-900 mb-1">
                                            {parsedTask.title}
                                        </p>
                                        {parsedTask.description && (
                                            <p className="text-sm text-gray-600">
                                                {parsedTask.description}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        {parsedTask.priority && (
                                            <div className="bg-white border rounded-lg p-2">
                                                <p className="text-xs text-gray-500">Priority</p>
                                                <p className="font-semibold text-sm capitalize">
                                                    {parsedTask.priority}
                                                </p>
                                            </div>
                                        )}
                                        {parsedTask.dueDate && (
                                            <div className="bg-white border rounded-lg p-2">
                                                <p className="text-xs text-gray-500">Due Date</p>
                                                <p className="font-semibold text-sm">
                                                    {new Date(parsedTask.dueDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {parsedTask.labels && parsedTask.labels.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {parsedTask.labels.map((label, idx) => (
                                                <span
                                                    key={idx}
                                                    className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded"
                                                >
                                                    {label}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex gap-2 pt-2">
                                        <button
                                            onClick={handleCreate}
                                            disabled={creatingTask}
                                            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2"
                                        >
                                            {creatingTask ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Creating...
                                                </>
                                            ) : (
                                                <>
                                                    <Check className="w-4 h-4" />
                                                    Create Task
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            disabled={creatingTask}
                                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-slideUp {
                    animation: slideUp 0.3s ease-out;
                }
            `}</style>
        </>
    );
};

export default QuickAddBar;