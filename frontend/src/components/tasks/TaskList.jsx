// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// // import { getProjects, deleteProject } from '../../services/projectService';
// import { getTasks } from '../../services/taskService';
// // import ProjectCard from './ProjectCard';
// import TaskCard from './TaskCard';
// // import CreateProjectModal from './CreateProjectModal';
// import toast from 'react-hot-toast';
// import { Plus } from 'lucide-react';
// import Header from '../Header';

// const TaskList = () => {
//     const navigate = useNavigate();
//     const [tasks, setTasks] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [showCreateModal, setShowCreateModal] = useState(false);

//     useEffect(() => {
//         fetchTasks();
//     }, []);

//     const fetchTasks = async () => {
//         try {
//             setLoading(true);
//             const data = await getTasks();
//             setTasks(data.tasks);
//         } catch (error) {
//             toast.error('Failed to fetch projects');
//             console.error(error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleProjectCreated = (newProject) => {
//         setProjects([newProject, ...projects]);
//         setShowCreateModal(false);
//         toast.success('Project created successfully!');
//     };

//     const handleDeleteProject = async (projectId) => {
//         if (!window.confirm('Are you sure you want to delete this project?')) {
//             return;
//         }

//         try {
//             await deleteProject(projectId);
//             setProjects(projects.filter(p => p._id !== projectId));
//             toast.success('Project deleted');
//         } catch (error) {
//             toast.error('Failed to delete project');
//             console.error(error);
//         }
//     };

//     const handleProjectClick = (projectId) => {
//         navigate(`/projects/${projectId}`);
//     };

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center h-64">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//             </div>
//         );
//     }

//     return (
//         <div>
//             <Header />

//             <div className="max-w-7xl mx-auto px-4 py-8">
//                 <div className="flex items-center justify-between mb-8">
//                     <div>
//                         <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
//                         <p className="text-gray-600 mt-2">{projects.length} total projects</p>
//                     </div>
//                     <button
//                         onClick={() => setShowCreateModal(true)}
//                         className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//                     >
//                         <Plus className="w-5 h-5" />
//                         New Project
//                     </button>
//                 </div>

//                 {projects.length === 0 ? (
//                     <div className="text-center py-12">
//                         <div className="text-6xl mb-4">📁</div>
//                         <h3 className="text-xl font-semibold text-gray-700 mb-2">No projects yet</h3>
//                         <p className="text-gray-500 mb-4">Create your first project to get started</p>
//                         <button
//                             onClick={() => setShowCreateModal(true)}
//                             className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//                         >
//                             Create Project
//                         </button>
//                     </div>
//                 ) : (
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                         {tasks.map((task) => (
//                             <TaskCard
//                                 key={task._id}
//                                 task={task}
//                                 onClick={() => handleProjectClick(project._id)}
//                                 onDelete={() => handleDeleteProject(project._id)}
//                             />
//                         ))}
//                     </div>
//                 )}

//                 {showCreateModal && (
//                     <CreateProjectModal
//                         onClose={() => setShowCreateModal(false)}
//                         onProjectCreated={handleProjectCreated}
//                     />
//                 )}
//             </div>
//         </div>
//     );
// };

// export default TaskList;


import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTasks, deleteTask } from '../../services/taskService';
import TaskCard from './TaskCard';
import CreateTaskModal from './CreateTaskModal';
import TaskDetailModal from './TaskDetailModal';
import toast from 'react-hot-toast';
import { Plus, Filter } from 'lucide-react';
import Header from '../Header';

const TaskList = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState(null);

    // Filter states
    const [filters, setFilters] = useState({
        status: '',
        priority: '',
        search: ''
    });

    useEffect(() => {
        fetchTasks();
    }, [filters]);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            // Build query params from filters
            const params = {};
            if (filters.status) params.status = filters.status;
            if (filters.priority) params.priority = filters.priority;
            if (filters.search) params.search = filters.search;

            const data = await getTasks(params);
            setTasks(data);
        } catch (error) {
            toast.error('Failed to fetch tasks');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleTaskCreated = (newTask) => {
        setTasks([newTask, ...tasks]);
        setShowCreateModal(false);
        toast.success('Task created successfully!');
    };

    const handleTaskUpdated = (updatedTask) => {
        setTasks(tasks.map(task =>
            task._id === updatedTask._id ? updatedTask : task
        ));
        toast.success('Task updated!');
    };

    const handleDeleteTask = async (taskId) => {
        if (!window.confirm('Are you sure you want to delete this task?')) {
            return;
        }

        try {
            await deleteTask(taskId);
            setTasks(tasks.filter(t => t._id !== taskId));
            toast.success('Task deleted');
        } catch (error) {
            toast.error('Failed to delete task');
            console.error(error);
        }
    };

    const handleTaskClick = (taskId) => {
        setSelectedTaskId(taskId);
    };

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            status: '',
            priority: '',
            search: ''
        });
    };

    // Group tasks by status for better visualization
    const groupedTasks = {
        todo: tasks.filter(t => t.status === 'todo'),
        'in-progress': tasks.filter(t => t.status === 'in-progress'),
        review: tasks.filter(t => t.status === 'review'),
        done: tasks.filter(t => t.status === 'done')
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                {/* <Header /> */}
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                {/* <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">All Tasks</h1>
                        <p className="text-gray-600 mt-2">{tasks.length} total tasks</p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        <Plus className="w-5 h-5" />
                        New Task
                    </button>
                </div> */}

                {/* Filters */}
                <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-gray-600" />
                            <span className="font-medium text-gray-700">Filters:</span>
                        </div>

                        {/* Search */}
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />

                        {/* Status Filter */}
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ml-auto"
                        >
                            <option value="">All Status</option>
                            <option value="todo">To Do</option>
                            <option value="in-progress">In Progress</option>
                            <option value="review">Review</option>
                            <option value="done">Done</option>
                        </select>

                        {/* Priority Filter */}
                        <select
                            value={filters.priority}
                            onChange={(e) => handleFilterChange('priority', e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        >
                            <option value="">All Priority</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>

                        {/* Clear Filters */}
                        {(filters.status || filters.priority || filters.search) && (
                            <button
                                onClick={clearFilters}
                                className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                </div>

                {/* Tasks Display */}
                {tasks.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📝</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            {filters.status || filters.priority || filters.search
                                ? 'No tasks match your filters'
                                : 'No tasks yet'}
                        </h3>
                        <p className="text-gray-500 mb-4">
                            {filters.status || filters.priority || filters.search
                                ? 'Try adjusting your filters'
                                : 'Create your first task to get started'}
                        </p>
                        {!(filters.status || filters.priority || filters.search) && (
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Create Task
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Grouped View */}
                        <div className="space-y-8">
                            {/* To Do */}
                            {groupedTasks.todo.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                                        <h2 className="text-xl font-bold text-gray-900">To Do</h2>
                                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm">
                                            {groupedTasks.todo.length}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {groupedTasks.todo.map((task) => (
                                            <TaskCard
                                                key={task._id}
                                                task={task}
                                                onClick={() => handleTaskClick(task._id)}
                                                onDelete={() => handleDeleteTask(task._id)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* In Progress */}
                            {groupedTasks['in-progress'].length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                        <h2 className="text-xl font-bold text-gray-900">In Progress</h2>
                                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm">
                                            {groupedTasks['in-progress'].length}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {groupedTasks['in-progress'].map((task) => (
                                            <TaskCard
                                                key={task._id}
                                                task={task}
                                                onClick={() => handleTaskClick(task._id)}
                                                onDelete={() => handleDeleteTask(task._id)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Review */}
                            {groupedTasks.review.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                        <h2 className="text-xl font-bold text-gray-900">Review</h2>
                                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-sm">
                                            {groupedTasks.review.length}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {groupedTasks.review.map((task) => (
                                            <TaskCard
                                                key={task._id}
                                                task={task}
                                                onClick={() => handleTaskClick(task._id)}
                                                onDelete={() => handleDeleteTask(task._id)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Done */}
                            {groupedTasks.done.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <h2 className="text-xl font-bold text-gray-900">Done</h2>
                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm">
                                            {groupedTasks.done.length}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {groupedTasks.done.map((task) => (
                                            <TaskCard
                                                key={task._id}
                                                task={task}
                                                onClick={() => handleTaskClick(task._id)}
                                                onDelete={() => handleDeleteTask(task._id)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Create Task Modal */}
                {showCreateModal && (
                    <CreateTaskModal
                        onClose={() => setShowCreateModal(false)}
                        onTaskCreated={handleTaskCreated}
                    />
                )}

                {/* Task Detail Modal */}
                {selectedTaskId && (
                    <TaskDetailModal
                        taskId={selectedTaskId}
                        onClose={() => setSelectedTaskId(null)}
                        onTaskUpdated={handleTaskUpdated}
                    />
                )}
            </div>
        </div>
    );
};

export default TaskList;