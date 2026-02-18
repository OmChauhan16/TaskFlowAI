import API from './api';

/**
 * AI Service - Handles all AI-related API calls
 */

/**
 * Get AI-powered priority suggestion for a task
 * @param {Object} taskData - Task data or taskId
 * @returns {Promise<Object>} Priority suggestion with reasoning
 */
// export const suggestTaskPriority = async (taskData) => {
//     const { data } = await API.post('/ai/suggest-priority', taskData);
//     return data.suggestion;
// };


export const suggestTaskPriority = async (taskData) => {
    // Ensure taskData is properly formatted
    const payload = {
        taskData: {
            title: taskData.title || '',
            description: taskData.description || '',
            dueDate: taskData.dueDate || null,
            dependencies: taskData.dependencies || [],
            assigneeWorkload: taskData.assigneeWorkload || 0,
            projectDeadline: taskData.projectDeadline || null,
            historicalData: taskData.historicalData || {}
        }
    };

    const { data } = await API.post('/ai/suggest-priority', payload);
    return data.suggestion;
};

/**
 * Generate comprehensive task description from brief input
 * @param {string} briefInput - Brief task description
 * @param {string} projectId - Optional project ID for context
 * @returns {Promise<Object>} Generated task details
 */
export const generateTaskDescription = async (briefInput, projectId = null) => {
    const { data } = await API.post('/ai/generate-description', {
        briefInput,
        projectId
    });
    return data.description;
};

/**
 * Get smart assignee suggestion for a task
 * @param {Object} taskData - Task data
 * @param {string} projectId - Project ID to get team members
 * @returns {Promise<Object>} Assignee suggestion with reasoning
 */
export const suggestAssignee = async (taskData, projectId) => {
    const { data } = await API.post('/ai/suggest-assignee', {
        taskData,
        projectId
    });
    return data.suggestion;
};

/**
 * Detect bottlenecks in a project
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} Bottleneck analysis
 */
export const detectBottlenecks = async (projectId) => {
    const { data } = await API.post('/ai/detect-bottlenecks', {
        projectId
    });
    return data.bottlenecks;
};

/**
 * Extract action items from meeting notes
 * @param {string} meetingNotes - Meeting notes text
 * @returns {Promise<Object>} Extracted action items and summary
 */
export const extractActionItems = async (meetingNotes) => {
    const { data } = await API.post('/ai/extract-action-items', {
        meetingNotes
    });
    return data.result;
};

/**
 * Parse natural language input into structured task
 * @param {string} input - Natural language task description
 * @param {string} workspaceId - Workspace ID for context
 * @returns {Promise<Object>} Parsed task data
 */
export const parseNaturalLanguageTask = async (input, workspaceId) => {
    const { data } = await API.post('/ai/parse-task', {
        input,
        workspaceId
    });
    return data.parsedTask;
};

/**
 * Get AI-powered project insights
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} Project insights and analytics
 */
export const getProjectInsights = async (projectId) => {
    const { data } = await API.get(`/ai/project-insights/${projectId}`);
    return data.insights;
};

/**
 * Batch create tasks from action items
 * @param {Array} actionItems - Array of action items
 * @param {string} projectId - Optional project ID
 * @returns {Promise<Array>} Created tasks
 */
export const createTasksFromActionItems = async (actionItems, projectId = null) => {
    // This is a helper function that uses the regular task API
    // but processes multiple action items
    const createdTasks = [];

    for (const item of actionItems) {
        try {
            const taskData = {
                title: item.title,
                description: item.description,
                priority: item.priority?.toLowerCase() || 'medium',
                dueDate: item.dueDate,
                assignee: item.assignee,
                category: item.category,
                project: projectId,
                labels: item.context ? [item.context] : []
            };

            const { data } = await API.post('/tasks', taskData);
            createdTasks.push(data);
        } catch (error) {
            console.error(`Failed to create task: ${item.title}`, error);
        }
    }

    return createdTasks;
};

/**
 * Get AI suggestions for task optimization
 * @param {Array} tasks - Array of tasks
 * @returns {Promise<Object>} Optimization suggestions
 */
export const getTaskOptimizationSuggestions = async (tasks) => {
    const { data } = await API.post('/ai/optimize-tasks', { tasks });
    return data.suggestions;
};

export default {
    suggestTaskPriority,
    generateTaskDescription,
    suggestAssignee,
    detectBottlenecks,
    extractActionItems,
    parseNaturalLanguageTask,
    getProjectInsights,
    createTasksFromActionItems,
    getTaskOptimizationSuggestions
};