// import { useState } from 'react';
// import { Bell, User } from 'lucide-react';

// const Dashboard = () => {
//     const [activeTab, setActiveTab] = useState('Dashboard');

//     // Stats data
//     const stats = [
//         {
//             id: 1,
//             icon: '📋',
//             bgColor: 'bg-blue-100',
//             value: '127',
//             label: 'Total Tasks',
//             trend: '+12%',
//             trendColor: 'text-green-500'
//         },
//         {
//             id: 2,
//             icon: '✓',
//             bgColor: 'bg-green-100',
//             value: '89',
//             label: 'Completed',
//             trend: '+8%',
//             trendColor: 'text-green-500'
//         },
//         {
//             id: 3,
//             icon: '⏱️',
//             bgColor: 'bg-orange-100',
//             value: '15',
//             label: 'In Progress',
//             trend: '23',
//             trendColor: 'text-orange-500'
//         },
//         {
//             id: 4,
//             icon: '👥',
//             bgColor: 'bg-purple-100',
//             value: '24',
//             label: 'Team Members',
//             trend: '8',
//             trendColor: 'text-blue-500'
//         }
//     ];

//     // AI Insights data
//     const insights = [
//         {
//             id: 1,
//             icon: '⚡',
//             bgColor: 'bg-blue-400/30',
//             title: 'High Priority Alert',
//             description: '3 tasks need attention'
//         },
//         {
//             id: 2,
//             icon: '📊',
//             bgColor: 'bg-purple-400/30',
//             title: 'Workload Balance',
//             description: 'Consider redistributing'
//         },
//         {
//             id: 3,
//             icon: '🎯',
//             bgColor: 'bg-pink-400/30',
//             title: 'On Track',
//             description: '85% complete'
//         }
//     ];

//     return (
//         <div className="min-h-screen bg-gray-50">
//             {/* Header */}
//             <header className="bg-white border-b border-gray-200">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="flex items-center justify-between h-16">
//                         {/* Logo and Brand */}
//                         <div className="flex items-center gap-3">
//                             <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">
//                                 T
//                             </div>
//                             <h1 className="text-xl font-bold text-gray-900">TaskFlow AI</h1>
//                         </div>

//                         {/* Navigation */}
//                         <nav className="hidden md:flex items-center gap-1">
//                             {['Dashboard', 'Kanban', 'Login'].map((tab) => (
//                                 <button
//                                     key={tab}
//                                     onClick={() => setActiveTab(tab)}
//                                     className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === tab
//                                             ? 'bg-blue-50 text-blue-600'
//                                             : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//                                         }`}
//                                 >
//                                     {tab}
//                                 </button>
//                             ))}
//                         </nav>

//                         {/* Right Side Icons */}
//                         <div className="flex items-center gap-4">
//                             <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
//                                 <Bell className="w-5 h-5 text-gray-600" />
//                                 <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
//                             </button>
//                             <button className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors">
//                                 <User className="w-5 h-5 text-gray-600" />
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </header>

//             {/* Main Content */}
//             <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//                 {/* Stats Grid */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                     {stats.map((stat) => (
//                         <div
//                             key={stat.id}
//                             className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
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

//                 {/* AI Insights Section */}
//                 <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 rounded-3xl p-8 shadow-lg relative overflow-hidden">
//                     {/* Background decoration */}
//                     <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
//                     <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>

//                     <div className="relative z-10">
//                         {/* Header */}
//                         <div className="flex items-center gap-3 mb-3">
//                             <div className="text-3xl">🤖</div>
//                             <h2 className="text-2xl font-bold text-white">AI Insights</h2>
//                         </div>
//                         <p className="text-blue-100 mb-8 text-sm">
//                             Based on your team's performance and current workload
//                         </p>

//                         {/* Insights Cards */}
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                             {insights.map((insight) => (
//                                 <div
//                                     key={insight.id}
//                                     className={`${insight.bgColor} backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all cursor-pointer`}
//                                 >
//                                     <div className="text-4xl mb-4">{insight.icon}</div>
//                                     <h3 className="text-white font-bold text-lg mb-2">
//                                         {insight.title}
//                                     </h3>
//                                     <p className="text-blue-50 text-sm">
//                                         {insight.description}
//                                     </p>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </main>
//         </div>
//     );
// };

// export default Dashboard;


import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useEffect } from 'react';
import Header from './Header';
const Dashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        // console.log(user.user.name, 'user-198');

    }, [])
    // Stats data
    const stats = [
        {
            id: 1,
            icon: '📋',
            bgColor: 'bg-blue-100',
            value: '127',
            label: 'Total Tasks',
            trend: '+12%',
            trendColor: 'text-green-500'
        },
        {
            id: 2,
            icon: '✓',
            bgColor: 'bg-green-100',
            value: '89',
            label: 'Completed',
            trend: '+8%',
            trendColor: 'text-green-500'
        },
        {
            id: 3,
            icon: '⏱️',
            bgColor: 'bg-orange-100',
            value: '15',
            label: 'In Progress',
            trend: '23',
            trendColor: 'text-orange-500'
        },
        {
            id: 4,
            icon: '👥',
            bgColor: 'bg-purple-100',
            value: '24',
            label: 'Team Members',
            trend: '8',
            trendColor: 'text-blue-500'
        }
    ];

    // AI Insights data
    const insights = [
        {
            id: 1,
            icon: '⚡',
            bgColor: 'bg-blue-400/30',
            title: 'High Priority Alert',
            description: '3 tasks need attention'
        },
        {
            id: 2,
            icon: '📊',
            bgColor: 'bg-purple-400/30',
            title: 'Workload Balance',
            description: 'Consider redistributing'
        },
        {
            id: 3,
            icon: '🎯',
            bgColor: 'bg-pink-400/30',
            title: 'On Track',
            description: '85% complete'
        }
    ];

    // Navigation handler
    const handleTabClick = (tab) => {
        setActiveTab(tab);

        // Navigate to different routes based on tab
        if (tab === 'Dashboard') {
            navigate('/dashboard');
        } else if (tab === 'Kanban') {
            navigate('/kanban-board');
        }
    };

    // Logout handler
    const handleLogout = async () => {
        await logout();
        navigate('/login');
        setShowDropdown(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <Header />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
                    {stats.map((stat) => (
                        <div
                            key={stat.id}
                            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`${stat.bgColor} w-10 h-10 rounded-xl flex items-center justify-center text-2xl`}>
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

                {/* AI Insights Section */}
                <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 rounded-3xl p-8 shadow-lg relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>

                    <div className="relative z-10">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-3">
                            <div className="text-3xl">🤖</div>
                            <h2 className="text-2xl font-bold text-white">AI Insights</h2>
                        </div>
                        <p className="text-blue-100 mb-8 text-sm">
                            Based on your team's performance and current workload
                        </p>

                        {/* Insights Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {insights.map((insight) => (
                                <div
                                    key={insight.id}
                                    className={`${insight.bgColor} backdrop-blur-sm rounded-2xl p-4 hover:bg-white/20 transition-all cursor-pointer`}
                                >
                                    <div className="text-4xl mb-2">{insight.icon}</div>
                                    <h3 className="text-white font-bold text-lg mb-2">
                                        {insight.title}
                                    </h3>
                                    <p className="text-blue-50 text-sm">
                                        {insight.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;