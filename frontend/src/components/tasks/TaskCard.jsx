import { Calendar, User, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';

const TaskCard = ({ task, onClick, onDelete, onStatusChange, isDragging }) => {
    const [showMenu, setShowMenu] = useState(false);

    const priorityColors = {
        low: 'bg-gray-100 text-gray-600',
        medium: 'bg-yellow-100 text-yellow-600',
        high: 'bg-orange-100 text-orange-600',
        urgent: 'bg-red-100 text-red-600'
    };

    return (
        <div
            className={`bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition cursor-pointer ${isDragging ? 'opacity-50' : ''
                }`}
            onClick={onClick}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-800 text-sm flex-1 pr-2">
                    {task.title}
                </h4>
                <div className="flex items-center gap-2">
                    <span
                        className={`px-2 py-1 text-xs rounded font-medium ${priorityColors[task.priority]
                            }`}
                    >
                        {task.priority}
                    </span>
                    <div className="relative">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowMenu(!showMenu);
                            }}
                            className="p-1 hover:bg-gray-100 rounded transition"
                        >
                            <MoreVertical className="w-4 h-4 text-gray-600" />
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete();
                                        setShowMenu(false);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                    Delete Task
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Description */}
            {task.description && (
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                    {task.description}
                </p>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between">
                {/* Assignees */}
                <div className="flex items-center gap-2">
                    {task.assignees && task.assignees.length > 0 ? (
                        <div className="flex -space-x-2">
                            {task.assignees.slice(0, 3).map((assignee) => (
                                <img
                                    key={assignee._id}
                                    src={assignee.avatar || `https://ui-avatars.com/api/?name=${assignee.name}`}
                                    alt={assignee.name}
                                    className="w-6 h-6 rounded-full border-2 border-white"
                                    title={assignee.name}
                                />
                            ))}
                            {task.assignees.length > 3 && (
                                <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs text-gray-600">
                                    +{task.assignees.length - 3}
                                </div>
                            )}
                        </div>
                    ) : (
                        <User className="w-4 h-4 text-gray-400" />
                    )}
                </div>

                {/* Due Date */}
                {task.dueDate && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>{format(new Date(task.dueDate), 'MMM d')}</span>
                    </div>
                )}
            </div>

            {/* Labels */}
            {task.labels && task.labels.length > 0 && (
                <div className="flex gap-1 mt-2 flex-wrap">
                    {task.labels.map((label, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded"
                        >
                            {label}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TaskCard;
