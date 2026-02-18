// // import { useState } from 'react';
// // import { Bell, User } from 'lucide-react';

// // const Dashboard = () => {
// //     const [activeTab, setActiveTab] = useState('Dashboard');

// //     // Stats data
// //     const stats = [
// //         {
// //             id: 1,
// //             icon: '📋',
// //             bgColor: 'bg-blue-100',
// //             value: '127',
// //             label: 'Total Tasks',
// //             trend: '+12%',
// //             trendColor: 'text-green-500'
// //         },
// //         {
// //             id: 2,
// //             icon: '✓',
// //             bgColor: 'bg-green-100',
// //             value: '89',
// //             label: 'Completed',
// //             trend: '+8%',
// //             trendColor: 'text-green-500'
// //         },
// //         {
// //             id: 3,
// //             icon: '⏱️',
// //             bgColor: 'bg-orange-100',
// //             value: '15',
// //             label: 'In Progress',
// //             trend: '23',
// //             trendColor: 'text-orange-500'
// //         },
// //         {
// //             id: 4,
// //             icon: '👥',
// //             bgColor: 'bg-purple-100',
// //             value: '24',
// //             label: 'Team Members',
// //             trend: '8',
// //             trendColor: 'text-blue-500'
// //         }
// //     ];

// //     // AI Insights data
// //     const insights = [
// //         {
// //             id: 1,
// //             icon: '⚡',
// //             bgColor: 'bg-blue-400/30',
// //             title: 'High Priority Alert',
// //             description: '3 tasks need attention'
// //         },
// //         {
// //             id: 2,
// //             icon: '📊',
// //             bgColor: 'bg-purple-400/30',
// //             title: 'Workload Balance',
// //             description: 'Consider redistributing'
// //         },
// //         {
// //             id: 3,
// //             icon: '🎯',
// //             bgColor: 'bg-pink-400/30',
// //             title: 'On Track',
// //             description: '85% complete'
// //         }
// //     ];

// //     return (
// //         <div className="min-h-screen bg-gray-50">
// //             {/* Header */}
// //             <header className="bg-white border-b border-gray-200">
// //                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// //                     <div className="flex items-center justify-between h-16">
// //                         {/* Logo and Brand */}
// //                         <div className="flex items-center gap-3">
// //                             <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">
// //                                 T
// //                             </div>
// //                             <h1 className="text-xl font-bold text-gray-900">TaskFlow AI</h1>
// //                         </div>

// //                         {/* Navigation */}
// //                         <nav className="hidden md:flex items-center gap-1">
// //                             {['Dashboard', 'Kanban', 'Login'].map((tab) => (
// //                                 <button
// //                                     key={tab}
// //                                     onClick={() => setActiveTab(tab)}
// //                                     className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === tab
// //                                             ? 'bg-blue-50 text-blue-600'
// //                                             : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
// //                                         }`}
// //                                 >
// //                                     {tab}
// //                                 </button>
// //                             ))}
// //                         </nav>

// //                         {/* Right Side Icons */}
// //                         <div className="flex items-center gap-4">
// //                             <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
// //                                 <Bell className="w-5 h-5 text-gray-600" />
// //                                 <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
// //                             </button>
// //                             <button className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors">
// //                                 <User className="w-5 h-5 text-gray-600" />
// //                             </button>
// //                         </div>
// //                     </div>
// //                 </div>
// //             </header>

// //             {/* Main Content */}
// //             <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// //                 {/* Stats Grid */}
// //                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
// //                     {stats.map((stat) => (
// //                         <div
// //                             key={stat.id}
// //                             className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
// //                         >
// //                             <div className="flex items-start justify-between mb-4">
// //                                 <div className={`${stat.bgColor} w-14 h-14 rounded-xl flex items-center justify-center text-2xl`}>
// //                                     {stat.icon}
// //                                 </div>
// //                                 <span className={`${stat.trendColor} text-sm font-semibold`}>
// //                                     {stat.trend}
// //                                 </span>
// //                             </div>
// //                             <div className="text-3xl font-bold text-gray-900 mb-1">
// //                                 {stat.value}
// //                             </div>
// //                             <div className="text-gray-600 text-sm font-medium">
// //                                 {stat.label}
// //                             </div>
// //                         </div>
// //                     ))}
// //                 </div>

// //                 {/* AI Insights Section */}
// //                 <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 rounded-3xl p-8 shadow-lg relative overflow-hidden">
// //                     {/* Background decoration */}
// //                     <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
// //                     <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>

// //                     <div className="relative z-10">
// //                         {/* Header */}
// //                         <div className="flex items-center gap-3 mb-3">
// //                             <div className="text-3xl">🤖</div>
// //                             <h2 className="text-2xl font-bold text-white">AI Insights</h2>
// //                         </div>
// //                         <p className="text-blue-100 mb-8 text-sm">
// //                             Based on your team's performance and current workload
// //                         </p>

// //                         {/* Insights Cards */}
// //                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //                             {insights.map((insight) => (
// //                                 <div
// //                                     key={insight.id}
// //                                     className={`${insight.bgColor} backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all cursor-pointer`}
// //                                 >
// //                                     <div className="text-4xl mb-4">{insight.icon}</div>
// //                                     <h3 className="text-white font-bold text-lg mb-2">
// //                                         {insight.title}
// //                                     </h3>
// //                                     <p className="text-blue-50 text-sm">
// //                                         {insight.description}
// //                                     </p>
// //                                 </div>
// //                             ))}
// //                         </div>
// //                     </div>
// //                 </div>
// //             </main>
// //         </div>
// //     );
// // };

// // export default Dashboard;


// // import { useState, useContext } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { Bell } from 'lucide-react';
// // import { AuthContext } from '../context/AuthContext';
// // import { useEffect } from 'react';
// // import Header from './Header';
// // const Dashboard = () => {
// //     const navigate = useNavigate();
// //     const { user, logout } = useContext(AuthContext);
// //     const [activeTab, setActiveTab] = useState('Dashboard');
// //     const [showDropdown, setShowDropdown] = useState(false);

// //     useEffect(() => {
// //         // console.log(user.user.name, 'user-198');

// //     }, [])
// //     // Stats data
// //     const stats = [
// //         {
// //             id: 1,
// //             icon: '📋',
// //             bgColor: 'bg-blue-100',
// //             value: '127',
// //             label: 'Total Tasks',
// //             trend: '+12%',
// //             trendColor: 'text-green-500'
// //         },
// //         {
// //             id: 2,
// //             icon: '✓',
// //             bgColor: 'bg-green-100',
// //             value: '89',
// //             label: 'Completed',
// //             trend: '+8%',
// //             trendColor: 'text-green-500'
// //         },
// //         {
// //             id: 3,
// //             icon: '⏱️',
// //             bgColor: 'bg-orange-100',
// //             value: '15',
// //             label: 'In Progress',
// //             trend: '23',
// //             trendColor: 'text-orange-500'
// //         },
// //         {
// //             id: 4,
// //             icon: '👥',
// //             bgColor: 'bg-purple-100',
// //             value: '24',
// //             label: 'Team Members',
// //             trend: '8',
// //             trendColor: 'text-blue-500'
// //         }
// //     ];

// //     // AI Insights data
// //     const insights = [
// //         {
// //             id: 1,
// //             icon: '⚡',
// //             bgColor: 'bg-blue-400/30',
// //             title: 'High Priority Alert',
// //             description: '3 tasks need attention'
// //         },
// //         {
// //             id: 2,
// //             icon: '📊',
// //             bgColor: 'bg-purple-400/30',
// //             title: 'Workload Balance',
// //             description: 'Consider redistributing'
// //         },
// //         {
// //             id: 3,
// //             icon: '🎯',
// //             bgColor: 'bg-pink-400/30',
// //             title: 'On Track',
// //             description: '85% complete'
// //         }
// //     ];

// //     // Navigation handler
// //     const handleTabClick = (tab) => {
// //         setActiveTab(tab);

// //         // Navigate to different routes based on tab
// //         if (tab === 'Dashboard') {
// //             navigate('/dashboard');
// //         } else if (tab === 'Kanban') {
// //             navigate('/kanban-board');
// //         }
// //     };

// //     // Logout handler
// //     const handleLogout = async () => {
// //         await logout();
// //         navigate('/login');
// //         setShowDropdown(false);
// //     };

// //     return (
// //         <div className="min-h-screen bg-gray-50">
// //             {/* Header */}
// //             <Header />

// //             {/* Main Content */}
// //             <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
// //                 {/* Stats Grid */}
// //                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
// //                     {stats.map((stat) => (
// //                         <div
// //                             key={stat.id}
// //                             className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
// //                         >
// //                             <div className="flex items-start justify-between mb-4">
// //                                 <div className={`${stat.bgColor} w-10 h-10 rounded-xl flex items-center justify-center text-2xl`}>
// //                                     {stat.icon}
// //                                 </div>
// //                                 <span className={`${stat.trendColor} text-sm font-semibold`}>
// //                                     {stat.trend}
// //                                 </span>
// //                             </div>
// //                             <div className="text-3xl font-bold text-gray-900 mb-1">
// //                                 {stat.value}
// //                             </div>
// //                             <div className="text-gray-600 text-sm font-medium">
// //                                 {stat.label}
// //                             </div>
// //                         </div>
// //                     ))}
// //                 </div>

// //                 {/* AI Insights Section */}
// //                 <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 rounded-3xl p-8 shadow-lg relative overflow-hidden">
// //                     {/* Background decoration */}
// //                     <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
// //                     <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>

// //                     <div className="relative z-10">
// //                         {/* Header */}
// //                         <div className="flex items-center gap-3 mb-3">
// //                             <div className="text-3xl">🤖</div>
// //                             <h2 className="text-2xl font-bold text-white">AI Insights</h2>
// //                         </div>
// //                         <p className="text-blue-100 mb-8 text-sm">
// //                             Based on your team's performance and current workload
// //                         </p>

// //                         {/* Insights Cards */}
// //                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //                             {insights.map((insight) => (
// //                                 <div
// //                                     key={insight.id}
// //                                     className={`${insight.bgColor} backdrop-blur-sm rounded-2xl p-4 hover:bg-white/20 transition-all cursor-pointer`}
// //                                 >
// //                                     <div className="text-4xl mb-2">{insight.icon}</div>
// //                                     <h3 className="text-white font-bold text-lg mb-2">
// //                                         {insight.title}
// //                                     </h3>
// //                                     <p className="text-blue-50 text-sm">
// //                                         {insight.description}
// //                                     </p>
// //                                 </div>
// //                             ))}
// //                         </div>
// //                     </div>
// //                 </div>
// //             </main>
// //         </div>
// //     );
// // };

// // export default Dashboard;



// import { useState, useContext, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';
// import { getDashboardStats } from '../services/dashboardService';
// import Header from './Header';
// import toast from 'react-hot-toast';
// import AIInsightsDashboard from './AI/AiInsightsDashboard';

// const Dashboard = () => {
//     const navigate = useNavigate();
//     const { user } = useContext(AuthContext);
//     const [stats, setStats] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         fetchDashboardStats();
//     }, []);

//     const fetchDashboardStats = async () => {
//         try {
//             setLoading(true);
//             const data = await getDashboardStats();
//             setStats(data.stats);
//         } catch (error) {
//             console.error('Failed to fetch dashboard stats:', error);
//             toast.error('Failed to load dashboard data');
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Calculate trends (you can enhance this with historical data)
//     const calculateTrend = (current, total) => {
//         if (total === 0) return '+0%';
//         const percentage = Math.round((current / total) * 100);
//         return `${percentage}%`;
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gray-50">
//                 <Header />
//                 <div className="flex items-center justify-center h-64">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//                 </div>
//             </div>
//         );
//     }

//     // Stats cards data (now using real data)
//     const statsCards = [
//         {
//             id: 1,
//             icon: '📋',
//             bgColor: 'bg-blue-100',
//             value: stats?.totalTasks || 0,
//             label: 'Total Tasks',
//             trend: stats?.recentTasksCount > 0 ? `+${stats.recentTasksCount}` : '0',
//             trendColor: 'text-green-500'
//         },
//         {
//             id: 2,
//             icon: '✓',
//             bgColor: 'bg-green-100',
//             value: stats?.completedTasks || 0,
//             label: 'Completed',
//             trend: `${stats?.completionRate || 0}%`,
//             trendColor: 'text-green-500'
//         },
//         {
//             id: 3,
//             icon: '⏱️',
//             bgColor: 'bg-orange-100',
//             value: stats?.inProgressTasks || 0,
//             label: 'In Progress',
//             trend: stats?.reviewTasks || 0,
//             trendColor: 'text-orange-500'
//         },
//         {
//             id: 4,
//             icon: '👥',
//             bgColor: 'bg-purple-100',
//             value: stats?.teamMembers || 0,
//             label: 'Team Members',
//             trend: stats?.todoTasks || 0,
//             trendColor: 'text-blue-500'
//         }
//     ];

//     // AI Insights (using real data)
//     const insights = [
//         {
//             id: 1,
//             icon: '⚡',
//             bgColor: 'bg-blue-400/30',
//             title: 'High Priority Alert',
//             description: `${stats?.highPriorityTasks || 0} tasks need attention`,
//             show: stats?.highPriorityTasks > 0
//         },
//         {
//             id: 2,
//             icon: '📊',
//             bgColor: 'bg-purple-400/30',
//             title: stats?.overdueTasks > 0 ? 'Overdue Tasks' : 'Workload Balance',
//             description: stats?.overdueTasks > 0
//                 ? `${stats.overdueTasks} tasks are overdue`
//                 : 'Everything on track',
//             show: true
//         },
//         {
//             id: 3,
//             icon: '🎯',
//             bgColor: 'bg-pink-400/30',
//             title: stats?.completionRate >= 80 ? 'Excellent Progress!' : 'On Track',
//             description: `${stats?.completionRate || 0}% completion rate`,
//             show: true
//         }
//     ].filter(insight => insight.show);

//     return (
//         <div className="min-h-screen bg-gray-50">
//             {/* Header */}
//             <Header />

//             {/* Main Content */}
//             <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//                 {/* Welcome Message */}
//                 <div className="mb-6">
//                     <h1 className="text-3xl font-bold text-gray-900">
//                         Welcome back, {user?.name || user?.user?.name || 'User'}! 👋
//                     </h1>
//                     <p className="text-gray-600 mt-1">
//                         Here's what's happening with your projects today.
//                     </p>
//                 </div>

//                 {/* Stats Grid */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                     {statsCards.map((stat) => (
//                         <div
//                             key={stat.id}
//                             className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
//                             onClick={() => {
//                                 // Navigate to relevant section
//                                 if (stat.label === 'Total Tasks') navigate('/tasks');
//                             }}
//                         >
//                             <div className="flex items-start justify-between mb-4">
//                                 <div className={`${stat.bgColor} w-14 h-14 rounded-xl flex items-center justify-center text-2xl`}>
//                                     {stat.icon}
//                                 </div>
//                                 <span className={`${stat.trendColor} text-sm font-semibold`}>
//                                     {stat.trend}
//                                 </span>
//                             </div>
//                             <div className="text-3xl font-bold text-gray-900 mb-1">
//                                 {stat.value}
//                             </div>
//                             <div className="text-gray-600 text-sm font-medium">
//                                 {stat.label}
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 {/* Quick Actions */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//                     <button
//                         onClick={() => navigate('/tasks')}
//                         className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all text-left group"
//                     >
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <h3 className="font-semibold text-gray-900 mb-1">View All Tasks</h3>
//                                 <p className="text-sm text-gray-600">Manage your tasks</p>
//                             </div>
//                             <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
//                             </svg>
//                         </div>
//                     </button>

//                     <button
//                         onClick={() => navigate('/projects')}
//                         className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all text-left group"
//                     >
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <h3 className="font-semibold text-gray-900 mb-1">Projects</h3>
//                                 <p className="text-sm text-gray-600">View your projects</p>
//                             </div>
//                             <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
//                             </svg>
//                         </div>
//                     </button>

//                     <button
//                         onClick={() => navigate('/kanban-board')}
//                         className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all text-left group"
//                     >
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <h3 className="font-semibold text-gray-900 mb-1">Kanban Board</h3>
//                                 <p className="text-sm text-gray-600">Drag & drop tasks</p>
//                             </div>
//                             <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
//                             </svg>
//                         </div>
//                     </button>
//                 </div>

//                 {/* AI Insights Section */}
//                 <AIInsightsDashboard />

//                 {/* Empty State */}
//                 {stats?.totalTasks === 0 && (
//                     <div className="text-center py-12 bg-white rounded-xl shadow-sm mt-8">
//                         <div className="text-6xl mb-4">🚀</div>
//                         <h3 className="text-xl font-semibold text-gray-700 mb-2">
//                             Get Started with TaskFlow AI
//                         </h3>
//                         <p className="text-gray-500 mb-6">
//                             Create your first project and start managing tasks
//                         </p>
//                         <div className="flex gap-4 justify-center">
//                             <button
//                                 onClick={() => navigate('/projects')}
//                                 className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//                             >
//                                 Create Project
//                             </button>
//                             <button
//                                 onClick={() => navigate('/tasks')}
//                                 className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
//                             >
//                                 Create Task
//                             </button>
//                         </div>
//                     </div>
//                 )}
//             </main>
//         </div>
//     );
// };

// export default Dashboard;




import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getDashboardStats } from '../services/dashboardService';
import Header from './Header';
import toast from 'react-hot-toast';
import AIInsightsDashboard from './AI/AiInsightsDashboard';
import axios from 'axios';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentProjectId, setCurrentProjectId] = useState(null);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch dashboard stats
            const statsData = await getDashboardStats();
            setStats(statsData.stats);

            // Fetch user's projects
            await fetchUserProjects();

        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserProjects = async () => {
        try {
            const token = localStorage.getItem('token');
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

            const response = await axios.get(`${API_URL}/projects`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success && response.data.projects) {
                const userProjects = response.data.projects;
                setProjects(userProjects);

                // Set current project ID
                if (userProjects.length > 0) {
                    // Try to get saved project ID from localStorage
                    const savedProjectId = localStorage.getItem('currentProjectId');

                    // Check if saved project ID exists in user's projects
                    const projectExists = userProjects.find(p => p._id === savedProjectId);

                    if (projectExists) {
                        setCurrentProjectId(savedProjectId);
                    } else {
                        // Use first project
                        const firstProjectId = userProjects[0]._id;
                        setCurrentProjectId(firstProjectId);
                        localStorage.setItem('currentProjectId', firstProjectId);
                    }
                }
            }
        } catch (error) {
            console.error('Failed to fetch projects:', error);
            // Don't show error toast for projects - it's optional
        }
    };

    const handleProjectChange = (projectId) => {
        setCurrentProjectId(projectId);
        localStorage.setItem('currentProjectId', projectId);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    // Stats cards data
    const statsCards = [
        {
            id: 1,
            icon: '📋',
            bgColor: 'bg-blue-100',
            value: stats?.totalTasks || 0,
            label: 'Total Tasks',
            trend: stats?.recentTasksCount > 0 ? `+${stats.recentTasksCount}` : '0',
            trendColor: 'text-green-500'
        },
        {
            id: 2,
            icon: '✓',
            bgColor: 'bg-green-100',
            value: stats?.completedTasks || 0,
            label: 'Completed',
            trend: `${stats?.completionRate || 0}%`,
            trendColor: 'text-green-500'
        },
        {
            id: 3,
            icon: '⏱️',
            bgColor: 'bg-orange-100',
            value: stats?.inProgressTasks || 0,
            label: 'In Progress',
            trend: stats?.reviewTasks || 0,
            trendColor: 'text-orange-500'
        },
        {
            id: 4,
            icon: '👥',
            bgColor: 'bg-purple-100',
            value: stats?.teamMembers || 0,
            label: 'Team Members',
            trend: stats?.todoTasks || 0,
            trendColor: 'text-blue-500'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <Header />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                {/* Welcome Message */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome back, {user?.name || user?.user?.name || 'User'}! 👋
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Here's what's happening with your projects today.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statsCards.map((stat) => (
                        <div
                            key={stat.id}
                            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => {
                                if (stat.label === 'Total Tasks') navigate('/tasks');
                            }}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`${stat.bgColor} w-14 h-14 rounded-xl flex items-center justify-center text-2xl`}>
                                    {stat.icon}
                                </div>
                                <span className={`${stat.trendColor} text-sm font-semibold`}>
                                    {stat.trend}
                                </span>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">
                                {stat.value}
                            </div>
                            <div className="text-gray-600 text-sm font-medium">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Project Selector (if multiple projects) */}
                {projects.length > 1 && (
                    <div className="mb-6 bg-white rounded-xl p-4 shadow-sm">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Project for AI Insights:
                        </label>
                        <select
                            value={currentProjectId || ''}
                            onChange={(e) => handleProjectChange(e.target.value)}
                            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            <option value="">Choose a project...</option>
                            {projects.map((project) => (
                                <option key={project._id} value={project._id}>
                                    {project.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <button
                        onClick={() => navigate('/tasks')}
                        className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all text-left group"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">View All Tasks</h3>
                                <p className="text-sm text-gray-600">Manage your tasks</p>
                            </div>
                            <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </button>

                    <button
                        onClick={() => navigate('/projects')}
                        className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all text-left group"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">Projects</h3>
                                <p className="text-sm text-gray-600">View your projects</p>
                            </div>
                            <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </button>

                    <button
                        onClick={() => navigate('/kanban-board')}
                        className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all text-left group"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">Kanban Board</h3>
                                <p className="text-sm text-gray-600">Drag & drop tasks</p>
                            </div>
                            <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </button>
                </div>

                {/* AI Insights Dashboard */}
                {currentProjectId ? (
                    <AIInsightsDashboard projectId={currentProjectId} />
                ) : projects.length === 0 ? (
                    // No projects exist - show create project prompt
                    <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 rounded-3xl p-8 shadow-lg">
                        <div className="text-center text-white">
                            <div className="text-4xl mb-4">🚀</div>
                            <h3 className="text-xl font-bold mb-2">Create Your First Project</h3>
                            <p className="text-blue-100 mb-6">
                                Start a project to see AI-powered insights
                            </p>
                            <button
                                onClick={() => navigate('/projects')}
                                className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
                            >
                                Create Project
                            </button>
                        </div>
                    </div>
                ) : (
                    // Projects exist but none selected - show in AIInsightsDashboard
                    <AIInsightsDashboard projectId={null} />
                )}

                {/* Empty State for New Users */}
                {stats?.totalTasks === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm mt-8">
                        <div className="text-6xl mb-4">📝</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            Get Started with TaskFlow AI
                        </h3>
                        <p className="text-gray-500 mb-6">
                            Create your first task to start managing your work
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => navigate('/projects')}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Create Project
                            </button>
                            <button
                                onClick={() => navigate('/tasks')}
                                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            >
                                Create Task
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;