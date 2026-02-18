import React, { useState } from 'react';
import { Wand2, Loader2, CheckCircle, XCircle, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';

const AITaskGenerator = ({ projectId, onTaskCreated }) => {
    const [briefInput, setBriefInput] = useState('');
    const [generatedTask, setGeneratedTask] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    const handleGenerate = async () => {
        if (!briefInput.trim()) {
            setError('Please enter a task description');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await axios.post('/api/ai/generate-description', {
                briefInput: briefInput.trim(),
                projectId
            });

            setGeneratedTask(response.data.description);
            setShowDetails(true);
        } catch (err) {
            console.error('Task generation error:', err);
            setError(err.response?.data?.message || 'Failed to generate task details');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = () => {
        if (generatedTask && onTaskCreated) {
            onTaskCreated({
                title: briefInput,
                description: generatedTask.description,
                acceptanceCriteria: generatedTask.acceptanceCriteria,
                subtasks: generatedTask.subtasks,
                estimatedHours: generatedTask.estimatedHours,
                requiredSkills: generatedTask.requiredSkills,
                potentialBlockers: generatedTask.potentialBlockers
            });

            // Reset form
            setBriefInput('');
            setGeneratedTask(null);
            setShowDetails(false);
        }
    };

    const handleReset = () => {
        setGeneratedTask(null);
        setShowDetails(false);
        setError(null);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg">AI Task Generator</h3>
                        <p className="text-purple-100 text-sm">Describe your task briefly, AI will do the rest</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Input Section */}
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2 text-sm">
                        What needs to be done?
                    </label>
                    <textarea
                        value={briefInput}
                        onChange={(e) => setBriefInput(e.target.value)}
                        placeholder="E.g., Implement user authentication with email and password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all"
                        rows="3"
                        disabled={loading}
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                        <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 mb-6">
                    <button
                        onClick={handleGenerate}
                        disabled={loading || !briefInput.trim()}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Wand2 className="w-5 h-5" />
                                Generate with AI
                            </>
                        )}
                    </button>

                    {generatedTask && (
                        <button
                            onClick={handleReset}
                            className="px-6 py-3 border border-gray-300 hover:border-gray-400 text-gray-700 rounded-lg font-medium transition-all duration-200"
                        >
                            Reset
                        </button>
                    )}
                </div>

                {/* Generated Task Details */}
                {generatedTask && (
                    <div className="space-y-4 animate-fadeIn">
                        {/* Description */}
                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-5 border border-purple-200">
                            <h4 className="text-gray-900 font-semibold mb-2 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-purple-600" />
                                Generated Description
                            </h4>
                            <p className="text-gray-700 leading-relaxed">{generatedTask.description}</p>
                        </div>

                        {/* Collapsible Details */}
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <button
                                onClick={() => setShowDetails(!showDetails)}
                                className="w-full px-5 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors"
                            >
                                <span className="font-medium text-gray-700">View Full Details</span>
                                {showDetails ? (
                                    <ChevronUp className="w-5 h-5 text-gray-500" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-500" />
                                )}
                            </button>

                            {showDetails && (
                                <div className="p-5 space-y-5">
                                    {/* Acceptance Criteria */}
                                    <div>
                                        <h5 className="font-semibold text-gray-900 mb-3">Acceptance Criteria</h5>
                                        <ul className="space-y-2">
                                            {generatedTask.acceptanceCriteria?.map((criteria, idx) => (
                                                <li key={idx} className="flex items-start gap-3">
                                                    <span className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                                                        {idx + 1}
                                                    </span>
                                                    <span className="text-gray-700">{criteria}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Subtasks */}
                                    <div>
                                        <h5 className="font-semibold text-gray-900 mb-3">Suggested Subtasks</h5>
                                        <div className="space-y-3">
                                            {generatedTask.subtasks?.map((subtask, idx) => (
                                                <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                                                    <h6 className="font-medium text-gray-900 mb-1">{subtask.title}</h6>
                                                    <p className="text-gray-600 text-sm">{subtask.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Estimated Hours */}
                                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                            <p className="text-blue-700 text-sm font-medium mb-1">Estimated Effort</p>
                                            <p className="text-2xl font-bold text-blue-900">
                                                {generatedTask.estimatedHours} hours
                                            </p>
                                        </div>

                                        {/* Required Skills */}
                                        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                                            <p className="text-purple-700 text-sm font-medium mb-2">Required Skills</p>
                                            <div className="flex flex-wrap gap-2">
                                                {generatedTask.requiredSkills?.map((skill, idx) => (
                                                    <span key={idx} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Potential Blockers */}
                                    {generatedTask.potentialBlockers && generatedTask.potentialBlockers.length > 0 && (
                                        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                                            <h5 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                                Potential Blockers
                                            </h5>
                                            <ul className="space-y-2">
                                                {generatedTask.potentialBlockers.map((blocker, idx) => (
                                                    <li key={idx} className="text-amber-800 flex items-start gap-2">
                                                        <span className="text-amber-500 mt-1">•</span>
                                                        <span>{blocker}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Create Task Button */}
                        <button
                            onClick={handleCreateTask}
                            className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                        >
                            <CheckCircle className="w-5 h-5" />
                            Create Task with AI Details
                        </button>
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
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
        </div>
    );
};

export default AITaskGenerator;