import React, { useState } from 'react';
import { Brain, TrendingUp, AlertCircle, Loader2, ThumbsUp, ThumbsDown } from 'lucide-react';
import axios from 'axios';

const AIPrioritySuggestion = ({ taskId, taskData, onApply, compact = false }) => {
    const [suggestion, setSuggestion] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showSuggestion, setShowSuggestion] = useState(false);

    const getPrioritySuggestion = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.post('/api/ai/suggest-priority', {
                taskId,
                taskData
            });

            setSuggestion(response.data.suggestion);
            setShowSuggestion(true);
        } catch (err) {
            console.error('Priority suggestion error:', err);
            setError(err.response?.data?.message || 'Failed to get AI suggestion');
        } finally {
            setLoading(false);
        }
    };

    const handleApplySuggestion = () => {
        if (suggestion && onApply) {
            onApply(suggestion.priority);
            setShowSuggestion(false);
        }
    };

    const handleDismiss = () => {
        setShowSuggestion(false);
        setSuggestion(null);
    };

    const getPriorityColor = (priority) => {
        const colors = {
            'Critical': 'bg-red-100 text-red-800 border-red-300',
            'High': 'bg-orange-100 text-orange-800 border-orange-300',
            'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-300',
            'Low': 'bg-green-100 text-green-800 border-green-300'
        };
        return colors[priority] || colors['Medium'];
    };

    const getPriorityIcon = (priority) => {
        const icons = {
            'Critical': '🔴',
            'High': '🟠',
            'Medium': '🟡',
            'Low': '🟢'
        };
        return icons[priority] || '⚪';
    };

    if (compact) {
        return (
            <div className="inline-block">
                <button
                    onClick={getPrioritySuggestion}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-100 to-indigo-100 hover:from-purple-200 hover:to-indigo-200 text-purple-700 rounded-lg text-sm font-medium transition-all duration-200 border border-purple-300 disabled:opacity-50"
                    title="Get AI priority suggestion"
                >
                    {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Brain className="w-4 h-4" />
                    )}
                    AI Suggest
                </button>

                {showSuggestion && suggestion && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-slideUp">
                            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                                        <Brain className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-white font-bold text-lg">AI Priority Suggestion</h3>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="mb-5">
                                    <p className="text-gray-600 text-sm mb-3">Recommended Priority</p>
                                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${getPriorityColor(suggestion.priority)}`}>
                                        <span className="text-2xl">{getPriorityIcon(suggestion.priority)}</span>
                                        <span className="font-bold text-lg">{suggestion.priority}</span>
                                    </div>
                                </div>

                                <div className="mb-5">
                                    <h4 className="font-semibold text-gray-900 mb-2">Reasoning</h4>
                                    <p className="text-gray-700 leading-relaxed">{suggestion.reasoning}</p>
                                </div>

                                {suggestion.riskFactors && suggestion.riskFactors.length > 0 && (
                                    <div className="mb-5 bg-amber-50 border border-amber-200 rounded-lg p-4">
                                        <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4" />
                                            Risk Factors
                                        </h4>
                                        <ul className="space-y-1">
                                            {suggestion.riskFactors.map((risk, idx) => (
                                                <li key={idx} className="text-amber-800 text-sm flex items-start gap-2">
                                                    <span className="text-amber-500 mt-0.5">•</span>
                                                    <span>{risk}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {suggestion.suggestedAdjustments && (
                                    <div className="mb-5 bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <h4 className="font-semibold text-blue-900 mb-2">Suggested Adjustments</h4>
                                        <p className="text-blue-800 text-sm">{suggestion.suggestedAdjustments}</p>
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <button
                                        onClick={handleApplySuggestion}
                                        className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                                    >
                                        <ThumbsUp className="w-4 h-4" />
                                        Apply Suggestion
                                    </button>
                                    <button
                                        onClick={handleDismiss}
                                        className="px-4 py-3 border border-gray-300 hover:border-gray-400 text-gray-700 rounded-lg font-medium transition-all duration-200"
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Full Card View
    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                        <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg">AI Priority Assistant</h3>
                        <p className="text-purple-100 text-sm">Get intelligent priority recommendations</p>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {!showSuggestion ? (
                    <div className="text-center py-8">
                        <div className="bg-gradient-to-br from-purple-100 to-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <TrendingUp className="w-10 h-10 text-purple-600" />
                        </div>
                        <h4 className="text-gray-900 font-semibold mb-2">Analyze Task Priority</h4>
                        <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                            Our AI will analyze task dependencies, deadlines, and team workload to suggest the optimal priority level.
                        </p>
                        <button
                            onClick={getPrioritySuggestion}
                            disabled={loading}
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 inline-flex items-center gap-2 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Brain className="w-5 h-5" />
                                    Get AI Suggestion
                                </>
                            )}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-5">
                        <div>
                            <p className="text-gray-600 text-sm mb-3">Recommended Priority</p>
                            <div className={`inline-flex items-center gap-3 px-5 py-3 rounded-xl border-2 ${getPriorityColor(suggestion.priority)}`}>
                                <span className="text-3xl">{getPriorityIcon(suggestion.priority)}</span>
                                <span className="font-bold text-xl">{suggestion.priority}</span>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-5">
                            <h4 className="font-semibold text-gray-900 mb-3">AI Analysis</h4>
                            <p className="text-gray-700 leading-relaxed">{suggestion.reasoning}</p>
                        </div>

                        {suggestion.riskFactors && suggestion.riskFactors.length > 0 && (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
                                <h4 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5" />
                                    Identified Risk Factors
                                </h4>
                                <ul className="space-y-2">
                                    {suggestion.riskFactors.map((risk, idx) => (
                                        <li key={idx} className="text-amber-800 flex items-start gap-3">
                                            <span className="bg-amber-200 text-amber-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                                                {idx + 1}
                                            </span>
                                            <span>{risk}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {suggestion.suggestedAdjustments && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                                <h4 className="font-semibold text-blue-900 mb-3">Timeline Suggestions</h4>
                                <p className="text-blue-800">{suggestion.suggestedAdjustments}</p>
                            </div>
                        )}

                        <div className="flex gap-3 pt-3">
                            <button
                                onClick={handleApplySuggestion}
                                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                            >
                                <ThumbsUp className="w-5 h-5" />
                                Apply This Priority
                            </button>
                            <button
                                onClick={handleDismiss}
                                className="px-6 py-3 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2"
                            >
                                <ThumbsDown className="w-5 h-5" />
                                Dismiss
                            </button>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-red-700">{error}</p>
                    </div>
                )}
            </div>

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
        </div>
    );
};

export default AIPrioritySuggestion;