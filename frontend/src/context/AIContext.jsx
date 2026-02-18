import { createContext, useState, useContext, useCallback } from 'react';
import * as aiService from '../services/aiService';
import { AuthContext } from './AuthContext';
import toast from 'react-hot-toast';

// Create the context
export const AIContext = createContext();

// Custom hook to use the AIContext
export const useAI = () => {
    const context = useContext(AIContext);
    if (!context) {
        throw new Error('useAI must be used within an AIProvider');
    }
    return context;
};

// Provider component
export const AIProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    
    // State management
    const [projectInsights, setProjectInsights] = useState(null);
    const [insightsLoading, setInsightsLoading] = useState(false);
    
    const [prioritySuggestion, setPrioritySuggestion] = useState(null);
    const [priorityLoading, setPriorityLoading] = useState(false);
    
    const [generatedDescription, setGeneratedDescription] = useState(null);
    const [descriptionLoading, setDescriptionLoading] = useState(false);
    
    const [assigneeSuggestion, setAssigneeSuggestion] = useState(null);
    const [assigneeLoading, setAssigneeLoading] = useState(false);
    
    const [bottlenecks, setBottlenecks] = useState(null);
    const [bottlenecksLoading, setBottlenecksLoading] = useState(false);
    
    const [actionItems, setActionItems] = useState(null);
    const [actionItemsLoading, setActionItemsLoading] = useState(false);
    
    const [parsedTask, setParsedTask] = useState(null);
    const [parseLoading, setParseLoading] = useState(false);
    
    const [error, setError] = useState(null);

    /**
     * Fetch project insights
     */
    const fetchProjectInsights = useCallback(async (projectId, options = {}) => {
        try {
            setInsightsLoading(true);
            setError(null);
            
            const insights = await aiService.getProjectInsights(projectId);
            setProjectInsights(insights);
            
            if (!options.silent) {
                toast.success('AI insights loaded successfully!');
            }
            
            return insights;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to fetch AI insights';
            setError(errorMessage);
            
            if (!options.silent) {
                toast.error(errorMessage);
            }
            
            console.error('Error fetching project insights:', err);
            throw err;
        } finally {
            setInsightsLoading(false);
        }
    }, []);

    /**
     * Get priority suggestion for a task
     */
    const getSuggestedPriority = useCallback(async (taskData, options = {}) => {
        try {
            setPriorityLoading(true);
            setError(null);
            
            const suggestion = await aiService.suggestTaskPriority(taskData);
            setPrioritySuggestion(suggestion);
            
            if (!options.silent) {
                toast.success('Priority suggestion generated!');
            }
            
            return suggestion;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to get priority suggestion';
            setError(errorMessage);
            
            if (!options.silent) {
                toast.error(errorMessage);
            }
            
            console.error('Error getting priority suggestion:', err);
            throw err;
        } finally {
            setPriorityLoading(false);
        }
    }, []);

    /**
     * Generate task description from brief input
     */
    const generateDescription = useCallback(async (briefInput, projectId = null, options = {}) => {
        try {
            setDescriptionLoading(true);
            setError(null);
            
            const description = await aiService.generateTaskDescription(briefInput, projectId);
            setGeneratedDescription(description);
            
            if (!options.silent) {
                toast.success('Task description generated!');
            }
            
            return description;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to generate task description';
            setError(errorMessage);
            
            if (!options.silent) {
                toast.error(errorMessage);
            }
            
            console.error('Error generating task description:', err);
            throw err;
        } finally {
            setDescriptionLoading(false);
        }
    }, []);

    /**
     * Get assignee suggestion
     */
    const getSuggestedAssignee = useCallback(async (taskData, projectId, options = {}) => {
        try {
            setAssigneeLoading(true);
            setError(null);
            
            const suggestion = await aiService.suggestAssignee(taskData, projectId);
            setAssigneeSuggestion(suggestion);
            
            if (!options.silent) {
                toast.success('Assignee suggestion generated!');
            }
            
            return suggestion;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to get assignee suggestion';
            setError(errorMessage);
            
            if (!options.silent) {
                toast.error(errorMessage);
            }
            
            console.error('Error getting assignee suggestion:', err);
            throw err;
        } finally {
            setAssigneeLoading(false);
        }
    }, []);

    /**
     * Detect project bottlenecks
     */
    const detectProjectBottlenecks = useCallback(async (projectId, options = {}) => {
        try {
            setBottlenecksLoading(true);
            setError(null);
            
            const result = await aiService.detectBottlenecks(projectId);
            setBottlenecks(result);
            
            if (!options.silent && result.currentBottlenecks?.length > 0) {
                toast.warning(`Found ${result.currentBottlenecks.length} bottleneck(s)`);
            }
            
            return result;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to detect bottlenecks';
            setError(errorMessage);
            
            if (!options.silent) {
                toast.error(errorMessage);
            }
            
            console.error('Error detecting bottlenecks:', err);
            throw err;
        } finally {
            setBottlenecksLoading(false);
        }
    }, []);

    /**
     * Extract action items from meeting notes
     */
    const extractMeetingActionItems = useCallback(async (meetingNotes, options = {}) => {
        try {
            setActionItemsLoading(true);
            setError(null);
            
            const result = await aiService.extractActionItems(meetingNotes);
            setActionItems(result);
            
            if (!options.silent) {
                toast.success(`Extracted ${result.actionItems?.length || 0} action items!`);
            }
            
            return result;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to extract action items';
            setError(errorMessage);
            
            if (!options.silent) {
                toast.error(errorMessage);
            }
            
            console.error('Error extracting action items:', err);
            throw err;
        } finally {
            setActionItemsLoading(false);
        }
    }, []);

    /**
     * Parse natural language task
     */
    const parseNaturalLanguage = useCallback(async (input, workspaceId, options = {}) => {
        try {
            setParseLoading(true);
            setError(null);
            
            const result = await aiService.parseNaturalLanguageTask(input, workspaceId);
            setParsedTask(result);
            
            if (!options.silent) {
                toast.success('Task parsed successfully!');
            }
            
            return result;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to parse task';
            setError(errorMessage);
            
            if (!options.silent) {
                toast.error(errorMessage);
            }
            
            console.error('Error parsing natural language task:', err);
            throw err;
        } finally {
            setParseLoading(false);
        }
    }, []);

    /**
     * Create tasks from action items
     */
    const createTasksFromMeetingNotes = useCallback(async (actionItems, projectId = null, options = {}) => {
        try {
            const createdTasks = await aiService.createTasksFromActionItems(actionItems, projectId);
            
            if (!options.silent) {
                toast.success(`Created ${createdTasks.length} task(s) successfully!`);
            }
            
            return createdTasks;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to create tasks from action items';
            setError(errorMessage);
            
            if (!options.silent) {
                toast.error(errorMessage);
            }
            
            console.error('Error creating tasks from action items:', err);
            throw err;
        }
    }, []);

    /**
     * Clear specific AI state
     */
    const clearPrioritySuggestion = useCallback(() => {
        setPrioritySuggestion(null);
    }, []);

    const clearGeneratedDescription = useCallback(() => {
        setGeneratedDescription(null);
    }, []);

    const clearAssigneeSuggestion = useCallback(() => {
        setAssigneeSuggestion(null);
    }, []);

    const clearActionItems = useCallback(() => {
        setActionItems(null);
    }, []);

    const clearParsedTask = useCallback(() => {
        setParsedTask(null);
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    /**
     * Clear all AI state
     */
    const clearAllAIState = useCallback(() => {
        setProjectInsights(null);
        setPrioritySuggestion(null);
        setGeneratedDescription(null);
        setAssigneeSuggestion(null);
        setBottlenecks(null);
        setActionItems(null);
        setParsedTask(null);
        setError(null);
    }, []);

    /**
     * Check if any AI operation is loading
     */
    const isAnyLoading = 
        insightsLoading || 
        priorityLoading || 
        descriptionLoading || 
        assigneeLoading || 
        bottlenecksLoading || 
        actionItemsLoading || 
        parseLoading;

    // Context value
    const value = {
        // State
        projectInsights,
        prioritySuggestion,
        generatedDescription,
        assigneeSuggestion,
        bottlenecks,
        actionItems,
        parsedTask,
        error,
        
        // Loading states
        insightsLoading,
        priorityLoading,
        descriptionLoading,
        assigneeLoading,
        bottlenecksLoading,
        actionItemsLoading,
        parseLoading,
        isAnyLoading,
        
        // Actions
        fetchProjectInsights,
        getSuggestedPriority,
        generateDescription,
        getSuggestedAssignee,
        detectProjectBottlenecks,
        extractMeetingActionItems,
        parseNaturalLanguage,
        createTasksFromMeetingNotes,
        
        // Clear functions
        clearPrioritySuggestion,
        clearGeneratedDescription,
        clearAssigneeSuggestion,
        clearActionItems,
        clearParsedTask,
        clearError,
        clearAllAIState,
        
        // Utility
        setError
    };

    return (
        <AIContext.Provider value={value}>
            {children}
        </AIContext.Provider>
    );
};

export default AIProvider;