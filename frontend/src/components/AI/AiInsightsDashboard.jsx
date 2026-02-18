// import React, { useState, useEffect } from 'react';
// import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, Calendar, Users } from 'lucide-react';
// import axios from 'axios';
// import fetchProjectInsights from '../../context/AIContext.js';

// const AIInsightsDashboard = ({ projectId }) => {
//     const [insights, setInsights] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         fetchInsights();
//     }, [projectId]);

//     const fetchInsights = async () => {
//         try {
//             setLoading(true);
//             // const response = await axios.get(`${import.meta.env.VITE_API_URL}/ai/project-insights/${projectId}`);
//             const response = await fetchProjectInsights();
//             console.log(response, 'res-20');
//             setInsights(response.data.insights);
//             setError(null);
//         } catch (err) {
//             console.error('Failed to fetch AI insights:', err);
//             setError('Failed to load AI insights');
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (loading) {
//         return (
//             <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-8 shadow-xl">
//                 <div className="flex items-center gap-3 mb-6">
//                     <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
//                         <Sparkles className="w-6 h-6 text-white animate-pulse" />
//                     </div>
//                     <div>
//                         <h3 className="text-white font-bold text-xl">AI Insights</h3>
//                         <p className="text-white/80 text-sm">Analyzing your project data...</p>
//                     </div>
//                 </div>
//                 <div className="space-y-4">
//                     {[1, 2].map((i) => (
//                         <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 animate-pulse">
//                             <div className="h-4 bg-white/20 rounded w-3/4 mb-3"></div>
//                             <div className="h-3 bg-white/20 rounded w-full"></div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl p-8 shadow-xl">
//                 <div className="flex items-center gap-3">
//                     <AlertTriangle className="w-6 h-6 text-white" />
//                     <p className="text-white font-medium">{error}</p>
//                 </div>
//             </div>
//         );
//     }

//     if (!insights) return null;

//     const getRiskColor = (level) => {
//         const colors = {
//             'Critical': 'bg-red-500/20 border-red-400 text-red-100',
//             'High': 'bg-orange-500/20 border-orange-400 text-orange-100',
//             'Medium': 'bg-yellow-500/20 border-yellow-400 text-yellow-100',
//             'Low': 'bg-green-500/20 border-green-400 text-green-100'
//         };
//         return colors[level] || colors['Medium'];
//     };

//     return (
//         <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-8 shadow-xl relative overflow-hidden">
//             {/* Animated background elements */}
//             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
//             <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

//             <div className="relative z-10">
//                 {/* Header */}
//                 <div className="flex items-center justify-between mb-8">
//                     <div className="flex items-center gap-3">
//                         <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
//                             <Sparkles className="w-6 h-6 text-white" />
//                         </div>
//                         <div>
//                             <h3 className="text-white font-bold text-2xl">AI Insights</h3>
//                             <p className="text-white/80 text-sm">Based on your team's performance and current workload</p>
//                         </div>
//                     </div>
//                     <button
//                         onClick={fetchInsights}
//                         className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium"
//                     >
//                         Refresh
//                     </button>
//                 </div>

//                 {/* Main Insights Grid */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                     {/* Workload Balance */}
//                     <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
//                         <div className="flex items-start gap-4">
//                             <div className="bg-white/20 p-3 rounded-lg">
//                                 <Users className="w-5 h-5 text-white" />
//                             </div>
//                             <div className="flex-1">
//                                 <h4 className="text-white font-semibold text-lg mb-2">Workload Balance</h4>
//                                 <p className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 ${insights.workloadBalance?.status === 'Balanced'
//                                     ? 'bg-green-500/30 text-green-100'
//                                     : 'bg-orange-500/30 text-orange-100'
//                                     }`}>
//                                     {insights.workloadBalance?.status}
//                                 </p>
//                                 <p className="text-white/90 text-sm leading-relaxed">
//                                     {insights.workloadBalance?.message}
//                                 </p>
//                                 {insights.workloadBalance?.overloadedMembers?.length > 0 && (
//                                     <div className="mt-3 bg-white/10 rounded-lg p-3">
//                                         <p className="text-white/70 text-xs mb-1">Overloaded members:</p>
//                                         <div className="flex flex-wrap gap-2">
//                                             {insights.workloadBalance.overloadedMembers.map((member, idx) => (
//                                                 <span key={idx} className="bg-red-500/30 text-red-100 px-2 py-1 rounded text-xs">
//                                                     {member}
//                                                 </span>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Completion Rate */}
//                     <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
//                         <div className="flex items-start gap-4">
//                             <div className="bg-white/20 p-3 rounded-lg">
//                                 <TrendingUp className="w-5 h-5 text-white" />
//                             </div>
//                             <div className="flex-1">
//                                 <h4 className="text-white font-semibold text-lg mb-2">On Track</h4>
//                                 <div className="flex items-baseline gap-3 mb-3">
//                                     <span className="text-4xl font-bold text-white">
//                                         {insights.completionRate?.current}%
//                                     </span>
//                                     <span className={`text-sm font-medium ${insights.completionRate?.trend === 'Improving'
//                                         ? 'text-green-200'
//                                         : insights.completionRate?.trend === 'Declining'
//                                             ? 'text-red-200'
//                                             : 'text-white/70'
//                                         }`}>
//                                         {insights.completionRate?.trend}
//                                     </span>
//                                 </div>
//                                 <p className="text-white/90 text-sm leading-relaxed">
//                                     {insights.completionRate?.message}
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Velocity */}
//                 <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-6">
//                     <div className="flex items-center gap-3 mb-4">
//                         <Calendar className="w-5 h-5 text-white" />
//                         <h4 className="text-white font-semibold text-lg">Team Velocity</h4>
//                     </div>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         <div>
//                             <p className="text-white/70 text-sm mb-1">Tasks per week</p>
//                             <p className="text-3xl font-bold text-white">{insights.velocity?.tasksPerWeek}</p>
//                         </div>
//                         <div>
//                             <p className="text-white/70 text-sm mb-1">Trend</p>
//                             <p className="text-xl font-semibold text-white">{insights.velocity?.trend}</p>
//                         </div>
//                         <div>
//                             <p className="text-white/70 text-sm mb-1">Comparison</p>
//                             <p className="text-sm text-white/90">{insights.velocity?.comparison}</p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Risk Areas */}
//                 {insights.riskAreas && insights.riskAreas.length > 0 && (
//                     <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-6">
//                         <div className="flex items-center gap-3 mb-4">
//                             <AlertTriangle className="w-5 h-5 text-white" />
//                             <h4 className="text-white font-semibold text-lg">Risk Areas</h4>
//                         </div>
//                         <div className="space-y-3">
//                             {insights.riskAreas.map((risk, idx) => (
//                                 <div
//                                     key={idx}
//                                     className={`border-l-4 pl-4 py-3 rounded-r-lg ${getRiskColor(risk.severity)}`}
//                                 >
//                                     <div className="flex items-start justify-between mb-2">
//                                         <p className="font-medium">{risk.area}</p>
//                                         <span className="text-xs px-2 py-1 bg-white/20 rounded">
//                                             {risk.severity}
//                                         </span>
//                                     </div>
//                                     <p className="text-sm opacity-90">{risk.recommendation}</p>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 )}

//                 {/* Suggestions */}
//                 {insights.suggestions && insights.suggestions.length > 0 && (
//                     <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-6">
//                         <div className="flex items-center gap-3 mb-4">
//                             <Lightbulb className="w-5 h-5 text-white" />
//                             <h4 className="text-white font-semibold text-lg">AI Suggestions</h4>
//                         </div>
//                         <div className="space-y-3">
//                             {insights.suggestions.map((suggestion, idx) => (
//                                 <div key={idx} className="bg-white/5 rounded-lg p-4 border border-white/10">
//                                     <div className="flex items-start gap-3">
//                                         <span className="bg-white/20 text-white text-xs px-2 py-1 rounded mt-1">
//                                             {suggestion.type}
//                                         </span>
//                                         <div className="flex-1">
//                                             <p className="text-white font-medium mb-1">{suggestion.suggestion}</p>
//                                             <p className="text-white/70 text-sm">{suggestion.expectedImpact}</p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 )}

//                 {/* Predicted Completion */}
//                 {insights.predictedCompletion && (
//                     <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/20">
//                         <h4 className="text-white font-semibold text-lg mb-3">Predicted Completion</h4>
//                         <div className="flex items-center gap-4">
//                             <div className="flex-1">
//                                 <p className="text-white/70 text-sm mb-1">Expected completion date</p>
//                                 <p className="text-2xl font-bold text-white">
//                                     {new Date(insights.predictedCompletion.date).toLocaleDateString('en-US', {
//                                         month: 'long',
//                                         day: 'numeric',
//                                         year: 'numeric'
//                                     })}
//                                 </p>
//                             </div>
//                             <div className="text-right">
//                                 <p className="text-white/70 text-sm mb-1">Confidence</p>
//                                 <p className={`text-lg font-semibold ${insights.predictedCompletion.confidence === 'High'
//                                     ? 'text-green-200'
//                                     : insights.predictedCompletion.confidence === 'Low'
//                                         ? 'text-red-200'
//                                         : 'text-yellow-200'
//                                     }`}>
//                                     {insights.predictedCompletion.confidence}
//                                 </p>
//                             </div>
//                         </div>
//                         <p className="text-white/80 text-sm mt-3 leading-relaxed">
//                             {insights.predictedCompletion.reasoning}
//                         </p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default AIInsightsDashboard;



import React, { useEffect } from 'react';
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, Calendar, Users } from 'lucide-react';
import { useAI } from '../../context/AIContext';

const AIInsightsDashboard = ({ projectId }) => {
    const {
        projectInsights,
        insightsLoading,
        error,
        fetchProjectInsights
    } = useAI();

    useEffect(() => {
        if (projectId) {
            // Fetch insights when component mounts or projectId changes
            fetchProjectInsights(projectId, { silent: true });
        }
    }, [projectId, fetchProjectInsights]);

    if (insightsLoading) {
        return (
            <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                        <Sparkles className="w-6 h-6 text-white animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-xl">AI Insights</h3>
                        <p className="text-white/80 text-sm">Analyzing your project data...</p>
                    </div>
                </div>
                <div className="space-y-4">
                    {[1, 2].map((i) => (
                        <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 animate-pulse">
                            <div className="h-4 bg-white/20 rounded w-3/4 mb-3"></div>
                            <div className="h-3 bg-white/20 rounded w-full"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error && !projectInsights) {
        return (
            <div className="bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-6 h-6 text-white" />
                    <div className="flex-1">
                        <h3 className="text-white font-bold text-lg">Unable to Load AI Insights</h3>
                        <p className="text-white/80 text-sm">{error}</p>
                    </div>
                </div>
                <button
                    onClick={() => fetchProjectInsights(projectId)}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (!projectInsights) {
        return (
            <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 rounded-3xl p-8 shadow-lg">
                <div className="text-center text-white">
                    <div className="text-4xl mb-4">🤖</div>
                    <h3 className="text-xl font-bold mb-2">AI Insights</h3>
                    <p className="text-blue-100 mb-6">
                        {projectId
                            ? 'Loading insights for your project...'
                            : 'Select a project to see AI-powered insights'
                        }
                    </p>
                    {projectId && (
                        <button
                            onClick={() => fetchProjectInsights(projectId)}
                            className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
                        >
                            Load Insights
                        </button>
                    )}
                </div>
            </div>
        );
    }

    const getRiskColor = (level) => {
        const colors = {
            'Critical': 'bg-red-500/20 border-red-400 text-red-100',
            'High': 'bg-orange-500/20 border-orange-400 text-orange-100',
            'Medium': 'bg-yellow-500/20 border-yellow-400 text-yellow-100',
            'Low': 'bg-green-500/20 border-green-400 text-green-100'
        };
        return colors[level] || colors['Medium'];
    };

    return (
        <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-8 shadow-xl relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-2xl">AI Insights</h3>
                            <p className="text-white/80 text-sm">Powered by Groq AI - Based on your team's performance</p>
                        </div>
                    </div>
                    <button
                        onClick={() => fetchProjectInsights(projectId)}
                        disabled={insightsLoading}
                        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {insightsLoading ? 'Refreshing...' : 'Refresh'}
                    </button>
                </div>

                {/* Main Insights Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Workload Balance */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                        <div className="flex items-start gap-4">
                            <div className="bg-white/20 p-3 rounded-lg">
                                <Users className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-white font-semibold text-lg mb-2">Workload Balance</h4>
                                <p className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 ${projectInsights.workloadBalance?.status === 'Balanced'
                                        ? 'bg-green-500/30 text-green-100'
                                        : 'bg-orange-500/30 text-orange-100'
                                    }`}>
                                    {projectInsights.workloadBalance?.status}
                                </p>
                                <p className="text-white/90 text-sm leading-relaxed">
                                    {projectInsights.workloadBalance?.message}
                                </p>
                                {projectInsights.workloadBalance?.overloadedMembers?.length > 0 && (
                                    <div className="mt-3 bg-white/10 rounded-lg p-3">
                                        <p className="text-white/70 text-xs mb-1">Overloaded members:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {projectInsights.workloadBalance.overloadedMembers.map((member, idx) => (
                                                <span key={idx} className="bg-red-500/30 text-red-100 px-2 py-1 rounded text-xs">
                                                    {member}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Completion Rate */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                        <div className="flex items-start gap-4">
                            <div className="bg-white/20 p-3 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-white font-semibold text-lg mb-2">Progress Status</h4>
                                <div className="flex items-baseline gap-3 mb-3">
                                    <span className="text-4xl font-bold text-white">
                                        {projectInsights.completionRate?.current || 0}%
                                    </span>
                                    <span className={`text-sm font-medium ${projectInsights.completionRate?.trend === 'Improving'
                                            ? 'text-green-200'
                                            : projectInsights.completionRate?.trend === 'Declining'
                                                ? 'text-red-200'
                                                : 'text-white/70'
                                        }`}>
                                        {projectInsights.completionRate?.trend}
                                    </span>
                                </div>
                                <p className="text-white/90 text-sm leading-relaxed">
                                    {projectInsights.completionRate?.message}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Velocity */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Calendar className="w-5 h-5 text-white" />
                        <h4 className="text-white font-semibold text-lg">Team Velocity</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-white/70 text-sm mb-1">Tasks per week</p>
                            <p className="text-3xl font-bold text-white">
                                {projectInsights.velocity?.tasksPerWeek || 0}
                            </p>
                        </div>
                        <div>
                            <p className="text-white/70 text-sm mb-1">Trend</p>
                            <p className="text-xl font-semibold text-white">
                                {projectInsights.velocity?.trend || 'N/A'}
                            </p>
                        </div>
                        <div>
                            <p className="text-white/70 text-sm mb-1">Comparison</p>
                            <p className="text-sm text-white/90">
                                {projectInsights.velocity?.comparison || 'No data'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Risk Areas */}
                {projectInsights.riskAreas && projectInsights.riskAreas.length > 0 && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertTriangle className="w-5 h-5 text-white" />
                            <h4 className="text-white font-semibold text-lg">Risk Areas</h4>
                        </div>
                        <div className="space-y-3">
                            {projectInsights.riskAreas.map((risk, idx) => (
                                <div
                                    key={idx}
                                    className={`border-l-4 pl-4 py-3 rounded-r-lg ${getRiskColor(risk.severity)}`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <p className="font-medium">{risk.area}</p>
                                        <span className="text-xs px-2 py-1 bg-white/20 rounded">
                                            {risk.severity}
                                        </span>
                                    </div>
                                    <p className="text-sm opacity-90">{risk.recommendation}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Suggestions */}
                {projectInsights.suggestions && projectInsights.suggestions.length > 0 && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Lightbulb className="w-5 h-5 text-white" />
                            <h4 className="text-white font-semibold text-lg">AI Suggestions</h4>
                        </div>
                        <div className="space-y-3">
                            {projectInsights.suggestions.map((suggestion, idx) => (
                                <div key={idx} className="bg-white/5 rounded-lg p-4 border border-white/10">
                                    <div className="flex items-start gap-3">
                                        <span className="bg-white/20 text-white text-xs px-2 py-1 rounded mt-1">
                                            {suggestion.type}
                                        </span>
                                        <div className="flex-1">
                                            <p className="text-white font-medium mb-1">{suggestion.suggestion}</p>
                                            <p className="text-white/70 text-sm">{suggestion.expectedImpact}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Predicted Completion */}
                {projectInsights.predictedCompletion && projectInsights.predictedCompletion.date !== 'Unknown' && (
                    <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                        <h4 className="text-white font-semibold text-lg mb-3">Predicted Completion</h4>
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <p className="text-white/70 text-sm mb-1">Expected completion date</p>
                                <p className="text-2xl font-bold text-white">
                                    {new Date(projectInsights.predictedCompletion.date).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-white/70 text-sm mb-1">Confidence</p>
                                <p className={`text-lg font-semibold ${projectInsights.predictedCompletion.confidence === 'High'
                                        ? 'text-green-200'
                                        : projectInsights.predictedCompletion.confidence === 'Low'
                                            ? 'text-red-200'
                                            : 'text-yellow-200'
                                    }`}>
                                    {projectInsights.predictedCompletion.confidence}
                                </p>
                            </div>
                        </div>
                        <p className="text-white/80 text-sm mt-3 leading-relaxed">
                            {projectInsights.predictedCompletion.reasoning}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIInsightsDashboard;