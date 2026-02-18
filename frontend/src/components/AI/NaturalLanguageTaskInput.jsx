import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Sparkles, Loader2, Check, X, Calendar, User, Tag } from 'lucide-react';
import axios from 'axios';

const NaturalLanguageTaskInput = ({ workspaceId, onTaskCreated, className = '' }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [parsedTask, setParsedTask] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!input.trim()) return;

    try {
      setLoading(true);
      
      const response = await axios.post('/api/ai/parse-task', {
        input: input.trim(),
        workspaceId
      });

      setParsedTask(response.data.parsedTask);
      setShowPreview(true);
    } catch (err) {
      console.error('Parse task error:', err);
      alert(err.response?.data?.message || 'Failed to parse task');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = () => {
    if (parsedTask && onTaskCreated) {
      onTaskCreated(parsedTask);
      
      // Reset
      setInput('');
      setParsedTask(null);
      setShowPreview(false);
    }
  };

  const handleCancel = () => {
    setParsedTask(null);
    setShowPreview(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Critical': 'bg-red-100 text-red-700 border-red-300',
      'High': 'bg-orange-100 text-orange-700 border-orange-300',
      'Medium': 'bg-yellow-100 text-yellow-700 border-yellow-300',
      'Low': 'bg-green-100 text-green-700 border-green-300'
    };
    return colors[priority] || colors['Medium'];
  };

  const examplePrompts = [
    "Remind me to review the marketing deck by Friday and assign it to Sarah",
    "Create a high priority task to fix login bug, due tomorrow",
    "Schedule meeting with design team next week about the new features"
  ];

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg">Quick Task Creator</h3>
            <p className="text-white/90 text-sm">Just describe what needs to be done in plain English</p>
          </div>
          <Sparkles className="w-5 h-5 text-white/70 animate-pulse" />
        </div>
      </div>

      <div className="p-6">
        {/* Input Form */}
        {!showPreview && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="E.g., Remind me to review the marketing deck by Friday and assign it to Sarah"
                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 focus:border-purple-500 rounded-xl resize-none transition-all outline-none text-gray-800 placeholder-gray-400"
                rows="3"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="absolute bottom-3 right-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white p-2.5 rounded-lg transition-all duration-200 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Example Prompts */}
            <div>
              <p className="text-gray-500 text-xs mb-2 font-medium">Try these examples:</p>
              <div className="flex flex-wrap gap-2">
                {examplePrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setInput(prompt)}
                    className="text-xs bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 text-purple-700 px-3 py-1.5 rounded-lg border border-purple-200 transition-all duration-200"
                  >
                    {prompt.length > 50 ? prompt.substring(0, 50) + '...' : prompt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>Press <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono">Cmd+Enter</kbd> or <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono">Ctrl+Enter</kbd> to submit</span>
            </div>
          </form>
        )}

        {/* Task Preview */}
        {showPreview && parsedTask && (
          <div className="space-y-5 animate-slideIn">
            {/* Confidence Badge */}
            <div className="flex items-center justify-between">
              <h4 className="text-gray-900 font-bold text-lg">Parsed Task Preview</h4>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                parsedTask.confidence === 'High' 
                  ? 'bg-green-100 text-green-700' 
                  : parsedTask.confidence === 'Medium'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-orange-100 text-orange-700'
              }`}>
                {parsedTask.confidence} Confidence
              </span>
            </div>

            {/* Title */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-5 border-2 border-purple-200">
              <p className="text-purple-700 text-sm font-medium mb-2">Task Title</p>
              <h3 className="text-gray-900 font-bold text-xl">{parsedTask.title}</h3>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Assignee */}
              {parsedTask.assignee && (
                <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-blue-600 text-xs font-medium mb-0.5">Assignee</p>
                      <p className="text-gray-900 font-semibold">{parsedTask.assignee}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Due Date */}
              {parsedTask.dueDate && (
                <div className="bg-white border-2 border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Calendar className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-green-600 text-xs font-medium mb-0.5">Due Date</p>
                      <p className="text-gray-900 font-semibold">
                        {new Date(parsedTask.dueDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Priority */}
              <div className={`border-2 rounded-lg p-4 ${getPriorityColor(parsedTask.priority)}`}>
                <p className="text-xs font-medium mb-1 opacity-80">Priority</p>
                <p className="font-bold text-lg">{parsedTask.priority}</p>
              </div>

              {/* Project */}
              {parsedTask.project && (
                <div className="bg-white border-2 border-purple-200 rounded-lg p-4">
                  <p className="text-purple-600 text-xs font-medium mb-1">Project</p>
                  <p className="text-gray-900 font-semibold">{parsedTask.project}</p>
                </div>
              )}
            </div>

            {/* Description */}
            {parsedTask.description && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-600 text-sm font-medium mb-2">Description</p>
                <p className="text-gray-800 leading-relaxed">{parsedTask.description}</p>
              </div>
            )}

            {/* Labels */}
            {parsedTask.labels && parsedTask.labels.length > 0 && (
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-gray-600" />
                  <p className="text-gray-600 text-sm font-medium">Labels</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {parsedTask.labels.map((label, idx) => (
                    <span 
                      key={idx} 
                      className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 px-3 py-1.5 rounded-full text-sm font-medium border border-purple-300"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleCreateTask}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-4 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Check className="w-5 h-5" />
                Create Task
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-4 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 rounded-xl font-bold transition-all duration-200 flex items-center gap-2"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default NaturalLanguageTaskInput;