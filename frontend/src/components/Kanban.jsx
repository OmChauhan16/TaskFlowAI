// import { useState } from 'react';
// import { Plus } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import Header from '../components/Header';
// import CreateTaskModal from '../components/tasks/CreateTaskModal';
// import TaskDetailModal from '../components/tasks/TaskDetailModal';
// import TaskList from '../components/tasks/TaskList';
// import { useTasks } from '../context/TaskContext';

// const Kanban = () => {
//     const [activeTab, setActiveTab] = useState('Kanban');
//     const navigate = useNavigate();

//     // Get task data and functions from TaskContext
//     const {
//         columns,
//         loading,
//         error,
//         moveTask,
//         updateTaskStatus,
//         addTaskToColumn
//     } = useTasks();

//     // Modal state
//     const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);

//     // Drag and drop state
//     const [draggedTask, setDraggedTask] = useState(null);
//     const [draggedFrom, setDraggedFrom] = useState(null);

//     const handleDragStart = (task, columnId) => {
//         setDraggedTask(task);
//         setDraggedFrom(columnId);
//     };

//     const handleDragOver = (e) => {
//         e.preventDefault();
//     };

//     const handleTabClick = (tab) => {
//         setActiveTab(tab);

//         // Navigate to different routes based on tab
//         if (tab === 'Dashboard') {
//             navigate('/dashboard');
//         } else if (tab === 'Kanban') {
//             navigate('/kanban-board');
//         }
//     };

//     const handleDrop = async (targetColumnId) => {
//         if (draggedTask && draggedFrom !== targetColumnId) {
//             // Optimistic UI update
//             moveTask(draggedTask.id, draggedFrom, targetColumnId);

//             // Map column IDs to status values for API
//             const columnStatusMap = {
//                 'todo': 'todo',
//                 'inProgress': 'in-progress',
//                 'review': 'review',
//                 'done': 'done'
//             };

//             // Update backend
//             try {
//                 await updateTaskStatus(draggedTask.id, columnStatusMap[targetColumnId]);
//             } catch (error) {
//                 console.error('Failed to update task status:', error);
//                 // Optionally: revert the optimistic update
//             }
//         }

//         setDraggedTask(null);
//         setDraggedFrom(null);
//     };

//     // Called when new task is created
//     const handleTaskCreated = (newTask) => {
//         console.log('New task created:', newTask);

//         // Add task to context
//         addTaskToColumn(newTask);

//         // Close modal
//         setShowCreateTaskModal(false);
//     };

//     return (
//         <div className="min-h-screen bg-gray-50">
//             {/* Header */}
//             <Header />

//             {/* Main Content */}
//             <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//                 {/* Page Header */}
//                 <div className="flex items-center justify-between mb-8">
//                     <button
//                         onClick={() => setShowCreateTaskModal(true)}
//                         className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm"
//                     >
//                         <Plus className="w-4 h-4" />
//                         Add Task
//                     </button>
//                 </div>

//                 {/* Loading State */}
//                 {loading && (
//                     <div className="flex items-center justify-center py-12">
//                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//                     </div>
//                 )}

//                 {/* Error State */}
//                 {error && (
//                     <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
//                         <p className="font-medium">Error loading tasks</p>
//                         <p className="text-sm">{error}</p>
//                     </div>
//                 )}

//                 {/* Kanban Board */}
//                 {!loading && (
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                         {Object.values(columns).map((column) => (
//                             <div
//                                 key={column.id}
//                                 className={`${column.bgColor} rounded-2xl p-4`}
//                                 onDragOver={handleDragOver}
//                                 onDrop={() => handleDrop(column.id)}
//                             >
//                                 {/* Column Header */}
//                                 <div className="flex items-center justify-between mb-4">
//                                     <div className="flex items-center gap-2">
//                                         <div className={`w-3 h-3 rounded-full ${column.dotColor}`}></div>
//                                         <h3 className="font-bold text-gray-900">{column.title}</h3>
//                                     </div>
//                                     <span className="bg-white px-2.5 py-1 rounded-full text-sm font-semibold text-gray-700">
//                                         {column.tasks.length}
//                                     </span>
//                                 </div>

//                                 {/* Tasks */}
//                                 <div className="space-y-3">
//                                     {column.tasks.map((task) => (
//                                         <div
//                                             key={task.id}
//                                             draggable
//                                             onDragStart={() => handleDragStart(task, column.id)}
//                                             className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-move"
//                                         >
//                                             {/* Task Header */}
//                                             <div className="flex items-start justify-between mb-3">
//                                                 <h4 className={`font-bold text-gray-900 ${task.completed ? 'line-through text-gray-400' : ''}`}>
//                                                     {task.title}
//                                                 </h4>
//                                                 {task.priority && (
//                                                     <span className={`${task.priorityColor} px-2.5 py-1 rounded-md text-xs font-semibold`}>
//                                                         {task.priority}
//                                                     </span>
//                                                 )}
//                                             </div>

//                                             {/* Task Description */}
//                                             <p className={`text-sm text-gray-600 mb-3 ${task.completed ? 'text-gray-400' : ''}`}>
//                                                 {task.description}
//                                             </p>

//                                             {/* Progress Bar (if exists) */}
//                                             {task.progress !== undefined && (
//                                                 <div className="mb-3">
//                                                     <div className="flex items-center justify-between mb-1">
//                                                         <span className="text-xs font-medium text-gray-700">Progress</span>
//                                                         <span className="text-xs font-semibold text-gray-900">{task.progress}%</span>
//                                                     </div>
//                                                     <div className="w-full bg-gray-200 rounded-full h-2">
//                                                         <div
//                                                             className="bg-blue-500 h-2 rounded-full transition-all"
//                                                             style={{ width: `${task.progress}%` }}
//                                                         ></div>
//                                                     </div>
//                                                 </div>
//                                             )}

//                                             {/* Task Footer */}
//                                             <div className="flex items-center justify-between">
//                                                 <div className="flex items-center gap-2">
//                                                     <span className="text-lg">{task.assignee}</span>
//                                                     {task.tag && (
//                                                         <span className={`${task.tagColor} px-2.5 py-1 rounded-md text-xs font-medium`}>
//                                                             {task.tag}
//                                                         </span>
//                                                     )}
//                                                 </div>
//                                                 <span className="text-xs text-gray-500">{task.dueDate}</span>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </main>

//             {/* Create Task Modal */}
//             {showCreateTaskModal && (
//                 <CreateTaskModal
//                     onClose={() => setShowCreateTaskModal(false)}
//                     onTaskCreated={handleTaskCreated}
//                 />
//             )}
//         </div>
//     );
// };

// export default Kanban;



// import { useState, useEffect, useCallback } from 'react';
// import { Plus, Wifi, WifiOff } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import Header from '../components/Header';
// import CreateTaskModal from '../components/tasks/CreateTaskModal';
// import { useTasks } from '../context/TaskContext';
// import { useSocket } from '../context/SocketContext';
// import toast from 'react-hot-toast';

// const Kanban = () => {
//     const navigate = useNavigate();
//     const { socket, isConnected } = useSocket();

//     // Get task data and functions from TaskContext
//     const {
//         columns,
//         loading,
//         error,
//         moveTask,
//         updateTaskStatus,
//         addTaskToColumn,
//         setColumns,  // needed to handle incoming socket updates
//     } = useTasks();

//     // Modal state
//     const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);

//     // Drag state
//     const [draggedTask, setDraggedTask] = useState(null);
//     const [draggedFrom, setDraggedFrom] = useState(null);
//     const [dragOverColumn, setDragOverColumn] = useState(null); // highlight target column
//     const [draggingUsers, setDraggingUsers] = useState({});     // { taskId: userName }

//     // ── Get projectId ─────────────────────────────────────────────────────────
//     // Pull from localStorage or wherever you store the active project
//     const projectId = localStorage.getItem('currentProjectId');

//     // ── Socket: join room + listen for events ─────────────────────────────────
//     useEffect(() => {
//         if (!socket || !projectId) return;

//         // Join this project's socket room
//         socket.emit('join-project', projectId);

//         // Someone else created a task
//         socket.on('task-created', ({ task }) => {
//             addTaskToColumn(task);
//             toast(`New task added: "${task.title}"`, { icon: '✅', duration: 3000 });
//         });

//         // Someone else updated / moved a task
//         // socket.on('task-updated', ({ task }) => {
//         //     // Map API status → column id
//         //     const statusToColumn = {
//         //         'todo': 'todo',
//         //         'in-progress': 'inProgress',
//         //         'review': 'review',
//         //         'done': 'done',
//         //     };

//         //     // Update the task inside columns state
//         //     setColumns(prev => {
//         //         const next = { ...prev };
//         //         // Remove from all columns first
//         //         Object.keys(next).forEach(colId => {
//         //             next[colId] = {
//         //                 ...next[colId],
//         //                 tasks: next[colId].tasks.filter(t => t.id !== task._id && t.id !== task.id),
//         //             };
//         //         });
//         //         // Add to correct column
//         //         const targetCol = statusToColumn[task.status] || 'todo';
//         //         next[targetCol] = {
//         //             ...next[targetCol],
//         //             tasks: [...next[targetCol].tasks, normalizeTask(task)],
//         //         };
//         //         return next;
//         //     });
//         // });
//         // In Kanban.jsx — replace your current task-updated listener with this
//         socket.on('task-updated', ({ task }) => {
//             // Map backend status → your column IDs
//             const statusToColumn = {
//                 'todo': 'todo',
//                 'in-progress': 'inProgress',
//                 'review': 'review',
//                 'done': 'done',
//             };

//             setColumns(prev => {
//                 // Deep clone to avoid mutation
//                 const next = {};
//                 Object.keys(prev).forEach(colId => {
//                     next[colId] = {
//                         ...prev[colId],
//                         tasks: prev[colId].tasks.filter(
//                             t => (t.id || t._id) !== (task._id || task.id)
//                         ),
//                     };
//                 });

//                 // Insert into correct column
//                 const targetCol = statusToColumn[task.status] || 'todo';
//                 if (next[targetCol]) {
//                     next[targetCol] = {
//                         ...next[targetCol],
//                         tasks: [...next[targetCol].tasks, normalizeTask(task)],
//                     };
//                 }

//                 return next;
//             });
//         });
//         // Someone else deleted a task
//         socket.on('task-deleted', ({ taskId }) => {
//             setColumns(prev => {
//                 const next = { ...prev };
//                 Object.keys(next).forEach(colId => {
//                     next[colId] = {
//                         ...next[colId],
//                         tasks: next[colId].tasks.filter(t => t.id !== taskId),
//                     };
//                 });
//                 return next;
//             });
//             toast('A task was removed', { icon: '🗑️', duration: 2000 });
//         });

//         // Visual: another user is dragging a card
//         socket.on('task-dragging', ({ taskId, name }) => {
//             setDraggingUsers(prev => ({ ...prev, [taskId]: name }));
//         });

//         socket.on('task-drag-end', ({ taskId }) => {
//             setDraggingUsers(prev => {
//                 const next = { ...prev };
//                 delete next[taskId];
//                 return next;
//             });
//         });

//         return () => {
//             socket.emit('leave-project', projectId);
//             socket.off('task-created');
//             socket.off('task-updated');
//             socket.off('task-deleted');
//             socket.off('task-dragging');
//             socket.off('task-drag-end');
//         };
//     }, [socket, projectId]);

//     // ── Helpers ───────────────────────────────────────────────────────────────
//     // Normalize a raw API task to the shape your Kanban cards expect
//     const normalizeTask = (task) => ({
//         id: task._id || task.id,
//         title: task.title,
//         description: task.description || '',
//         priority: task.priority,
//         priorityColor: getPriorityColor(task.priority),
//         dueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '',
//         assignee: task.assignee?.name || '—',
//         progress: task.progress,
//         tag: task.labels?.[0] || '',
//         tagColor: 'bg-blue-100 text-blue-700',
//         completed: task.status === 'done',
//     });

//     const getPriorityColor = (priority) => {
//         const map = {
//             high: 'bg-red-100 text-red-700',
//             medium: 'bg-yellow-100 text-yellow-700',
//             low: 'bg-green-100 text-green-700',
//             urgent: 'bg-purple-100 text-purple-700',
//         };
//         return map[priority?.toLowerCase()] || 'bg-gray-100 text-gray-700';
//     };

//     const columnStatusMap = {
//         'todo': 'todo',
//         'inProgress': 'in-progress',
//         'review': 'review',
//         'done': 'done',
//     };

//     // ── Drag handlers ─────────────────────────────────────────────────────────
//     const handleDragStart = (task, columnId) => {
//         console.log('drag task.id:', task.id);      // should be the _id string
//         console.log('drag task._id:', task._id);
//         setDraggedTask(task);
//         setDraggedFrom(columnId);
//         // Tell others you're dragging this card
//         socket?.emit('task-dragging', { taskId: task.id, projectId });
//     };

//     const handleDragOver = (e, columnId) => {
//         e.preventDefault();
//         setDragOverColumn(columnId);
//     };

//     const handleDragLeave = () => {
//         setDragOverColumn(null);
//     };

//     // const handleDrop = async (targetColumnId) => {
//     //     setDragOverColumn(null);

//     //     if (!draggedTask || draggedFrom === targetColumnId) {
//     //         setDraggedTask(null);
//     //         setDraggedFrom(null);
//     //         return;
//     //     }
//     //     console.log('🎯 handleDrop:', draggedTask.id, draggedFrom, '→', targetColumnId);


//     //     // 1. Optimistic UI update (instant feel)
//     //     moveTask(draggedTask.id, draggedFrom, targetColumnId);
//     //     console.log('✅ moveTask called');

//     //     // 2. Tell others drag ended (clear their visual indicator)
//     //     socket?.emit('task-drag-end', { taskId: draggedTask.id, projectId });

//     //     // 3. Persist to backend (which will emit 'task-updated' to room)
//     //     try {
//     //         await updateTaskStatus(draggedTask.id, columnStatusMap[targetColumnId]);
//     //     } catch (error) {
//     //         console.error('Failed to update task status:', error);
//     //         toast.error('Failed to move task');
//     //         // Revert optimistic update
//     //         moveTask(draggedTask.id, targetColumnId, draggedFrom);
//     //     }

//     //     setDraggedTask(null);
//     //     setDraggedFrom(null);
//     // };

//     const handleDrop = async (targetColumnId) => {
//         setDragOverColumn(null);

//         if (!draggedTask || draggedFrom === targetColumnId) {
//             setDraggedTask(null);
//             setDraggedFrom(null);
//             return;
//         }

//         const taskId = draggedTask.id;       // save before clearing
//         const fromCol = draggedFrom;          // save before clearing

//         // Clear drag state immediately
//         setDraggedTask(null);
//         setDraggedFrom(null);

//         const columnStatusMap = {
//             'todo': 'todo',
//             'inProgress': 'in-progress',
//             'review': 'review',
//             'done': 'done'
//         };

//         // 1. Move card visually RIGHT NOW
//         moveTask(taskId, fromCol, targetColumnId);

//         // 2. Persist to backend
//         try {
//             await updateTaskStatus(taskId, columnStatusMap[targetColumnId]);
//         } catch (error) {
//             console.error('Failed to move, reverting');
//             moveTask(taskId, targetColumnId, fromCol); // revert
//         }
//     };

//     const handleDragEnd = () => {
//         // Cleanup if dropped outside a valid column
//         if (draggedTask) {
//             socket?.emit('task-drag-end', { taskId: draggedTask.id, projectId });
//         }
//         setDraggedTask(null);
//         setDraggedFrom(null);
//         setDragOverColumn(null);
//     };

//     // ── Task created ──────────────────────────────────────────────────────────
//     const handleTaskCreated = (newTask) => {
//         addTaskToColumn(newTask);
//         setShowCreateTaskModal(false);
//         // Backend controller will emit 'task-created' to room —
//         // other users will see it automatically
//     };

//     return (
//         <div className="min-h-screen bg-gray-50">
//             <Header />

//             <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//                 {/* Page Header */}
//                 <div className="flex items-center justify-between mb-8">
//                     <button
//                         onClick={() => setShowCreateTaskModal(true)}
//                         className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm"
//                     >
//                         <Plus className="w-4 h-4" />
//                         Add Task
//                     </button>

//                     {/* Socket connection badge */}
//                     <div className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${isConnected
//                         ? 'bg-green-50 text-green-700 border border-green-200'
//                         : 'bg-gray-100 text-gray-500 border border-gray-200'
//                         }`}>
//                         {isConnected
//                             ? <><Wifi className="w-3.5 h-3.5" /> Live</>
//                             : <><WifiOff className="w-3.5 h-3.5" /> Offline</>
//                         }
//                     </div>
//                 </div>

//                 {/* Loading */}
//                 {loading && (
//                     <div className="flex items-center justify-center py-12">
//                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//                     </div>
//                 )}

//                 {/* Error */}
//                 {error && (
//                     <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
//                         <p className="font-medium">Error loading tasks</p>
//                         <p className="text-sm">{error}</p>
//                     </div>
//                 )}

//                 {/* Kanban Board */}
//                 {!loading && (
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                         {Object.values(columns).map((column) => (
//                             <div
//                                 key={column.id}
//                                 className={`
//                                     ${column.bgColor} rounded-2xl p-4 transition-all duration-200
//                                     ${dragOverColumn === column.id
//                                         ? 'ring-2 ring-blue-400 ring-offset-2 scale-[1.01]'
//                                         : ''}
//                                 `}
//                                 onDragOver={(e) => handleDragOver(e, column.id)}
//                                 onDragLeave={handleDragLeave}
//                                 onDrop={() => handleDrop(column.id)}
//                             >
//                                 {/* Column Header */}
//                                 <div className="flex items-center justify-between mb-4">
//                                     <div className="flex items-center gap-2">
//                                         <div className={`w-3 h-3 rounded-full ${column.dotColor}`}></div>
//                                         <h3 className="font-bold text-gray-900">{column.title}</h3>
//                                     </div>
//                                     <span className="bg-white px-2.5 py-1 rounded-full text-sm font-semibold text-gray-700">
//                                         {column.tasks.length}
//                                     </span>
//                                 </div>

//                                 {/* Tasks */}
//                                 <div className="space-y-3 min-h-[60px]">
//                                     {column.tasks.map((task) => {
//                                         const isDraggingByOther = draggingUsers[task.id];
//                                         const isBeingDragged = draggedTask?.id === task.id;

//                                         return (
//                                             <div
//                                                 key={task.id}
//                                                 draggable
//                                                 onDragStart={() => handleDragStart(task, column.id)}
//                                                 onDragEnd={handleDragEnd}
//                                                 className={`
//                                                     bg-white rounded-xl p-4 shadow-sm hover:shadow-md
//                                                     transition-all cursor-move select-none
//                                                     ${isBeingDragged ? 'opacity-40 scale-95' : ''}
//                                                     ${isDraggingByOther ? 'ring-2 ring-yellow-400 ring-offset-1' : ''}
//                                                 `}
//                                             >
//                                                 {/* Other user dragging indicator */}
//                                                 {isDraggingByOther && (
//                                                     <p className="text-xs text-yellow-600 font-medium mb-2">
//                                                         ✋ {isDraggingByOther} is moving this
//                                                     </p>
//                                                 )}

//                                                 {/* Task Header */}
//                                                 <div className="flex items-start justify-between mb-3">
//                                                     <h4 className={`font-bold text-gray-900 text-sm leading-snug ${task.completed ? 'line-through text-gray-400' : ''}`}>
//                                                         {task.title}
//                                                     </h4>
//                                                     {task.priority && (
//                                                         <span className={`${task.priorityColor} px-2.5 py-1 rounded-md text-xs font-semibold ml-2 flex-shrink-0`}>
//                                                             {task.priority}
//                                                         </span>
//                                                     )}
//                                                 </div>

//                                                 {/* Description */}
//                                                 {task.description && (
//                                                     <p className={`text-sm text-gray-600 mb-3 line-clamp-2 ${task.completed ? 'text-gray-400' : ''}`}>
//                                                         {task.description}
//                                                     </p>
//                                                 )}

//                                                 {/* Progress Bar */}
//                                                 {task.progress !== undefined && (
//                                                     <div className="mb-3">
//                                                         <div className="flex items-center justify-between mb-1">
//                                                             <span className="text-xs font-medium text-gray-700">Progress</span>
//                                                             <span className="text-xs font-semibold text-gray-900">{task.progress}%</span>
//                                                         </div>
//                                                         <div className="w-full bg-gray-200 rounded-full h-2">
//                                                             <div
//                                                                 className="bg-blue-500 h-2 rounded-full transition-all"
//                                                                 style={{ width: `${task.progress}%` }}
//                                                             />
//                                                         </div>
//                                                     </div>
//                                                 )}

//                                                 {/* Task Footer */}
//                                                 <div className="flex items-center justify-between">
//                                                     <div className="flex items-center gap-2">
//                                                         <span className="text-sm">{task.assignee}</span>
//                                                         {task.tag && (
//                                                             <span className={`${task.tagColor} px-2.5 py-1 rounded-md text-xs font-medium`}>
//                                                                 {task.tag}
//                                                             </span>
//                                                         )}
//                                                     </div>
//                                                     {task.dueDate && (
//                                                         <span className="text-xs text-gray-500">{task.dueDate}</span>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         );
//                                     })}

//                                     {/* Empty column drop hint */}
//                                     {column.tasks.length === 0 && (
//                                         <div className={`
//                                             border-2 border-dashed rounded-xl p-4 text-center text-sm text-gray-400 transition-colors
//                                             ${dragOverColumn === column.id ? 'border-blue-400 bg-blue-50 text-blue-500' : 'border-gray-300'}
//                                         `}>
//                                             {dragOverColumn === column.id ? 'Drop here' : 'No tasks'}
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </main>

//             {showCreateTaskModal && (
//                 <CreateTaskModal
//                     onClose={() => setShowCreateTaskModal(false)}
//                     onTaskCreated={handleTaskCreated}
//                 />
//             )}
//         </div>
//     );
// };

// export default Kanban;




// import { useState, useEffect, useCallback } from 'react';
// import { Plus, Wifi, WifiOff } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import Header from '../components/Header';
// import CreateTaskModal from '../components/tasks/CreateTaskModal';
// import { useTasks } from '../context/TaskContext';
// import { useSocket } from '../context/SocketContext';
// import toast from 'react-hot-toast';

// const Kanban = () => {
//     const navigate = useNavigate();
//     const { socket, isConnected } = useSocket();


//     // Get task data and functions from TaskContext
//     const {
//         columns,
//         loading,
//         error,
//         moveTask,
//         updateTaskStatus,
//         addTaskToColumn,
//         setColumns,  // needed to handle incoming socket updates
//     } = useTasks();
//     // ADD THIS — watch if columns actually changes
//     useEffect(() => {
//         console.log('🔄 columns changed:',
//             Object.values(columns).map(c => `${c.id}:${c.tasks.length}`)
//         );
//     }, [columns]);
//     // Modal state
//     const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);

//     // Drag state
//     const [draggedTask, setDraggedTask] = useState(null);
//     const [draggedFrom, setDraggedFrom] = useState(null);
//     const [dragOverColumn, setDragOverColumn] = useState(null); // highlight target column
//     const [draggingUsers, setDraggingUsers] = useState({});     // { taskId: userName }

//     // ── Get projectId ─────────────────────────────────────────────────────────
//     // Pull from localStorage or wherever you store the active project
//     const projectId = localStorage.getItem('currentProjectId');

//     // ── Socket: join room + listen for events ─────────────────────────────────
//     useEffect(() => {
//         if (!socket || !projectId) return;

//         // Join this project's socket room
//         socket.emit('join-project', projectId);

//         // Someone else created a task
//         socket.on('task-created', ({ task }) => {
//             addTaskToColumn(task);
//             toast(`New task added: "${task.title}"`, { icon: '✅', duration: 3000 });
//         });

//         // Someone else updated / moved a task
//         socket.on('task-updated', ({ task }) => {
//             // Map API status → column id
//             const statusToColumn = {
//                 'todo': 'todo',
//                 'in-progress': 'inProgress',
//                 'review': 'review',
//                 'done': 'done',
//             };

//             // Update the task inside columns state
//             setColumns(prev => {
//                 const next = { ...prev };
//                 // Remove from all columns first
//                 Object.keys(next).forEach(colId => {
//                     next[colId] = {
//                         ...next[colId],
//                         tasks: next[colId].tasks.filter(t => t.id !== task._id && t.id !== task.id),
//                     };
//                 });
//                 // Add to correct column
//                 const targetCol = statusToColumn[task.status] || 'todo';
//                 next[targetCol] = {
//                     ...next[targetCol],
//                     tasks: [...next[targetCol].tasks, normalizeTask(task)],
//                 };
//                 return next;
//             });
//         });

//         // Someone else deleted a task
//         socket.on('task-deleted', ({ taskId }) => {
//             setColumns(prev => {
//                 const next = { ...prev };
//                 Object.keys(next).forEach(colId => {
//                     next[colId] = {
//                         ...next[colId],
//                         tasks: next[colId].tasks.filter(t => t.id !== taskId),
//                     };
//                 });
//                 return next;
//             });
//             toast('A task was removed', { icon: '🗑️', duration: 2000 });
//         });

//         // Visual: another user is dragging a card
//         socket.on('task-dragging', ({ taskId, name }) => {
//             setDraggingUsers(prev => ({ ...prev, [taskId]: name }));
//         });

//         socket.on('task-drag-end', ({ taskId }) => {
//             setDraggingUsers(prev => {
//                 const next = { ...prev };
//                 delete next[taskId];
//                 return next;
//             });
//         });

//         return () => {
//             socket.emit('leave-project', projectId);
//             socket.off('task-created');
//             socket.off('task-updated');
//             socket.off('task-deleted');
//             socket.off('task-dragging');
//             socket.off('task-drag-end');
//         };
//     }, [socket, projectId]);

//     // ── Helpers ───────────────────────────────────────────────────────────────
//     // Normalize a raw API task to the shape your Kanban cards expect
//     const normalizeTask = (task) => ({
//         id: task._id || task.id,
//         title: task.title,
//         description: task.description || '',
//         priority: task.priority,
//         priorityColor: getPriorityColor(task.priority),
//         dueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '',
//         assignee: task.assignee?.name || '—',
//         progress: task.progress,
//         tag: task.labels?.[0] || '',
//         tagColor: 'bg-blue-100 text-blue-700',
//         completed: task.status === 'done',
//     });

//     const getPriorityColor = (priority) => {
//         const map = {
//             high: 'bg-red-100 text-red-700',
//             medium: 'bg-yellow-100 text-yellow-700',
//             low: 'bg-green-100 text-green-700',
//             urgent: 'bg-purple-100 text-purple-700',
//         };
//         return map[priority?.toLowerCase()] || 'bg-gray-100 text-gray-700';
//     };

//     const columnStatusMap = {
//         'todo': 'todo',
//         'inProgress': 'in-progress',
//         'review': 'review',
//         'done': 'done',
//     };

//     // ── Drag handlers ─────────────────────────────────────────────────────────
//     const handleDragStart = (task, columnId) => {
//         setDraggedTask(task);
//         setDraggedFrom(columnId);
//         // Tell others you're dragging this card
//         socket?.emit('task-dragging', { taskId: task._id, projectId });
//     };

//     const handleDragOver = (e, columnId) => {
//         e.preventDefault();
//         setDragOverColumn(columnId);
//     };

//     const handleDragLeave = () => {
//         setDragOverColumn(null);
//     };

//     const handleDrop = async (targetColumnId) => {
//         setDragOverColumn(null);

//         console.log('handleDrop draggedTask:', draggedTask);
//         console.log('handleDrop draggedTask.id:', draggedTask?.id);
//         if (!draggedTask || draggedFrom === targetColumnId) {
//             setDraggedTask(null);
//             setDraggedFrom(null);
//             return;
//         }

//         // ✅ Save to local vars BEFORE clearing state
//         const taskId = draggedTask.id;
//         const fromCol = draggedFrom;
//         const newStatus = columnStatusMap[targetColumnId];

//         // Clear drag state immediately
//         setDraggedTask(null);
//         setDraggedFrom(null);

//         // 1. Move card visually RIGHT NOW (optimistic)
//         moveTask(taskId, fromCol, targetColumnId);

//         // 2. Tell others drag ended
//         socket?.emit('task-drag-end', { taskId, projectId });

//         // 3. Persist to backend
//         try {
//             await updateTaskStatus(taskId, newStatus);
//         } catch (error) {
//             console.error('Failed to update task status:', error);
//             toast.error('Failed to move task');
//             // Revert using saved local vars (not stale state)
//             moveTask(taskId, targetColumnId, fromCol);
//         }
//     };

//     const handleDragEnd = () => {
//         // Cleanup if dropped outside a valid column
//         if (draggedTask) {
//             socket?.emit('task-drag-end', { taskId: draggedTask.id, projectId });
//         }
//         setDraggedTask(null);
//         setDraggedFrom(null);
//         setDragOverColumn(null);
//     };

//     // ── Task created ──────────────────────────────────────────────────────────
//     const handleTaskCreated = (newTask) => {
//         addTaskToColumn(newTask);
//         setShowCreateTaskModal(false);
//         // Backend controller will emit 'task-created' to room —
//         // other users will see it automatically
//     };

//     return (
//         <div className="min-h-screen bg-gray-50">
//             <Header />

//             <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//                 {/* Page Header */}
//                 <div className="flex items-center justify-between mb-8">
//                     <button
//                         onClick={() => setShowCreateTaskModal(true)}
//                         className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm"
//                     >
//                         <Plus className="w-4 h-4" />
//                         Add Task
//                     </button>

//                     {/* Socket connection badge */}
//                     <div className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${isConnected
//                         ? 'bg-green-50 text-green-700 border border-green-200'
//                         : 'bg-gray-100 text-gray-500 border border-gray-200'
//                         }`}>
//                         {isConnected
//                             ? <><Wifi className="w-3.5 h-3.5" /> Live</>
//                             : <><WifiOff className="w-3.5 h-3.5" /> Offline</>
//                         }
//                     </div>
//                 </div>

//                 {/* Loading */}
//                 {loading && (
//                     <div className="flex items-center justify-center py-12">
//                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//                     </div>
//                 )}

//                 {/* Error */}
//                 {error && (
//                     <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
//                         <p className="font-medium">Error loading tasks</p>
//                         <p className="text-sm">{error}</p>
//                     </div>
//                 )}

//                 {/* Kanban Board */}
//                 {!loading && (
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                         {Object.values(columns).map((column) => (
//                             <div
//                                 key={column.id}
//                                 className={`
//                                     ${column.bgColor} rounded-2xl p-4 transition-all duration-200
//                                     ${dragOverColumn === column.id
//                                         ? 'ring-2 ring-blue-400 ring-offset-2 scale-[1.01]'
//                                         : ''}
//                                 `}
//                                 onDragOver={(e) => handleDragOver(e, column.id)}
//                                 onDragLeave={handleDragLeave}
//                                 onDrop={() => handleDrop(column.id)}
//                             >
//                                 {/* Column Header */}
//                                 <div className="flex items-center justify-between mb-4">
//                                     <div className="flex items-center gap-2">
//                                         <div className={`w-3 h-3 rounded-full ${column.dotColor}`}></div>
//                                         <h3 className="font-bold text-gray-900">{column.title}</h3>
//                                     </div>
//                                     <span className="bg-white px-2.5 py-1 rounded-full text-sm font-semibold text-gray-700">
//                                         {column.tasks.length}
//                                     </span>
//                                 </div>

//                                 {/* Tasks */}
//                                 <div className="space-y-3 min-h-[60px]">
//                                     {column.tasks.map((task) => {
//                                         const isDraggingByOther = draggingUsers[task.id];
//                                         const isBeingDragged = draggedTask?.id === task.id;

//                                         return (
//                                             <div
//                                                 key={task.id}
//                                                 draggable
//                                                 onDragStart={() => handleDragStart(task, column.id)}
//                                                 onDragEnd={handleDragEnd}
//                                                 className={`
//                                                     bg-white rounded-xl p-4 shadow-sm hover:shadow-md
//                                                     transition-all cursor-move select-none
//                                                     ${isBeingDragged ? 'opacity-40 scale-95' : ''}
//                                                     ${isDraggingByOther ? 'ring-2 ring-yellow-400 ring-offset-1' : ''}
//                                                 `}
//                                             >
//                                                 {/* Other user dragging indicator */}
//                                                 {isDraggingByOther && (
//                                                     <p className="text-xs text-yellow-600 font-medium mb-2">
//                                                         ✋ {isDraggingByOther} is moving this
//                                                     </p>
//                                                 )}

//                                                 {/* Task Header */}
//                                                 <div className="flex items-start justify-between mb-3">
//                                                     <h4 className={`font-bold text-gray-900 text-sm leading-snug ${task.completed ? 'line-through text-gray-400' : ''}`}>
//                                                         {task.title}
//                                                     </h4>
//                                                     {task.priority && (
//                                                         <span className={`${task.priorityColor} px-2.5 py-1 rounded-md text-xs font-semibold ml-2 flex-shrink-0`}>
//                                                             {task.priority}
//                                                         </span>
//                                                     )}
//                                                 </div>

//                                                 {/* Description */}
//                                                 {task.description && (
//                                                     <p className={`text-sm text-gray-600 mb-3 line-clamp-2 ${task.completed ? 'text-gray-400' : ''}`}>
//                                                         {task.description}
//                                                     </p>
//                                                 )}

//                                                 {/* Progress Bar */}
//                                                 {task.progress !== undefined && (
//                                                     <div className="mb-3">
//                                                         <div className="flex items-center justify-between mb-1">
//                                                             <span className="text-xs font-medium text-gray-700">Progress</span>
//                                                             <span className="text-xs font-semibold text-gray-900">{task.progress}%</span>
//                                                         </div>
//                                                         <div className="w-full bg-gray-200 rounded-full h-2">
//                                                             <div
//                                                                 className="bg-blue-500 h-2 rounded-full transition-all"
//                                                                 style={{ width: `${task.progress}%` }}
//                                                             />
//                                                         </div>
//                                                     </div>
//                                                 )}

//                                                 {/* Task Footer */}
//                                                 <div className="flex items-center justify-between">
//                                                     <div className="flex items-center gap-2">
//                                                         <span className="text-sm">{task.assignee}</span>
//                                                         {task.tag && (
//                                                             <span className={`${task.tagColor} px-2.5 py-1 rounded-md text-xs font-medium`}>
//                                                                 {task.tag}
//                                                             </span>
//                                                         )}
//                                                     </div>
//                                                     {task.dueDate && (
//                                                         <span className="text-xs text-gray-500">{task.dueDate}</span>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         );
//                                     })}

//                                     {/* Empty column drop hint */}
//                                     {column.tasks.length === 0 && (
//                                         <div className={`
//                                             border-2 border-dashed rounded-xl p-4 text-center text-sm text-gray-400 transition-colors
//                                             ${dragOverColumn === column.id ? 'border-blue-400 bg-blue-50 text-blue-500' : 'border-gray-300'}
//                                         `}>
//                                             {dragOverColumn === column.id ? 'Drop here' : 'No tasks'}
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </main>

//             {showCreateTaskModal && (
//                 <CreateTaskModal
//                     onClose={() => setShowCreateTaskModal(false)}
//                     onTaskCreated={handleTaskCreated}
//                 />
//             )}
//         </div>
//     );
// };

// export default Kanban;




import { useState, useEffect, useRef } from 'react';
import { Plus, Wifi, WifiOff } from 'lucide-react';
import Header from '../components/Header';
import CreateTaskModal from '../components/tasks/CreateTaskModal';
import { useTasks } from '../context/TaskContext';
import { useSocket } from '../context/SocketContext';
import toast from 'react-hot-toast';

const Kanban = () => {
    const { socket, isConnected } = useSocket();

    const {
        columns,
        loading,
        error,
        moveTask,
        updateTaskStatus,
        addTaskToColumn,
        applySocketTaskUpdate,
        applySocketTaskCreated,
        applySocketTaskDeleted,
    } = useTasks();

    const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
    const [dragOverColumn, setDragOverColumn] = useState(null);
    const [draggingUsers, setDraggingUsers] = useState({});

    // ── useRef for drag state (prevents stale closure bugs) ──────────────────
    const draggedTaskRef = useRef(null);
    const draggedFromRef = useRef(null);
    // useState just for visual opacity effect on dragged card
    const [draggedTaskId, setDraggedTaskId] = useState(null);

    const projectId = localStorage.getItem('currentProjectId');

    // Get current user id once
    const getCurrentUserId = () => {
        try {
            return JSON.parse(localStorage.getItem('user') || '{}')._id;
        } catch { return null; }
    };

    // ── Socket listeners ──────────────────────────────────────────────────────
    useEffect(() => {
        if (!socket || !projectId) return;

        socket.emit('join-project', projectId);

        // Task created by ANOTHER user — skip own (already added locally)
        socket.on('task-created', ({ task, createdBy }) => {
            if (createdBy?._id === getCurrentUserId()) return;
            applySocketTaskCreated(task);
            toast(`New task: "${task.title}"`, { icon: '✅', duration: 3000 });
        });

        // Task updated/moved by ANOTHER user — skip own drag (already moved optimistically)
        socket.on('task-updated', ({ task, updatedBy }) => {
            if (updatedBy?._id === getCurrentUserId()) return;
            applySocketTaskUpdate(task);
        });

        // Task deleted by ANOTHER user
        socket.on('task-deleted', ({ taskId, deletedBy }) => {
            if (deletedBy?._id === getCurrentUserId()) return;
            applySocketTaskDeleted(taskId);
            toast('A task was removed', { icon: '🗑️', duration: 2000 });
        });

        // Drag presence indicators
        socket.on('task-dragging', ({ taskId, name }) => {
            setDraggingUsers(prev => ({ ...prev, [taskId]: name }));
        });

        socket.on('task-drag-end', ({ taskId }) => {
            setDraggingUsers(prev => {
                const next = { ...prev };
                delete next[taskId];
                return next;
            });
        });

        return () => {
            socket.emit('leave-project', projectId);
            socket.off('task-created');
            socket.off('task-updated');
            socket.off('task-deleted');
            socket.off('task-dragging');
            socket.off('task-drag-end');
        };
    }, [socket, projectId]);

    // ── Column → API status map ───────────────────────────────────────────────
    const columnStatusMap = {
        'todo': 'todo',
        'inProgress': 'in-progress',
        'review': 'review',
        'done': 'done',
    };

    // ── Drag handlers (using refs — immune to stale state) ────────────────────
    const handleDragStart = (task, columnId) => {
        draggedTaskRef.current = task;
        draggedFromRef.current = columnId;
        setDraggedTaskId(task.id); // for visual fade only
        socket?.emit('task-dragging', { taskId: task.id, projectId });
    };

    const handleDragOver = (e, columnId) => {
        e.preventDefault();
        setDragOverColumn(columnId);
    };

    const handleDragLeave = () => {
        setDragOverColumn(null);
    };

    const handleDragEnd = () => {
        if (draggedTaskRef.current) {
            socket?.emit('task-drag-end', {
                taskId: draggedTaskRef.current.id,
                projectId
            });
        }
        draggedTaskRef.current = null;
        draggedFromRef.current = null;
        setDraggedTaskId(null);
        setDragOverColumn(null);
    };

    // const handleDrop = async (targetColumnId) => {
    //     setDragOverColumn(null);

    //     // Read from refs — guaranteed to have the correct values
    //     const task = draggedTaskRef.current;
    //     const fromCol = draggedFromRef.current;

    //     // Clear refs and visual state
    //     draggedTaskRef.current = null;
    //     draggedFromRef.current = null;
    //     setDraggedTaskId(null);

    //     if (!task || fromCol === targetColumnId) return;

    //     const taskId = task.id;
    //     const newStatus = columnStatusMap[targetColumnId];

    //     // 1. ✅ Move card instantly (optimistic UI)
    //     moveTask(taskId, fromCol, targetColumnId);

    //     // 2. Tell others drag ended
    //     socket?.emit('task-drag-end', { taskId, projectId });

    //     // 3. Persist to backend
    //     try {
    //         await updateTaskStatus(taskId, newStatus);
    //     } catch (error) {
    //         console.error('Failed to move task, reverting');
    //         toast.error('Failed to move task');
    //         moveTask(taskId, targetColumnId, fromCol); // revert
    //     }
    // };

    const handleDrop = async (targetColumnId) => {
        setDragOverColumn(null);

        // ✅ Read from REF — always has correct value
        const task = draggedTaskRef.current;
        const fromCol = draggedFromRef.current;

        // Clear ref and visual state
        draggedTaskRef.current = null;
        draggedFromRef.current = null;
        setDraggedTaskId(null);

        if (!task || !task.id || fromCol === targetColumnId) return;

        const taskId = task.id;  // ← guaranteed to be valid string
        const newStatus = columnStatusMap[targetColumnId];

        console.log('✅ Drop:', taskId, fromCol, '→', targetColumnId, newStatus);

        // 1. Optimistic move
        moveTask(taskId, fromCol, targetColumnId);

        // 2. Notify others
        socket?.emit('task-drag-end', { taskId, projectId });

        // 3. Persist
        try {
            await updateTaskStatus(taskId, newStatus);
        } catch (error) {
            console.error('Reverting move');
            toast.error('Failed to move task');
            moveTask(taskId, targetColumnId, fromCol);
        }
    };
    const handleTaskCreated = (newTask) => {
        addTaskToColumn(newTask);
        setShowCreateTaskModal(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => setShowCreateTaskModal(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Add Task
                    </button>

                    {/* Live / Offline badge */}
                    <div className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${isConnected
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-gray-100 text-gray-500 border border-gray-200'
                        }`}>
                        {isConnected
                            ? <><Wifi className="w-3.5 h-3.5" /> Live</>
                            : <><WifiOff className="w-3.5 h-3.5" /> Offline</>
                        }
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                        <p className="font-medium">Error loading tasks</p>
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {/* Kanban Board */}
                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {Object.values(columns).map((column) => (
                            <div
                                key={column.id}
                                className={`
                                    ${column.bgColor} rounded-2xl p-4 transition-all duration-200
                                    ${dragOverColumn === column.id
                                        ? 'ring-2 ring-blue-400 ring-offset-2 scale-[1.01]'
                                        : ''}
                                `}
                                onDragOver={(e) => handleDragOver(e, column.id)}
                                onDragLeave={handleDragLeave}
                                onDrop={() => handleDrop(column.id)}
                            >
                                {/* Column Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${column.dotColor}`} />
                                        <h3 className="font-bold text-gray-900">{column.title}</h3>
                                    </div>
                                    <span className="bg-white px-2.5 py-1 rounded-full text-sm font-semibold text-gray-700">
                                        {column.tasks.length}
                                    </span>
                                </div>

                                {/* Tasks */}
                                <div className="space-y-3 min-h-[60px]">
                                    {column.tasks.map((task) => {
                                        const isDraggingByOther = draggingUsers[task.id];
                                        const isBeingDragged = draggedTaskId === task.id;

                                        return (
                                            <div
                                                key={task.id}
                                                draggable
                                                onDragStart={() => handleDragStart(task, column.id)}
                                                onDragEnd={handleDragEnd}
                                                className={`
                                                    bg-white rounded-xl p-4 shadow-sm hover:shadow-md
                                                    transition-all cursor-move select-none
                                                    ${isBeingDragged ? 'opacity-40 scale-95' : 'opacity-100'}
                                                    ${isDraggingByOther ? 'ring-2 ring-yellow-400 ring-offset-1' : ''}
                                                `}
                                            >
                                                {/* Other user dragging indicator */}
                                                {isDraggingByOther && (
                                                    <p className="text-xs text-yellow-600 font-medium mb-2">
                                                        ✋ {isDraggingByOther} is moving this
                                                    </p>
                                                )}

                                                {/* Task Header */}
                                                <div className="flex items-start justify-between mb-3">
                                                    <h4 className={`font-bold text-gray-900 text-sm leading-snug ${task.completed ? 'line-through text-gray-400' : ''}`}>
                                                        {task.title}
                                                    </h4>
                                                    {task.priority && (
                                                        <span className={`${task.priorityColor} px-2.5 py-1 rounded-md text-xs font-semibold ml-2 flex-shrink-0`}>
                                                            {task.priority}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Description */}
                                                {task.description && (
                                                    <p className={`text-sm text-gray-600 mb-3 line-clamp-2 ${task.completed ? 'text-gray-400' : ''}`}>
                                                        {task.description}
                                                    </p>
                                                )}

                                                {/* Progress Bar */}
                                                {task.progress !== undefined && task.progress > 0 && (
                                                    <div className="mb-3">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-xs font-medium text-gray-700">Progress</span>
                                                            <span className="text-xs font-semibold text-gray-900">{task.progress}%</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-blue-500 h-2 rounded-full transition-all"
                                                                style={{ width: `${task.progress}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Task Footer */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm">{task.assignee}</span>
                                                        {task.tag && (
                                                            <span className={`${task.tagColor} px-2.5 py-1 rounded-md text-xs font-medium`}>
                                                                {task.tag}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {task.dueDate && (
                                                        <span className="text-xs text-gray-500">{task.dueDate}</span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* Empty column hint */}
                                    {column.tasks.length === 0 && (
                                        <div className={`
                                            border-2 border-dashed rounded-xl p-4 text-center text-sm text-gray-400 transition-colors
                                            ${dragOverColumn === column.id
                                                ? 'border-blue-400 bg-blue-50 text-blue-500'
                                                : 'border-gray-300'}
                                        `}>
                                            {dragOverColumn === column.id ? 'Drop here' : 'No tasks'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {showCreateTaskModal && (
                <CreateTaskModal
                    onClose={() => setShowCreateTaskModal(false)}
                    onTaskCreated={handleTaskCreated}
                />
            )}
        </div>
    );
};

export default Kanban;