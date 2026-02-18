import { createContext, useState, useEffect, useContext } from 'react';
import * as taskService from '../services/taskService';
import { AuthContext } from './AuthContext';

// Create the context
export const TaskContext = createContext();

// Custom hook to use the TaskContext
export const useTasks = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTasks must be used within a TaskProvider');
    }
    return context;
};

// Helper function to get priority color
const getPriorityColor = (priority) => {
    const colors = {
        low: 'bg-gray-100 text-gray-700',
        medium: 'bg-yellow-100 text-yellow-700',
        high: 'bg-orange-100 text-orange-700',
        urgent: 'bg-red-100 text-red-700'
    };
    return colors[priority?.toLowerCase()] || 'bg-gray-100 text-gray-700';
};

// Helper function to organize tasks into columns
const organizeTasks = (tasks) => {
    const columns = {
        todo: {
            id: 'todo',
            title: 'To Do',
            color: 'gray',
            bgColor: 'bg-gray-100',
            dotColor: 'bg-gray-400',
            tasks: []
        },
        inProgress: {
            id: 'inProgress',
            title: 'In Progress',
            color: 'blue',
            bgColor: 'bg-blue-50',
            dotColor: 'bg-blue-500',
            tasks: []
        },
        review: {
            id: 'review',
            title: 'Review',
            color: 'purple',
            bgColor: 'bg-purple-50',
            dotColor: 'bg-purple-500',
            tasks: []
        },
        done: {
            id: 'done',
            title: 'Done',
            color: 'green',
            bgColor: 'bg-green-50',
            dotColor: 'bg-green-500',
            tasks: []
        }
    };

    // Organize tasks by status
    tasks.forEach(task => {
        const formattedTask = {
            id: task._id || task.id,
            title: task.title,
            description: task.description,
            priority: task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1),
            priorityColor: getPriorityColor(task.priority),
            assignee: task.assignee?.name || '👤',
            dueDate: task.dueDate
                ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                : '',
            tag: task.labels?.[0] || task.category || '',
            tagColor: 'bg-blue-100 text-blue-700',
            progress: task.progress,
            completed: task.status === 'done',
            status: task.status
        };

        // Map API status to column key
        const statusMap = {
            'todo': 'todo',
            'in-progress': 'inProgress',
            'inprogress': 'inProgress',
            'in_progress': 'inProgress',
            'review': 'review',
            'done': 'done',
            'completed': 'done'
        };

        const columnKey = statusMap[task.status?.toLowerCase()] || 'todo';
        columns[columnKey].tasks.push(formattedTask);
    });

    return columns;
};

// Provider component
export const TaskProvider = ({ children }) => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const [columns, setColumns] = useState({
        todo: {
            id: 'todo',
            title: 'To Do',
            color: 'gray',
            bgColor: 'bg-gray-100',
            dotColor: 'bg-gray-400',
            tasks: []
        },
        inProgress: {
            id: 'inProgress',
            title: 'In Progress',
            color: 'blue',
            bgColor: 'bg-blue-50',
            dotColor: 'bg-blue-500',
            tasks: []
        },
        review: {
            id: 'review',
            title: 'Review',
            color: 'purple',
            bgColor: 'bg-purple-50',
            dotColor: 'bg-purple-500',
            tasks: []
        },
        done: {
            id: 'done',
            title: 'Done',
            color: 'green',
            bgColor: 'bg-green-50',
            dotColor: 'bg-green-500',
            tasks: []
        }
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all tasks from API
    const fetchTasks = async (params = {}) => {
        try {
            setLoading(true);
            setError(null);
            const tasks = await taskService.getTasks(params);
            const organizedColumns = organizeTasks(tasks);
            setColumns(organizedColumns);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch tasks');
            console.error('Error fetching tasks:', err);
        } finally {
            setLoading(false);
        }
    };

    // Move task between columns (optimistic update)
    const moveTask = (taskId, sourceColumn, targetColumn) => {
        setColumns(prev => {
            const newColumns = { ...prev };

            // Find and remove task from source column
            const taskIndex = newColumns[sourceColumn].tasks.findIndex(
                task => task.id === taskId
            );

            if (taskIndex !== -1) {
                const [task] = newColumns[sourceColumn].tasks.splice(taskIndex, 1);

                // Update task status based on target column
                const columnStatusMap = {
                    'todo': 'todo',
                    'inProgress': 'in-progress',
                    'review': 'review',
                    'done': 'done'
                };

                task.status = columnStatusMap[targetColumn];
                task.completed = targetColumn === 'done';

                // Add to target column
                newColumns[targetColumn].tasks.push(task);
            }

            return newColumns;
        });
    };

    // Update task status in backend
    const updateTaskStatus = async (taskId, status) => {
        try {
            await taskService.updateTaskStatus(taskId, status);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update task status');
            console.error('Error updating task status:', err);
            // Optionally: revert optimistic update here
            throw err;
        }
    };

    // Add new task to columns
    const addTaskToColumn = (newTask) => {
        setColumns(prev => {
            const formattedTask = {
                id: newTask._id || newTask.id,
                title: newTask.title,
                description: newTask.description,
                priority: newTask.priority?.charAt(0).toUpperCase() + newTask.priority?.slice(1),
                priorityColor: getPriorityColor(newTask.priority),
                assignee: '👤',
                dueDate: newTask.dueDate
                    ? new Date(newTask.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    : '',
                tag: newTask.labels?.[0] || '',
                tagColor: 'bg-blue-100 text-blue-700',
                status: 'todo',
                completed: false
            };

            return {
                ...prev,
                todo: {
                    ...prev.todo,
                    tasks: [...prev.todo.tasks, formattedTask]
                }
            };
        });
    };

    // Create new task
    const createTask = async (taskData) => {
        try {
            const newTask = await taskService.createTask(taskData);
            addTaskToColumn(newTask);
            return newTask;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create task');
            console.error('Error creating task:', err);
            throw err;
        }
    };

    // Update task
    const updateTask = async (taskId, updates) => {
        try {
            const updatedTask = await taskService.updateTask(taskId, updates);
            // Refresh tasks to get updated data
            await fetchTasks();
            return updatedTask;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update task');
            console.error('Error updating task:', err);
            throw err;
        }
    };

    // Delete task
    const deleteTask = async (taskId) => {
        try {
            await taskService.deleteTask(taskId);
            // Remove task from columns
            setColumns(prev => {
                const newColumns = { ...prev };
                Object.keys(newColumns).forEach(columnKey => {
                    newColumns[columnKey].tasks = newColumns[columnKey].tasks.filter(
                        task => task.id !== taskId
                    );
                });
                return newColumns;
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete task');
            console.error('Error deleting task:', err);
            throw err;
        }
    };

    // Fetch tasks on mount (only if user is authenticated)
    useEffect(() => {
        // Only fetch tasks if:
        // 1. Auth context has finished loading
        // 2. User is authenticated
        if (!authLoading && user) {
            fetchTasks();
        }
    }, [authLoading, user]);

    const value = {
        columns,
        loading,
        error,
        fetchTasks,
        moveTask,
        updateTaskStatus,
        addTaskToColumn,
        createTask,
        updateTask,
        deleteTask,
        setError
    };

    return (
        <TaskContext.Provider value={value}>
            {children}
        </TaskContext.Provider>
    );
};

export default TaskProvider;