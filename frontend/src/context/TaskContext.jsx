// import { createContext, useState, useEffect, useContext } from 'react';
// import * as taskService from '../services/taskService';
// import { AuthContext } from './AuthContext';

// // Create the context
// export const TaskContext = createContext();

// // Custom hook to use the TaskContext
// export const useTasks = () => {
//     const context = useContext(TaskContext);
//     if (!context) {
//         throw new Error('useTasks must be used within a TaskProvider');
//     }
//     return context;
// };

// // Helper function to get priority color
// const getPriorityColor = (priority) => {
//     const colors = {
//         low: 'bg-gray-100 text-gray-700',
//         medium: 'bg-yellow-100 text-yellow-700',
//         high: 'bg-orange-100 text-orange-700',
//         urgent: 'bg-red-100 text-red-700'
//     };
//     return colors[priority?.toLowerCase()] || 'bg-gray-100 text-gray-700';
// };

// // Helper function to organize tasks into columns
// const organizeTasks = (tasks) => {
//     const columns = {
//         todo: {
//             id: 'todo',
//             title: 'To Do',
//             color: 'gray',
//             bgColor: 'bg-gray-100',
//             dotColor: 'bg-gray-400',
//             tasks: []
//         },
//         inProgress: {
//             id: 'inProgress',
//             title: 'In Progress',
//             color: 'blue',
//             bgColor: 'bg-blue-50',
//             dotColor: 'bg-blue-500',
//             tasks: []
//         },
//         review: {
//             id: 'review',
//             title: 'Review',
//             color: 'purple',
//             bgColor: 'bg-purple-50',
//             dotColor: 'bg-purple-500',
//             tasks: []
//         },
//         done: {
//             id: 'done',
//             title: 'Done',
//             color: 'green',
//             bgColor: 'bg-green-50',
//             dotColor: 'bg-green-500',
//             tasks: []
//         }
//     };

//     // Organize tasks by status
//     tasks.forEach(task => {
//         const formattedTask = {
//             id: task._id || task.id,
//             title: task.title,
//             description: task.description,
//             priority: task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1),
//             priorityColor: getPriorityColor(task.priority),
//             assignee: task.assignee?.name || '👤',
//             dueDate: task.dueDate
//                 ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
//                 : '',
//             tag: task.labels?.[0] || task.category || '',
//             tagColor: 'bg-blue-100 text-blue-700',
//             progress: task.progress,
//             completed: task.status === 'done',
//             status: task.status
//         };

//         // Map API status to column key
//         const statusMap = {
//             'todo': 'todo',
//             'in-progress': 'inProgress',
//             'inprogress': 'inProgress',
//             'in_progress': 'inProgress',
//             'review': 'review',
//             'done': 'done',
//             'completed': 'done'
//         };

//         const columnKey = statusMap[task.status?.toLowerCase()] || 'todo';
//         columns[columnKey].tasks.push(formattedTask);
//     });

//     return columns;
// };

// // Provider component
// export const TaskProvider = ({ children }) => {
//     const { user, loading: authLoading } = useContext(AuthContext);
//     const [columns, setColumns] = useState({
//         todo: {
//             id: 'todo',
//             title: 'To Do',
//             color: 'gray',
//             bgColor: 'bg-gray-100',
//             dotColor: 'bg-gray-400',
//             tasks: []
//         },
//         inProgress: {
//             id: 'inProgress',
//             title: 'In Progress',
//             color: 'blue',
//             bgColor: 'bg-blue-50',
//             dotColor: 'bg-blue-500',
//             tasks: []
//         },
//         review: {
//             id: 'review',
//             title: 'Review',
//             color: 'purple',
//             bgColor: 'bg-purple-50',
//             dotColor: 'bg-purple-500',
//             tasks: []
//         },
//         done: {
//             id: 'done',
//             title: 'Done',
//             color: 'green',
//             bgColor: 'bg-green-50',
//             dotColor: 'bg-green-500',
//             tasks: []
//         }
//     });

//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     // Fetch all tasks from API
//     const fetchTasks = async (params = {}) => {
//         try {
//             setLoading(true);
//             setError(null);
//             const tasks = await taskService.getTasks(params);
//             const organizedColumns = organizeTasks(tasks);
//             setColumns(organizedColumns);
//         } catch (err) {
//             setError(err.response?.data?.message || 'Failed to fetch tasks');
//             console.error('Error fetching tasks:', err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Move task between columns (optimistic update)
//     const moveTask = (taskId, sourceColumn, targetColumn) => {
//         setColumns(prev => {
//             const newColumns = { ...prev };

//             // Find and remove task from source column
//             const taskIndex = newColumns[sourceColumn].tasks.findIndex(
//                 task => task.id === taskId
//             );

//             if (taskIndex !== -1) {
//                 const [task] = newColumns[sourceColumn].tasks.splice(taskIndex, 1);

//                 // Update task status based on target column
//                 const columnStatusMap = {
//                     'todo': 'todo',
//                     'inProgress': 'in-progress',
//                     'review': 'review',
//                     'done': 'done'
//                 };

//                 task.status = columnStatusMap[targetColumn];
//                 task.completed = targetColumn === 'done';

//                 // Add to target column
//                 newColumns[targetColumn].tasks.push(task);
//             }

//             return newColumns;
//         });
//     };

//     // Update task status in backend
//     const updateTaskStatus = async (taskId, status) => {
//         try {
//             await taskService.updateTaskStatus(taskId, status);
//         } catch (err) {
//             setError(err.response?.data?.message || 'Failed to update task status');
//             console.error('Error updating task status:', err);
//             // Optionally: revert optimistic update here
//             throw err;
//         }
//     };

//     // Add new task to columns
//     const addTaskToColumn = (newTask) => {
//         setColumns(prev => {
//             const formattedTask = {
//                 id: newTask._id || newTask.id,
//                 title: newTask.title,
//                 description: newTask.description,
//                 priority: newTask.priority?.charAt(0).toUpperCase() + newTask.priority?.slice(1),
//                 priorityColor: getPriorityColor(newTask.priority),
//                 assignee: '👤',
//                 dueDate: newTask.dueDate
//                     ? new Date(newTask.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
//                     : '',
//                 tag: newTask.labels?.[0] || '',
//                 tagColor: 'bg-blue-100 text-blue-700',
//                 status: 'todo',
//                 completed: false
//             };

//             return {
//                 ...prev,
//                 todo: {
//                     ...prev.todo,
//                     tasks: [...prev.todo.tasks, formattedTask]
//                 }
//             };
//         });
//     };

//     // Create new task
//     const createTask = async (taskData) => {
//         try {
//             const newTask = await taskService.createTask(taskData);
//             addTaskToColumn(newTask);
//             return newTask;
//         } catch (err) {
//             setError(err.response?.data?.message || 'Failed to create task');
//             console.error('Error creating task:', err);
//             throw err;
//         }
//     };

//     // Update task
//     const updateTask = async (taskId, updates) => {
//         try {
//             const updatedTask = await taskService.updateTask(taskId, updates);
//             // Refresh tasks to get updated data
//             await fetchTasks();
//             return updatedTask;
//         } catch (err) {
//             setError(err.response?.data?.message || 'Failed to update task');
//             console.error('Error updating task:', err);
//             throw err;
//         }
//     };

//     // Delete task
//     const deleteTask = async (taskId) => {
//         try {
//             await taskService.deleteTask(taskId);
//             // Remove task from columns
//             setColumns(prev => {
//                 const newColumns = { ...prev };
//                 Object.keys(newColumns).forEach(columnKey => {
//                     newColumns[columnKey].tasks = newColumns[columnKey].tasks.filter(
//                         task => task.id !== taskId
//                     );
//                 });
//                 return newColumns;
//             });
//         } catch (err) {
//             setError(err.response?.data?.message || 'Failed to delete task');
//             console.error('Error deleting task:', err);
//             throw err;
//         }
//     };

//     // Fetch tasks on mount (only if user is authenticated)
//     useEffect(() => {
//         // Only fetch tasks if:
//         // 1. Auth context has finished loading
//         // 2. User is authenticated
//         if (!authLoading && user) {
//             fetchTasks();
//         }
//     }, [authLoading, user]);

//     const value = {
//         columns,
//         loading,
//         error,
//         fetchTasks,
//         moveTask,
//         updateTaskStatus,
//         addTaskToColumn,
//         createTask,
//         updateTask,
//         deleteTask,
//         setError
//     };

//     return (
//         <TaskContext.Provider value={value}>
//             {children}
//         </TaskContext.Provider>
//     );
// };

// export default TaskProvider;




import { createContext, useState, useEffect, useContext } from 'react';
import * as taskService from '../services/taskService';
import { AuthContext } from './AuthContext';

export const TaskContext = createContext();

export const useTasks = () => {
    const context = useContext(TaskContext);
    if (!context) throw new Error('useTasks must be used within a TaskProvider');
    return context;
};

const getPriorityColor = (priority) => {
    const colors = {
        low: 'bg-gray-100 text-gray-700',
        medium: 'bg-yellow-100 text-yellow-700',
        high: 'bg-orange-100 text-orange-700',
        urgent: 'bg-red-100 text-red-700'
    };
    return colors[priority?.toLowerCase()] || 'bg-gray-100 text-gray-700';
};

// Reusable task formatter — used by socket listeners too
export const formatTask = (task) => ({
    id: task._id || task.id,
    title: task.title,
    description: task.description,
    priority: task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1),
    priorityColor: getPriorityColor(task.priority),
    assignee: task.assignees?.[0]?.name || task.assignee?.name || '👤',
    dueDate: task.dueDate
        ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : '',
    tag: task.labels?.[0] || task.category || '',
    tagColor: 'bg-blue-100 text-blue-700',
    progress: task.progress,
    completed: task.status === 'done',
    status: task.status
});

const statusToColumn = {
    'todo': 'todo',
    'in-progress': 'inProgress',
    'inprogress': 'inProgress',
    'in_progress': 'inProgress',
    'review': 'review',
    'done': 'done',
    'completed': 'done'
};

const columnToStatus = {
    'todo': 'todo',
    'inProgress': 'in-progress',
    'review': 'review',
    'done': 'done'
};

const emptyColumns = {
    todo: {
        id: 'todo', title: 'To Do',
        bgColor: 'bg-gray-100', dotColor: 'bg-gray-400', tasks: []
    },
    inProgress: {
        id: 'inProgress', title: 'In Progress',
        bgColor: 'bg-blue-50', dotColor: 'bg-blue-500', tasks: []
    },
    review: {
        id: 'review', title: 'Review',
        bgColor: 'bg-purple-50', dotColor: 'bg-purple-500', tasks: []
    },
    done: {
        id: 'done', title: 'Done',
        bgColor: 'bg-green-50', dotColor: 'bg-green-500', tasks: []
    }
};

const organizeTasks = (tasks) => {
    // Deep clone empty columns structure
    const columns = JSON.parse(JSON.stringify(emptyColumns));

    tasks.forEach(task => {
        const columnKey = statusToColumn[task.status?.toLowerCase()] || 'todo';
        columns[columnKey].tasks.push(formatTask(task));
    });

    return columns;
};

export const TaskProvider = ({ children }) => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const [columns, setColumns] = useState(emptyColumns);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ── Fetch tasks ───────────────────────────────────────────────────────────
    const fetchTasks = async (params = {}) => {
        try {
            setLoading(true);
            setError(null);
            const tasks = await taskService.getTasks(params);
            setColumns(organizeTasks(tasks));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch tasks');
            console.error('Error fetching tasks:', err);
        } finally {
            setLoading(false);
        }
    };

    // ── Move task (optimistic — no splice, proper immutable update) ───────────
    // const moveTask = (taskId, sourceColumnId, targetColumnId) => {
    //     if (sourceColumnId === targetColumnId) return;

    //     setColumns(prev => {
    //         // Find the task
    //         const task = prev[sourceColumnId]?.tasks.find(t => t.id === taskId);
    //         if (!task) return prev;

    //         const updatedTask = {
    //             ...task,
    //             status: columnToStatus[targetColumnId],
    //             completed: targetColumnId === 'done',
    //         };

    //         return {
    //             ...prev,
    //             // Remove from source — filter instead of splice (immutable)
    //             [sourceColumnId]: {
    //                 ...prev[sourceColumnId],
    //                 tasks: prev[sourceColumnId].tasks.filter(t => t.id !== taskId),
    //             },
    //             // Add to target
    //             [targetColumnId]: {
    //                 ...prev[targetColumnId],
    //                 tasks: [...prev[targetColumnId].tasks, updatedTask],
    //             },
    //         };
    //     });
    // };
    const moveTask = (taskId, sourceColumnId, targetColumnId) => {
        if (sourceColumnId === targetColumnId) return;

        console.log('🚀 moveTask START', { taskId, sourceColumnId, targetColumnId });

        setColumns(prev => {
            const task = prev[sourceColumnId]?.tasks.find(t => t._id === taskId);
            console.log('🔍 task found:', task?.title);

            if (!task) {
                console.log('❌ NOT FOUND');
                return prev;
            }

            const newState = {
                ...prev,
                [sourceColumnId]: {
                    ...prev[sourceColumnId],
                    tasks: prev[sourceColumnId].tasks.filter(t => t.id !== taskId),
                },
                [targetColumnId]: {
                    ...prev[targetColumnId],
                    tasks: [...prev[targetColumnId].tasks, { ...task }],
                },
            };

            console.log('✅ new state source tasks:', newState[sourceColumnId].tasks.length);
            console.log('✅ new state target tasks:', newState[targetColumnId].tasks.length);
            return newState;
        });
    };

    // ── Update task status in backend ─────────────────────────────────────────
    // const updateTaskStatus = async (taskId, status) => {
    //     try {
    //         await taskService.updateTaskStatus(taskId, status);
    //         // No need to update columns here — moveTask already did it optimistically
    //         // Socket will handle syncing OTHER users
    //     } catch (err) {
    //         setError(err.response?.data?.message || 'Failed to update task status');
    //         console.error('Error updating task status:', err);
    //         throw err; // let Kanban catch this to revert
    //     }
    // };
    // ✅ Fixed — updates columns immediately from API response
    const updateTaskStatus = async (taskId, newStatus) => {
        try {
            console.log('🔄 Calling updateTaskStatus:', taskId, newStatus);

            const { task } = await taskService.updateTaskStatus(taskId, newStatus);
            console.log('✅ API response:', task);

            const statusToColumn = {
                'todo': 'todo',
                'in-progress': 'inProgress',
                'review': 'review',
                'done': 'done',
            };

            setColumns(prev => {
                const next = {};
                Object.keys(prev).forEach(colId => {
                    next[colId] = {
                        ...prev[colId],
                        tasks: prev[colId].tasks.filter(
                            t => (t.id || t._id) !== taskId
                        ),
                    };
                });

                const targetCol = statusToColumn[newStatus] || 'todo';
                if (next[targetCol]) {
                    next[targetCol] = {
                        ...next[targetCol],
                        tasks: [...next[targetCol].tasks, task],
                    };
                }

                return next;
            });
        } catch (error) {
            console.error('Failed to update task status:', error);
            throw error;
        }
    };

    // ── Socket: apply incoming task update from another user ──────────────────
    // Called from Kanban.jsx socket listener
    const applySocketTaskUpdate = (rawTask) => {
        const formatted = formatTask(rawTask);
        const targetColId = statusToColumn[rawTask.status?.toLowerCase()] || 'todo';

        setColumns(prev => {
            const next = { ...prev };

            // Remove task from all columns
            Object.keys(next).forEach(colId => {
                next[colId] = {
                    ...next[colId],
                    tasks: next[colId].tasks.filter(t => t.id !== formatted.id),
                };
            });

            // Insert into correct column
            next[targetColId] = {
                ...next[targetColId],
                tasks: [...next[targetColId].tasks, formatted],
            };

            return next;
        });
    };

    // ── Socket: add task created by another user ──────────────────────────────
    const applySocketTaskCreated = (rawTask) => {
        const formatted = formatTask(rawTask);
        const targetColId = statusToColumn[rawTask.status?.toLowerCase()] || 'todo';

        setColumns(prev => ({
            ...prev,
            [targetColId]: {
                ...prev[targetColId],
                tasks: [...prev[targetColId].tasks, formatted],
            },
        }));
    };

    // ── Socket: remove task deleted by another user ───────────────────────────
    const applySocketTaskDeleted = (taskId) => {
        setColumns(prev => {
            const next = { ...prev };
            Object.keys(next).forEach(colId => {
                next[colId] = {
                    ...next[colId],
                    tasks: next[colId].tasks.filter(t => t.id !== taskId),
                };
            });
            return next;
        });
    };

    // ── Add task to column (used when current user creates a task) ────────────
    const addTaskToColumn = (newTask) => {
        const formatted = formatTask(newTask);
        const targetColId = statusToColumn[newTask.status?.toLowerCase()] || 'todo';

        setColumns(prev => ({
            ...prev,
            [targetColId]: {
                ...prev[targetColId],
                tasks: [...prev[targetColId].tasks, formatted],
            },
        }));
    };

    // ── Create task ───────────────────────────────────────────────────────────
    const createTask = async (taskData) => {
        try {
            const newTask = await taskService.createTask(taskData);
            addTaskToColumn(newTask);
            return newTask;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create task');
            throw err;
        }
    };

    // ── Update task ───────────────────────────────────────────────────────────
    const updateTask = async (taskId, updates) => {
        try {
            const updatedTask = await taskService.updateTask(taskId, updates);
            await fetchTasks(); // full refresh for general updates
            return updatedTask;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update task');
            throw err;
        }
    };

    // ── Delete task ───────────────────────────────────────────────────────────
    const deleteTask = async (taskId) => {
        try {
            await taskService.deleteTask(taskId);
            applySocketTaskDeleted(taskId); // reuse same logic
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete task');
            throw err;
        }
    };

    useEffect(() => {
        if (!authLoading && user) {
            fetchTasks();
        }
    }, [authLoading, user]);

    return (
        <TaskContext.Provider value={{
            columns,
            setColumns,               // ← exposed for Kanban socket listeners
            loading,
            error,
            fetchTasks,
            moveTask,
            updateTaskStatus,
            addTaskToColumn,
            applySocketTaskUpdate,    // ← use these in Kanban socket listeners
            applySocketTaskCreated,
            applySocketTaskDeleted,
            createTask,
            updateTask,
            deleteTask,
            setError,
        }}>
            {children}
        </TaskContext.Provider>
    );
};

export default TaskProvider;