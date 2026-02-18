import React, { useState } from 'react';
import { FileText, Sparkles, Loader2, CheckSquare, User, Calendar, AlertCircle, Plus } from 'lucide-react';
import axios from 'axios';

const MeetingNotesExtractor = ({ onTasksExtracted, className = '' }) => {
    const [meetingNotes, setMeetingNotes] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedItems, setSelectedItems] = useState(new Set());

    const handleExtract = async () => {
        if (!meetingNotes.trim()) {
            setError('Please enter meeting notes');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await axios.post('/api/ai/extract-action-items', {
                meetingNotes: meetingNotes.trim()
            });

            setResult(response.data.result);
            // Select all items by default
            const allIndices = new Set(response.data.result.actionItems.map((_, idx) => idx));
            setSelectedItems(allIndices);
        } catch (err) {
            console.error('Extract action items error:', err);
            setError(err.response?.data?.message || 'Failed to extract action items');
        } finally {
            setLoading(false);
        }
    };

    const toggleItemSelection = (index) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(index)) {
            newSelected.delete(index);
        } else {
            newSelected.add(index);
        }
        setSelectedItems(newSelected);
    };

    const handleCreateTasks = () => {
        if (result && onTasksExtracted) {
            const selectedActionItems = result.actionItems.filter((_, idx) => selectedItems.has(idx));
            onTasksExtracted(selectedActionItems, {
                summary: result.summary,
                keyDecisions: result.keyDecisions
            });

            // Reset
            setMeetingNotes('');
            setResult(null);
            setSelectedItems(new Set());
        }
    };

    const handleReset = () => {
        setResult(null);
        setSelectedItems(new Set());
        setError(null);
    };

    const getPriorityColor = (priority) => {
        const colors = {
            'High': 'bg-red-50 border-red-300 text-red-700',
            'Medium': 'bg-yellow-50 border-yellow-300 text-yellow-700',
            'Low': 'bg-green-50 border-green-300 text-green-700'
        };
        return colors[priority] || colors['Medium'];
    };

    const sampleNotes = `Team Standup - Jan 15, 2024

Attendees: Sarah, John, Mike, Emily

Updates:
- Sarah completed the login page redesign
- John is working on API integration, needs help with authentication
- Mike mentioned the database performance issue needs immediate attention
- Emily will review the PRs by end of week

Action Items:
- John to connect with DevOps team about authentication setup (High priority)
- Mike to investigate and fix database slow query issue by tomorrow
- Emily to complete code review of all pending PRs by Friday
- Sarah to create mockups for the dashboard redesign next week

Decisions Made:
- Moving to TypeScript for new features
- Weekly design review meetings every Monday at 10 AM`;

    return (
        <div className={`bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden ${className}`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                        <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-white font-bold text-lg">Meeting Notes Analyzer</h3>
                        <p className="text-white/90 text-sm">Extract action items automatically with AI</p>
                    </div>
                    <Sparkles className="w-5 h-5 text-white/70" />
                </div>
            </div>

            <div className="p-6">
                {!result ? (
                    <div className="space-y-4">
                        {/* Input Area */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">
                                Paste Meeting Notes
                            </label>
                            <textarea
                                value={meetingNotes}
                                onChange={(e) => setMeetingNotes(e.target.value)}
                                placeholder="Paste your meeting notes here... AI will extract action items, assignees, and deadlines automatically."
                                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-teal-500 rounded-xl resize-none transition-all outline-none min-h-[200px] text-gray-800 placeholder-gray-400"
                                disabled={loading}
                            />
                            <p className="text-gray-500 text-xs mt-2">
                                Include attendee names, tasks, deadlines, and any important decisions
                            </p>
                        </div>

                        {/* Sample Notes Button */}
                        <button
                            onClick={() => setMeetingNotes(sampleNotes)}
                            className="text-sm text-teal-600 hover:text-teal-700 font-medium underline"
                        >
                            Load sample meeting notes
                        </button>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Extract Button */}
                        <button
                            onClick={handleExtract}
                            disabled={loading || !meetingNotes.trim()}
                            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-400 text-white px-6 py-4 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Analyzing Meeting Notes...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    Extract Action Items with AI
                                </>
                            )}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6 animate-fadeIn">
                        {/* Meeting Summary */}
                        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-5 border-2 border-teal-200">
                            <h4 className="text-teal-900 font-bold mb-2 flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Meeting Summary
                            </h4>
                            <p className="text-teal-800 leading-relaxed">{result.summary}</p>
                        </div>

                        {/* Key Decisions */}
                        {result.keyDecisions && result.keyDecisions.length > 0 && (
                            <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
                                <h4 className="text-blue-900 font-semibold mb-3">Key Decisions Made</h4>
                                <ul className="space-y-2">
                                    {result.keyDecisions.map((decision, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <span className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                                                {idx + 1}
                                            </span>
                                            <span className="text-blue-900">{decision}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Action Items */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-gray-900 font-bold text-lg flex items-center gap-2">
                                    <CheckSquare className="w-5 h-5 text-teal-600" />
                                    Extracted Action Items ({result.actionItems.length})
                                </h4>
                                <button
                                    onClick={() => {
                                        if (selectedItems.size === result.actionItems.length) {
                                            setSelectedItems(new Set());
                                        } else {
                                            setSelectedItems(new Set(result.actionItems.map((_, idx) => idx)));
                                        }
                                    }}
                                    className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                                >
                                    {selectedItems.size === result.actionItems.length ? 'Deselect All' : 'Select All'}
                                </button>
                            </div>

                            <div className="space-y-3">
                                {result.actionItems.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className={`border-2 rounded-xl p-5 transition-all duration-200 cursor-pointer ${selectedItems.has(idx)
                                                ? 'border-teal-500 bg-teal-50/50 shadow-md'
                                                : 'border-gray-200 bg-white hover:border-gray-300'
                                            }`}
                                        onClick={() => toggleItemSelection(idx)}
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Checkbox */}
                                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-1 transition-all ${selectedItems.has(idx)
                                                    ? 'bg-teal-600 border-teal-600'
                                                    : 'bg-white border-gray-300'
                                                }`}>
                                                {selectedItems.has(idx) && (
                                                    <CheckSquare className="w-4 h-4 text-white" />
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1">
                                                {/* Title and Priority */}
                                                <div className="flex items-start justify-between gap-3 mb-3">
                                                    <h5 className="text-gray-900 font-bold text-lg flex-1">{item.title}</h5>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getPriorityColor(item.priority)}`}>
                                                        {item.priority}
                                                    </span>
                                                </div>

                                                {/* Description */}
                                                <p className="text-gray-700 mb-4 leading-relaxed">{item.description}</p>

                                                {/* Metadata Grid */}
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                    {/* Assignee */}
                                                    {item.assignee && (
                                                        <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-gray-200">
                                                            <User className="w-4 h-4 text-gray-600" />
                                                            <div>
                                                                <p className="text-xs text-gray-500">Assignee</p>
                                                                <p className="text-sm font-semibold text-gray-900">{item.assignee}</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Due Date */}
                                                    {item.dueDate && (
                                                        <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-gray-200">
                                                            <Calendar className="w-4 h-4 text-gray-600" />
                                                            <div>
                                                                <p className="text-xs text-gray-500">Due Date</p>
                                                                <p className="text-sm font-semibold text-gray-900">
                                                                    {new Date(item.dueDate).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Category */}
                                                    {item.category && (
                                                        <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-gray-200">
                                                            <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                                                            <div>
                                                                <p className="text-xs text-gray-500">Category</p>
                                                                <p className="text-sm font-semibold text-gray-900">{item.category}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Context */}
                                                {item.context && (
                                                    <div className="mt-3 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
                                                        <p className="text-xs text-gray-500 mb-1">Meeting Context</p>
                                                        <p className="text-sm text-gray-700 italic">{item.context}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={handleCreateTasks}
                                disabled={selectedItems.size === 0}
                                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-400 text-white px-6 py-4 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                            >
                                <Plus className="w-5 h-5" />
                                Create {selectedItems.size} Task{selectedItems.size !== 1 ? 's' : ''}
                            </button>
                            <button
                                onClick={handleReset}
                                className="px-6 py-4 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 rounded-xl font-bold transition-all duration-200"
                            >
                                Start Over
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
        </div>
    );
};

export default MeetingNotesExtractor;