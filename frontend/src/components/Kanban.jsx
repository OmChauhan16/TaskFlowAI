import { useState } from 'react';
import { Bell, User, Plus } from 'lucide-react';

const Kanban = () => {
    const [activeTab, setActiveTab] = useState('Kanban');

    // Initial tasks data
    const [columns, setColumns] = useState({
        todo: {
            id: 'todo',
            title: 'To Do',
            color: 'gray',
            bgColor: 'bg-gray-100',
            dotColor: 'bg-gray-400',
            tasks: [
                {
                    id: 1,
                    title: 'Design landing page',
                    description: 'Create mockups for homepage',
                    priority: 'High',
                    priorityColor: 'bg-red-100 text-red-700',
                    assignee: '👤',
                    dueDate: 'Dec 28',
                    tag: 'Design',
                    tagColor: 'bg-blue-100 text-blue-700'
                }
            ]
        },
        inProgress: {
            id: 'inProgress',
            title: 'In Progress',
            color: 'blue',
            bgColor: 'bg-blue-50',
            dotColor: 'bg-blue-500',
            tasks: [
                {
                    id: 2,
                    title: 'Implement auth',
                    description: 'JWT authentication',
                    priority: 'Urgent',
                    priorityColor: 'bg-red-100 text-red-700',
                    assignee: '👤',
                    dueDate: 'Dec 26',
                    progress: 60
                }
            ]
        },
        review: {
            id: 'review',
            title: 'Review',
            color: 'purple',
            bgColor: 'bg-purple-50',
            dotColor: 'bg-purple-500',
            tasks: [
                {
                    id: 3,
                    title: 'Database schema',
                    description: 'Ready for review',
                    priority: 'Medium',
                    priorityColor: 'bg-yellow-100 text-yellow-700',
                    assignee: '👤',
                    dueDate: 'Dec 25'
                }
            ]
        },
        done: {
            id: 'done',
            title: 'Done',
            color: 'green',
            bgColor: 'bg-green-50',
            dotColor: 'bg-green-500',
            tasks: [
                {
                    id: 4,
                    title: 'Setup project',
                    description: 'Completed ✓',
                    assignee: '👤',
                    dueDate: 'Dec 20',
                    completed: true
                }
            ]
        }
    });

    const [draggedTask, setDraggedTask] = useState(null);
    const [draggedFrom, setDraggedFrom] = useState(null);

    const handleDragStart = (task, columnId) => {
        setDraggedTask(task);
        setDraggedFrom(columnId);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (targetColumnId) => {
        if (draggedTask && draggedFrom !== targetColumnId) {
            setColumns(prev => {
                const newColumns = { ...prev };

                // Remove from source column
                newColumns[draggedFrom].tasks = newColumns[draggedFrom].tasks.filter(
                    task => task.id !== draggedTask.id
                );

                // Add to target column
                newColumns[targetColumnId].tasks.push(draggedTask);

                return newColumns;
            });
        }

        setDraggedTask(null);
        setDraggedFrom(null);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo and Brand */}
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">
                                T
                            </div>
                            <h1 className="text-xl font-bold text-gray-900">TaskFlow AI</h1>
                        </div>

                        {/* Navigation */}
                        <nav className="hidden md:flex items-center gap-1">
                            {['Dashboard', 'Kanban', 'Login'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === tab
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>

                        {/* Right Side Icons */}
                        <div className="flex items-center gap-4">
                            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <Bell className="w-5 h-5 text-gray-600" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                            <button className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors">
                                <User className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-8">
                    {/* <h2 className="text-4xl font-bold text-gray-900">Website Redesign</h2> */}
                    <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm">
                        <Plus className="w-5 h-5" />
                        Add Task
                    </button>
                </div>

                {/* Kanban Board */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Object.values(columns).map((column) => (
                        <div
                            key={column.id}
                            className={`${column.bgColor} rounded-2xl p-4`}
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(column.id)}
                        >
                            {/* Column Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${column.dotColor}`}></div>
                                    <h3 className="font-bold text-gray-900">{column.title}</h3>
                                </div>
                                <span className="bg-white px-2.5 py-1 rounded-full text-sm font-semibold text-gray-700">
                                    {column.tasks.length}
                                </span>
                            </div>

                            {/* Tasks */}
                            <div className="space-y-3">
                                {column.tasks.map((task) => (
                                    <div
                                        key={task.id}
                                        draggable
                                        onDragStart={() => handleDragStart(task, column.id)}
                                        className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-move"
                                    >
                                        {/* Task Header */}
                                        <div className="flex items-start justify-between mb-3">
                                            <h4 className={`font-bold text-gray-900 ${task.completed ? 'line-through text-gray-400' : ''}`}>
                                                {task.title}
                                            </h4>
                                            {task.priority && (
                                                <span className={`${task.priorityColor} px-2.5 py-1 rounded-md text-xs font-semibold`}>
                                                    {task.priority}
                                                </span>
                                            )}
                                        </div>

                                        {/* Task Description */}
                                        <p className={`text-sm text-gray-600 mb-3 ${task.completed ? 'text-gray-400' : ''}`}>
                                            {task.description}
                                        </p>

                                        {/* Progress Bar (if exists) */}
                                        {task.progress !== undefined && (
                                            <div className="mb-3">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-xs font-medium text-gray-700">Progress</span>
                                                    <span className="text-xs font-semibold text-gray-900">{task.progress}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-500 h-2 rounded-full transition-all"
                                                        style={{ width: `${task.progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Task Footer */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">{task.assignee}</span>
                                                {task.tag && (
                                                    <span className={`${task.tagColor} px-2.5 py-1 rounded-md text-xs font-medium`}>
                                                        {task.tag}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-xs text-gray-500">{task.dueDate}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Kanban;