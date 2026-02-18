// const OpenAI = require('openai');

// class AIService {
//     constructor() {
//         this.openai = new OpenAI({
//             apiKey: process.env.OPENAI_API_KEY,
//         });
//     }

//     /**
//      * Analyze task context and suggest priority level
//      */
//     async suggestTaskPriority(taskData) {
//         try {
//             const {
//                 title,
//                 description,
//                 dueDate,
//                 dependencies,
//                 assigneeWorkload,
//                 projectDeadline,
//                 historicalData
//             } = taskData;

//             const contextMessage = `
// Analyze this task and suggest an appropriate priority level (Low, Medium, High, Critical):

// Task Title: ${title}
// Description: ${description || 'No description'}
// Due Date: ${dueDate || 'No due date'}
// Dependencies: ${dependencies?.length || 0} tasks
// Assignee Current Workload: ${assigneeWorkload || 'Unknown'}
// Project Deadline: ${projectDeadline || 'No project deadline'}
// Historical Context: ${JSON.stringify(historicalData || {})}

// Provide:
// 1. Recommended priority level
// 2. Reasoning (2-3 sentences)
// 3. Risk factors (if any)
// 4. Suggested timeline adjustments (if needed)

// Respond in JSON format:
// {
//   "priority": "Low|Medium|High|Critical",
//   "reasoning": "explanation here",
//   "riskFactors": ["factor1", "factor2"],
//   "suggestedAdjustments": "timeline suggestions"
// }
//       `;

//             const response = await this.openai.chat.completions.create({
//                 model: "gpt-4o-mini",
//                 messages: [
//                     {
//                         role: "system",
//                         content: "You are an expert project management AI assistant. Analyze task data and provide actionable insights in JSON format only."
//                     },
//                     {
//                         role: "user",
//                         content: contextMessage
//                     }
//                 ],
//                 temperature: 0.7,
//                 response_format: { type: "json_object" }
//             });

//             return JSON.parse(response.choices[0].message.content);
//         } catch (error) {
//             console.error('AI Priority Suggestion Error:', error);
//             throw new Error('Failed to generate AI priority suggestion');
//         }
//     }

//     /**
//      * Generate comprehensive task description from brief input
//      */
//     async generateTaskDescription(briefInput, projectContext = {}) {
//         try {
//             const contextMessage = `
// Generate a comprehensive task description based on this brief input:

// Input: "${briefInput}"

// Project Context:
// - Type: ${projectContext.type || 'General'}
// - Tech Stack: ${projectContext.techStack || 'Not specified'}
// - Team Size: ${projectContext.teamSize || 'Not specified'}

// Generate:
// 1. Detailed description (2-3 sentences)
// 2. Acceptance criteria (3-5 specific, measurable criteria)
// 3. Suggested subtasks (3-7 actionable subtasks)
// 4. Estimated effort (in hours)
// 5. Required skills
// 6. Potential blockers

// Respond in JSON format:
// {
//   "description": "detailed description",
//   "acceptanceCriteria": ["criterion1", "criterion2", ...],
//   "subtasks": [
//     {"title": "Subtask 1", "description": "Details"},
//     ...
//   ],
//   "estimatedHours": 8,
//   "requiredSkills": ["skill1", "skill2"],
//   "potentialBlockers": ["blocker1", "blocker2"]
// }
//       `;

//             const response = await this.openai.chat.completions.create({
//                 model: "gpt-4o-mini",
//                 messages: [
//                     {
//                         role: "system",
//                         content: "You are an expert project manager who creates detailed, actionable task descriptions. Always respond in valid JSON format."
//                     },
//                     {
//                         role: "user",
//                         content: contextMessage
//                     }
//                 ],
//                 temperature: 0.8,
//                 response_format: { type: "json_object" }
//             });

//             return JSON.parse(response.choices[0].message.content);
//         } catch (error) {
//             console.error('AI Task Description Error:', error);
//             throw new Error('Failed to generate task description');
//         }
//     }

//     /**
//      * Smart assignment suggestion
//      */
//     async suggestAssignee(taskData, teamMembers) {
//         try {
//             const teamContext = teamMembers.map(member => ({
//                 id: member.id,
//                 name: member.name,
//                 skills: member.skills || [],
//                 currentWorkload: member.currentWorkload || 0,
//                 availability: member.availability || 'Available',
//                 performanceMetrics: member.performanceMetrics || {},
//                 pastTasks: member.pastTasks || []
//             }));

//             const contextMessage = `
// Analyze this task and recommend the best team member to assign it to:

// Task Details:
// - Title: ${taskData.title}
// - Description: ${taskData.description || 'No description'}
// - Required Skills: ${taskData.requiredSkills?.join(', ') || 'Not specified'}
// - Priority: ${taskData.priority || 'Medium'}
// - Estimated Hours: ${taskData.estimatedHours || 'Unknown'}

// Team Members:
// ${JSON.stringify(teamContext, null, 2)}

// Consider:
// 1. Skill match
// 2. Current workload
// 3. Availability
// 4. Past performance on similar tasks
// 5. Learning opportunities for team members

// Respond in JSON format:
// {
//   "recommendedAssignee": "member_id",
//   "confidence": "High|Medium|Low",
//   "reasoning": "explanation",
//   "alternativeOptions": [
//     {"memberId": "id", "reason": "why this is alternative"}
//   ],
//   "workloadWarning": "warning if overloaded" or null
// }
//       `;

//             const response = await this.openai.chat.completions.create({
//                 model: "gpt-4o-mini",
//                 messages: [
//                     {
//                         role: "system",
//                         content: "You are an AI assignment optimizer for project management. Analyze team capacity and skills to make optimal assignments. Respond in JSON format only."
//                     },
//                     {
//                         role: "user",
//                         content: contextMessage
//                     }
//                 ],
//                 temperature: 0.6,
//                 response_format: { type: "json_object" }
//             });

//             return JSON.parse(response.choices[0].message.content);
//         } catch (error) {
//             console.error('AI Assignment Suggestion Error:', error);
//             throw new Error('Failed to generate assignment suggestion');
//         }
//     }

//     /**
//      * Detect bottlenecks in project workflow
//      */
//     async detectBottlenecks(projectData) {
//         try {
//             const contextMessage = `
// Analyze this project workflow and identify bottlenecks:

// Project: ${projectData.name}
// Total Tasks: ${projectData.totalTasks}
// Completed: ${projectData.completedTasks}
// In Progress: ${projectData.inProgressTasks}
// Blocked: ${projectData.blockedTasks}

// Tasks Data:
// ${JSON.stringify(projectData.tasks, null, 2)}

// Team Capacity:
// ${JSON.stringify(projectData.teamCapacity, null, 2)}

// Identify:
// 1. Current bottlenecks (stuck tasks, overloaded members)
// 2. Predicted bottlenecks (upcoming issues)
// 3. Recommended actions
// 4. Priority level (Low, Medium, High, Critical)

// Respond in JSON format:
// {
//   "currentBottlenecks": [
//     {
//       "type": "task|resource|dependency",
//       "description": "details",
//       "impact": "High|Medium|Low",
//       "affectedTasks": ["task_id1", "task_id2"]
//     }
//   ],
//   "predictedBottlenecks": [
//     {
//       "type": "type",
//       "description": "details",
//       "timeframe": "when this might happen",
//       "probability": "High|Medium|Low"
//     }
//   ],
//   "recommendations": [
//     {
//       "action": "what to do",
//       "priority": "Critical|High|Medium|Low",
//       "expectedImpact": "outcome"
//     }
//   ],
//   "overallRiskLevel": "Critical|High|Medium|Low"
// }
//       `;

//             const response = await this.openai.chat.completions.create({
//                 model: "gpt-4o-mini",
//                 messages: [
//                     {
//                         role: "system",
//                         content: "You are an AI project analyst specializing in identifying workflow bottlenecks and optimizing team performance. Respond in JSON format only."
//                     },
//                     {
//                         role: "user",
//                         content: contextMessage
//                     }
//                 ],
//                 temperature: 0.5,
//                 response_format: { type: "json_object" }
//             });

//             return JSON.parse(response.choices[0].message.content);
//         } catch (error) {
//             console.error('AI Bottleneck Detection Error:', error);
//             throw new Error('Failed to detect bottlenecks');
//         }
//     }

//     /**
//      * Extract action items from meeting notes
//      */
//     async extractActionItems(meetingNotes) {
//         try {
//             const contextMessage = `
// Extract action items from these meeting notes and create structured tasks:

// Meeting Notes:
// ${meetingNotes}

// For each action item, extract:
// 1. Task title (concise, action-oriented)
// 2. Description (what needs to be done)
// 3. Assignee (if mentioned, otherwise null)
// 4. Due date (if mentioned, otherwise null)
// 5. Priority (inferred from context)
// 6. Category/Project (if mentioned)

// Respond in JSON format:
// {
//   "actionItems": [
//     {
//       "title": "Task title",
//       "description": "Details",
//       "assignee": "name or null",
//       "dueDate": "date or null",
//       "priority": "High|Medium|Low",
//       "category": "category or null",
//       "context": "relevant meeting context"
//     }
//   ],
//   "summary": "Brief meeting summary",
//   "keyDecisions": ["decision1", "decision2"]
// }
//       `;

//             const response = await this.openai.chat.completions.create({
//                 model: "gpt-4o-mini",
//                 messages: [
//                     {
//                         role: "system",
//                         content: "You are an AI meeting assistant that extracts actionable tasks from meeting notes. Be precise and create well-structured action items. Respond in JSON format only."
//                     },
//                     {
//                         role: "user",
//                         content: contextMessage
//                     }
//                 ],
//                 temperature: 0.6,
//                 response_format: { type: "json_object" }
//             });

//             return JSON.parse(response.choices[0].message.content);
//         } catch (error) {
//             console.error('AI Action Item Extraction Error:', error);
//             throw new Error('Failed to extract action items');
//         }
//     }

//     /**
//      * Natural language task creation
//      */
//     async parseNaturalLanguageTask(input, context = {}) {
//         try {
//             const contextMessage = `
// Parse this natural language input into a structured task:

// Input: "${input}"

// Available Context:
// - Current User: ${context.currentUser || 'Unknown'}
// - Team Members: ${context.teamMembers?.join(', ') || 'None'}
// - Projects: ${context.projects?.join(', ') || 'None'}

// Extract:
// 1. Task title
// 2. Description (if any details provided)
// 3. Assignee (match to team members if mentioned)
// 4. Due date (parse relative dates like "by Friday", "next week")
// 5. Priority (infer from urgency words)
// 6. Project (if mentioned or can be inferred)
// 7. Labels/tags (if mentioned)

// Today's date: ${new Date().toISOString().split('T')[0]}

// Respond in JSON format:
// {
//   "title": "Task title",
//   "description": "Description or null",
//   "assignee": "team member name or null",
//   "dueDate": "YYYY-MM-DD or null",
//   "priority": "High|Medium|Low",
//   "project": "project name or null",
//   "labels": ["label1", "label2"],
//   "confidence": "How confident in the parsing (High|Medium|Low)"
// }
//       `;

//             const response = await this.openai.chat.completions.create({
//                 model: "gpt-4o-mini",
//                 messages: [
//                     {
//                         role: "system",
//                         content: "You are an AI task parser that converts natural language into structured task data. Be intelligent about parsing dates and assignments. Respond in JSON format only."
//                     },
//                     {
//                         role: "user",
//                         content: contextMessage
//                     }
//                 ],
//                 temperature: 0.4,
//                 response_format: { type: "json_object" }
//             });

//             return JSON.parse(response.choices[0].message.content);
//         } catch (error) {
//             console.error('AI Natural Language Parsing Error:', error);
//             throw new Error('Failed to parse natural language task');
//         }
//     }

//     /**
//      * Generate AI insights for dashboard
//      */
//     async generateProjectInsights(projectData, historicalData = []) {
//         try {
//             const contextMessage = `
// Analyze this project and provide actionable insights:

// Current Project State:
// ${JSON.stringify(projectData, null, 2)}

// Historical Performance Data:
// ${JSON.stringify(historicalData, null, 2)}

// Provide:
// 1. Workload balance assessment
// 2. Completion rate trend
// 3. Team velocity
// 4. Risk areas
// 5. Suggestions for improvement
// 6. Predicted completion date

// Respond in JSON format:
// {
//   "workloadBalance": {
//     "status": "Balanced|Unbalanced",
//     "message": "description",
//     "overloadedMembers": ["member1"]
//   },
//   "completionRate": {
//     "current": 75,
//     "trend": "Improving|Declining|Stable",
//     "message": "analysis"
//   },
//   "velocity": {
//     "tasksPerWeek": 12,
//     "trend": "Increasing|Decreasing|Stable",
//     "comparison": "compared to team average"
//   },
//   "riskAreas": [
//     {
//       "area": "risk description",
//       "severity": "High|Medium|Low",
//       "recommendation": "what to do"
//     }
//   ],
//   "suggestions": [
//     {
//       "type": "Process|Resource|Timeline",
//       "suggestion": "specific suggestion",
//       "expectedImpact": "outcome"
//     }
//   ],
//   "predictedCompletion": {
//     "date": "YYYY-MM-DD",
//     "confidence": "High|Medium|Low",
//     "reasoning": "explanation"
//   }
// }
//       `;

//             const response = await this.openai.chat.completions.create({
//                 model: "gpt-4o-mini",
//                 messages: [
//                     {
//                         role: "system",
//                         content: "You are an AI project analytics expert. Analyze project data and provide actionable insights to improve team performance. Respond in JSON format only."
//                     },
//                     {
//                         role: "user",
//                         content: contextMessage
//                     }
//                 ],
//                 temperature: 0.6,
//                 response_format: { type: "json_object" }
//             });

//             return JSON.parse(response.choices[0].message.content);
//         } catch (error) {
//             console.error('AI Project Insights Error:', error);
//             throw new Error('Failed to generate project insights');
//         }
//     }
// }

// module.exports = new AIService();



// import 'dotenv/config';

// import OpenAI from 'openai';

// class AIService {
//     constructor() {
//         this.openai = new OpenAI({
//             apiKey: process.env.OPENAI_API_KEY,
//         });
//     }

//     /**
//      * Analyze task context and suggest priority level
//      */
//     async suggestTaskPriority(taskData) {
//         try {
//             const {
//                 title,
//                 description,
//                 dueDate,
//                 dependencies,
//                 assigneeWorkload,
//                 projectDeadline,
//                 historicalData
//             } = taskData;

//             const contextMessage = `
// Analyze this task and suggest an appropriate priority level (Low, Medium, High, Critical):

// Task Title: ${title}
// Description: ${description || 'No description'}
// Due Date: ${dueDate || 'No due date'}
// Dependencies: ${dependencies?.length || 0} tasks
// Assignee Current Workload: ${assigneeWorkload || 'Unknown'}
// Project Deadline: ${projectDeadline || 'No project deadline'}
// Historical Context: ${JSON.stringify(historicalData || {})}

// Respond in JSON format:
// {
//   "priority": "Low|Medium|High|Critical",
//   "reasoning": "explanation here",
//   "riskFactors": [],
//   "suggestedAdjustments": "timeline suggestions"
// }
// `;

//             const response = await this.openai.chat.completions.create({
//                 model: "gpt-4o-mini",
//                 messages: [
//                     {
//                         role: "system",
//                         content:
//                             "You are an expert project management AI assistant. Respond in valid JSON format only."
//                     },
//                     {
//                         role: "user",
//                         content: contextMessage
//                     }
//                 ],
//                 temperature: 0.7,
//                 response_format: { type: "json_object" }
//             });

//             return JSON.parse(response.choices[0].message.content);

//         } catch (error) {
//             console.error('AI Priority Suggestion Error:', error);
//             throw new Error('Failed to generate AI priority suggestion');
//         }
//     }

//     /**
//      * Generate comprehensive task description
//      */
//     async generateTaskDescription(briefInput, projectContext = {}) {
//         try {
//             const contextMessage = `
// Generate a comprehensive task description based on:

// Input: "${briefInput}"

// Project Context:
// - Type: ${projectContext.type || 'General'}
// - Tech Stack: ${projectContext.techStack || 'Not specified'}
// - Team Size: ${projectContext.teamSize || 'Not specified'}

// Respond in JSON format with:
// {
//   "description": "",
//   "acceptanceCriteria": [],
//   "subtasks": [],
//   "estimatedHours": 0,
//   "requiredSkills": [],
//   "potentialBlockers": []
// }
// `;

//             const response = await this.openai.chat.completions.create({
//                 model: "gpt-4o-mini",
//                 messages: [
//                     {
//                         role: "system",
//                         content:
//                             "You are an expert project manager. Always respond in valid JSON format."
//                     },
//                     {
//                         role: "user",
//                         content: contextMessage
//                     }
//                 ],
//                 temperature: 0.8,
//                 response_format: { type: "json_object" }
//             });

//             return JSON.parse(response.choices[0].message.content);

//         } catch (error) {
//             console.error('AI Task Description Error:', error);
//             throw new Error('Failed to generate task description');
//         }
//     }

//     /**
//      * Smart assignment suggestion
//      */
//     async suggestAssignee(taskData, teamMembers) {
//         try {
//             const contextMessage = `
// Recommend the best assignee:

// Task:
// ${JSON.stringify(taskData, null, 2)}

// Team Members:
// ${JSON.stringify(teamMembers, null, 2)}

// Respond in JSON format:
// {
//   "recommendedAssignee": "",
//   "confidence": "High|Medium|Low",
//   "reasoning": "",
//   "alternativeOptions": [],
//   "workloadWarning": null
// }
// `;

//             const response = await this.openai.chat.completions.create({
//                 model: "gpt-4o-mini",
//                 messages: [
//                     {
//                         role: "system",
//                         content:
//                             "You are an AI assignment optimizer. Respond in JSON format only."
//                     },
//                     {
//                         role: "user",
//                         content: contextMessage
//                     }
//                 ],
//                 temperature: 0.6,
//                 response_format: { type: "json_object" }
//             });

//             return JSON.parse(response.choices[0].message.content);

//         } catch (error) {
//             console.error('AI Assignment Suggestion Error:', error);
//             throw new Error('Failed to generate assignment suggestion');
//         }
//     }

//     /**
//      * Detect bottlenecks
//      */
//     async detectBottlenecks(projectData) {
//         try {
//             const contextMessage = `
// Analyze this project for bottlenecks:

// ${JSON.stringify(projectData, null, 2)}

// Respond in JSON format.
// `;

//             const response = await this.openai.chat.completions.create({
//                 model: "gpt-4o-mini",
//                 messages: [
//                     {
//                         role: "system",
//                         content:
//                             "You are an AI project workflow analyst. Respond in JSON only."
//                     },
//                     {
//                         role: "user",
//                         content: contextMessage
//                     }
//                 ],
//                 temperature: 0.5,
//                 response_format: { type: "json_object" }
//             });

//             return JSON.parse(response.choices[0].message.content);

//         } catch (error) {
//             console.error('AI Bottleneck Detection Error:', error);
//             throw new Error('Failed to detect bottlenecks');
//         }
//     }

//     /**
//      * Extract action items
//      */
//     async extractActionItems(meetingNotes) {
//         try {
//             const contextMessage = `
// Extract structured action items from:

// ${meetingNotes}

// Respond in JSON format.
// `;

//             const response = await this.openai.chat.completions.create({
//                 model: "gpt-4o-mini",
//                 messages: [
//                     {
//                         role: "system",
//                         content:
//                             "You are an AI meeting assistant. Respond in JSON only."
//                     },
//                     {
//                         role: "user",
//                         content: contextMessage
//                     }
//                 ],
//                 temperature: 0.6,
//                 response_format: { type: "json_object" }
//             });

//             return JSON.parse(response.choices[0].message.content);

//         } catch (error) {
//             console.error('AI Action Item Extraction Error:', error);
//             throw new Error('Failed to extract action items');
//         }
//     }

//     /**
//      * Parse natural language task
//      */
//     async parseNaturalLanguageTask(input, context = {}) {
//         try {
//             const contextMessage = `
// Parse into structured task:

// Input: "${input}"

// Context:
// ${JSON.stringify(context, null, 2)}

// Today's date: ${new Date().toISOString().split('T')[0]}

// Respond in JSON format.
// `;

//             const response = await this.openai.chat.completions.create({
//                 model: "gpt-4o-mini",
//                 messages: [
//                     {
//                         role: "system",
//                         content:
//                             "You are an AI task parser. Respond in JSON only."
//                     },
//                     {
//                         role: "user",
//                         content: contextMessage
//                     }
//                 ],
//                 temperature: 0.4,
//                 response_format: { type: "json_object" }
//             });

//             return JSON.parse(response.choices[0].message.content);

//         } catch (error) {
//             console.error('AI Natural Language Parsing Error:', error);
//             throw new Error('Failed to parse natural language task');
//         }
//     }

//     /**
//      * Generate project insights
//      */
//     async generateProjectInsights(projectData, historicalData = []) {
//         try {
//             const contextMessage = `
// Analyze this project:

// Current:
// ${JSON.stringify(projectData, null, 2)}

// Historical:
// ${JSON.stringify(historicalData, null, 2)}

// Respond in JSON format.
// `;

//             const response = await this.openai.chat.completions.create({
//                 model: "gpt-4o-mini",
//                 messages: [
//                     {
//                         role: "system",
//                         content:
//                             "You are an AI project analytics expert. Respond in JSON only."
//                     },
//                     {
//                         role: "user",
//                         content: contextMessage
//                     }
//                 ],
//                 temperature: 0.6,
//                 response_format: { type: "json_object" }
//             });

//             return JSON.parse(response.choices[0].message.content);

//         } catch (error) {
//             console.error('AI Project Insights Error:', error);
//             throw new Error('Failed to generate project insights');
//         }
//     }
// }

// export default new AIService();




import 'dotenv/config';
import Groq from "groq-sdk";

class AIService {
    constructor() {
        this.groq = new Groq({
            apiKey: process.env.GROQ_API_KEY
        });

        // Groq's fastest model - llama-3.3-70b-versatile
        // Alternative models: llama-3.1-70b-versatile, mixtral-8x7b-32768
        this.model = "llama-3.3-70b-versatile";
    }

    /**
     * Analyze task context and suggest priority level
     */
    async suggestTaskPriority(taskData) {
        try {
            const {
                title,
                description,
                dueDate,
                dependencies,
                assigneeWorkload,
                projectDeadline,
                historicalData
            } = taskData;

            const contextMessage = `
Analyze this task and suggest an appropriate priority level (Low, Medium, High, Critical):

Task Title: ${title}
Description: ${description || 'No description'}
Due Date: ${dueDate || 'No due date'}
Dependencies: ${dependencies?.length || 0} tasks
Assignee Current Workload: ${assigneeWorkload || 'Unknown'}
Project Deadline: ${projectDeadline || 'No project deadline'}
Historical Context: ${JSON.stringify(historicalData || {})}

Provide:
1. Recommended priority level
2. Reasoning (2-3 sentences)
3. Risk factors (if any)
4. Suggested timeline adjustments (if needed)

IMPORTANT: Respond ONLY with valid JSON, no markdown, no extra text:
{
  "priority": "Low|Medium|High|Critical",
  "reasoning": "explanation here",
  "riskFactors": ["factor1", "factor2"],
  "suggestedAdjustments": "timeline suggestions"
}
`;

            const response = await this.groq.chat.completions.create({
                model: this.model,
                messages: [
                    {
                        role: "system",
                        content: "You are an expert project management AI assistant. Analyze task data and provide actionable insights. Always respond with ONLY valid JSON, no markdown formatting, no code blocks."
                    },
                    {
                        role: "user",
                        content: contextMessage
                    }
                ],
                temperature: 0.7,
                max_tokens: 1000
            });

            const content = response.choices[0].message.content.trim();
            // Remove markdown code blocks if present
            const cleanedContent = content.replace(/```json\n?|\n?```/g, '').trim();
            return JSON.parse(cleanedContent);

        } catch (error) {
            console.error('AI Priority Suggestion Error:', error);

            // Return fallback data
            return {
                priority: "Medium",
                reasoning: "Unable to analyze task at this time. Defaulting to Medium priority.",
                riskFactors: [],
                suggestedAdjustments: "Review task details and adjust priority as needed"
            };
        }
    }

    /**
     * Generate comprehensive task description
     */
    async generateTaskDescription(briefInput, projectContext = {}) {
        try {
            const contextMessage = `
Generate a comprehensive task description based on this brief input:

Input: "${briefInput}"

Project Context:
- Type: ${projectContext.type || 'General'}
- Tech Stack: ${projectContext.techStack || 'Not specified'}
- Team Size: ${projectContext.teamSize || 'Not specified'}

Generate:
1. Detailed description (2-3 sentences)
2. Acceptance criteria (3-5 specific, measurable criteria)
3. Suggested subtasks (3-7 actionable subtasks with titles and descriptions)
4. Estimated effort (in hours)
5. Required skills (list of skills needed)
6. Potential blockers (possible obstacles)

IMPORTANT: Respond ONLY with valid JSON, no markdown, no extra text:
{
  "description": "detailed description",
  "acceptanceCriteria": ["criterion1", "criterion2"],
  "subtasks": [
    {"title": "Subtask 1", "description": "Details"}
  ],
  "estimatedHours": 8,
  "requiredSkills": ["skill1", "skill2"],
  "potentialBlockers": ["blocker1", "blocker2"]
}
`;

            const response = await this.groq.chat.completions.create({
                model: this.model,
                messages: [
                    {
                        role: "system",
                        content: "You are an expert project manager who creates detailed, actionable task descriptions. Always respond with ONLY valid JSON, no markdown formatting, no code blocks."
                    },
                    {
                        role: "user",
                        content: contextMessage
                    }
                ],
                temperature: 0.8,
                max_tokens: 1500
            });

            const content = response.choices[0].message.content.trim();
            const cleanedContent = content.replace(/```json\n?|\n?```/g, '').trim();
            return JSON.parse(cleanedContent);

        } catch (error) {
            console.error('AI Task Description Error:', error);

            // Return fallback data
            return {
                description: `Task: ${briefInput}`,
                acceptanceCriteria: ["Task completed successfully", "All requirements met", "Quality standards satisfied"],
                subtasks: [
                    { title: "Research and planning", description: "Understand requirements and plan approach" },
                    { title: "Implementation", description: "Complete the main work" },
                    { title: "Testing and review", description: "Test and review the results" }
                ],
                estimatedHours: 8,
                requiredSkills: ["Problem solving", "Technical skills"],
                potentialBlockers: ["Resource availability", "Technical complexity"]
            };
        }
    }

    /**
     * Smart assignment suggestion
     */
    async suggestAssignee(taskData, teamMembers) {
        try {
            const teamContext = teamMembers.map(member => ({
                id: member.id,
                name: member.name,
                skills: member.skills || [],
                currentWorkload: member.currentWorkload || 0,
                availability: member.availability || 'Available'
            }));

            const contextMessage = `
Analyze this task and recommend the best team member to assign it to:

Task Details:
- Title: ${taskData.title}
- Description: ${taskData.description || 'No description'}
- Required Skills: ${taskData.requiredSkills?.join(', ') || 'Not specified'}
- Priority: ${taskData.priority || 'Medium'}
- Estimated Hours: ${taskData.estimatedHours || 'Unknown'}

Team Members:
${JSON.stringify(teamContext, null, 2)}

Consider:
1. Skill match
2. Current workload
3. Availability
4. Past performance

IMPORTANT: Respond ONLY with valid JSON, no markdown, no extra text:
{
  "recommendedAssignee": "member_id",
  "confidence": "High|Medium|Low",
  "reasoning": "explanation",
  "alternativeOptions": [
    {"memberId": "id", "reason": "why alternative"}
  ],
  "workloadWarning": "warning or null"
}
`;

            const response = await this.groq.chat.completions.create({
                model: this.model,
                messages: [
                    {
                        role: "system",
                        content: "You are an AI assignment optimizer for project management. Analyze team capacity and skills to make optimal assignments. Always respond with ONLY valid JSON, no markdown formatting."
                    },
                    {
                        role: "user",
                        content: contextMessage
                    }
                ],
                temperature: 0.6,
                max_tokens: 1000
            });

            const content = response.choices[0].message.content.trim();
            const cleanedContent = content.replace(/```json\n?|\n?```/g, '').trim();
            return JSON.parse(cleanedContent);

        } catch (error) {
            console.error('AI Assignment Suggestion Error:', error);

            // Return fallback - suggest first available member
            const availableMember = teamMembers.find(m => m.availability === 'Available') || teamMembers[0];
            return {
                recommendedAssignee: availableMember?.id || null,
                confidence: "Low",
                reasoning: "Unable to analyze optimal assignment. Suggesting first available team member.",
                alternativeOptions: [],
                workloadWarning: null
            };
        }
    }

    /**
     * Detect bottlenecks
     */
    async detectBottlenecks(projectData) {
        try {
            const contextMessage = `
Analyze this project workflow and identify bottlenecks:

Project: ${projectData.name}
Total Tasks: ${projectData.totalTasks}
Completed: ${projectData.completedTasks}
In Progress: ${projectData.inProgressTasks}
Blocked: ${projectData.blockedTasks}

Tasks Summary:
${JSON.stringify(projectData.tasks, null, 2)}

Team Capacity:
${JSON.stringify(projectData.teamCapacity, null, 2)}

Identify:
1. Current bottlenecks (stuck tasks, overloaded members)
2. Predicted bottlenecks (upcoming issues)
3. Recommended actions
4. Overall risk level

IMPORTANT: Respond ONLY with valid JSON, no markdown, no extra text:
{
  "currentBottlenecks": [
    {
      "type": "task|resource|dependency",
      "description": "details",
      "impact": "High|Medium|Low",
      "affectedTasks": ["task_id"]
    }
  ],
  "predictedBottlenecks": [
    {
      "type": "type",
      "description": "details",
      "timeframe": "when",
      "probability": "High|Medium|Low"
    }
  ],
  "recommendations": [
    {
      "action": "what to do",
      "priority": "Critical|High|Medium|Low",
      "expectedImpact": "outcome"
    }
  ],
  "overallRiskLevel": "Critical|High|Medium|Low"
}
`;

            const response = await this.groq.chat.completions.create({
                model: this.model,
                messages: [
                    {
                        role: "system",
                        content: "You are an AI project analyst specializing in identifying workflow bottlenecks. Always respond with ONLY valid JSON, no markdown formatting."
                    },
                    {
                        role: "user",
                        content: contextMessage
                    }
                ],
                temperature: 0.5,
                max_tokens: 1500
            });

            const content = response.choices[0].message.content.trim();
            const cleanedContent = content.replace(/```json\n?|\n?```/g, '').trim();
            return JSON.parse(cleanedContent);

        } catch (error) {
            console.error('AI Bottleneck Detection Error:', error);

            // Return fallback
            return {
                currentBottlenecks: [],
                predictedBottlenecks: [],
                recommendations: [
                    {
                        action: "Continue monitoring project progress",
                        priority: "Medium",
                        expectedImpact: "Maintain current trajectory"
                    }
                ],
                overallRiskLevel: "Low"
            };
        }
    }

    /**
     * Extract action items from meeting notes
     */
    async extractActionItems(meetingNotes) {
        try {
            const contextMessage = `
Extract action items from these meeting notes and create structured tasks:

Meeting Notes:
${meetingNotes}

For each action item, extract:
1. Task title (concise, action-oriented)
2. Description (what needs to be done)
3. Assignee (if mentioned, otherwise null)
4. Due date (if mentioned, otherwise null)
5. Priority (inferred from context: High, Medium, or Low)
6. Category/Project (if mentioned, otherwise null)

Also provide:
- Brief meeting summary
- Key decisions made

IMPORTANT: Respond ONLY with valid JSON, no markdown, no extra text:
{
  "actionItems": [
    {
      "title": "Task title",
      "description": "Details",
      "assignee": "name or null",
      "dueDate": "date or null",
      "priority": "High|Medium|Low",
      "category": "category or null",
      "context": "meeting context"
    }
  ],
  "summary": "Brief summary",
  "keyDecisions": ["decision1", "decision2"]
}
`;

            const response = await this.groq.chat.completions.create({
                model: this.model,
                messages: [
                    {
                        role: "system",
                        content: "You are an AI meeting assistant that extracts actionable tasks from meeting notes. Be precise and create well-structured action items. Always respond with ONLY valid JSON, no markdown formatting."
                    },
                    {
                        role: "user",
                        content: contextMessage
                    }
                ],
                temperature: 0.6,
                max_tokens: 2000
            });

            const content = response.choices[0].message.content.trim();
            const cleanedContent = content.replace(/```json\n?|\n?```/g, '').trim();
            return JSON.parse(cleanedContent);

        } catch (error) {
            console.error('AI Action Item Extraction Error:', error);

            // Return fallback
            return {
                actionItems: [
                    {
                        title: "Review meeting notes",
                        description: "Review and process meeting notes manually",
                        assignee: null,
                        dueDate: null,
                        priority: "Medium",
                        category: null,
                        context: "Automatic extraction unavailable"
                    }
                ],
                summary: "Meeting notes received",
                keyDecisions: []
            };
        }
    }

    /**
     * Parse natural language task
     */
    async parseNaturalLanguageTask(input, context = {}) {
        try {
            const contextMessage = `
Parse this natural language input into a structured task:

Input: "${input}"

Available Context:
- Current User: ${context.currentUser || 'Unknown'}
- Team Members: ${context.teamMembers?.join(', ') || 'None'}
- Projects: ${context.projects?.join(', ') || 'None'}

Extract:
1. Task title (clear and concise)
2. Description (if any details provided)
3. Assignee (match to team members if mentioned)
4. Due date (parse relative dates like "by Friday", "next week", "tomorrow")
5. Priority (infer from urgency words: "urgent", "asap", "high priority", etc.)
6. Project (if mentioned or can be inferred)
7. Labels/tags (if mentioned)

Today's date: ${new Date().toISOString().split('T')[0]}

IMPORTANT: Respond ONLY with valid JSON, no markdown, no extra text:
{
  "title": "Task title",
  "description": "Description or null",
  "assignee": "team member name or null",
  "dueDate": "YYYY-MM-DD or null",
  "priority": "High|Medium|Low",
  "project": "project name or null",
  "labels": ["label1", "label2"],
  "confidence": "High|Medium|Low"
}
`;

            const response = await this.groq.chat.completions.create({
                model: this.model,
                messages: [
                    {
                        role: "system",
                        content: "You are an AI task parser that converts natural language into structured task data. Be intelligent about parsing dates and assignments. Always respond with ONLY valid JSON, no markdown formatting."
                    },
                    {
                        role: "user",
                        content: contextMessage
                    }
                ],
                temperature: 0.4,
                max_tokens: 800
            });

            const content = response.choices[0].message.content.trim();
            const cleanedContent = content.replace(/```json\n?|\n?```/g, '').trim();
            return JSON.parse(cleanedContent);

        } catch (error) {
            console.error('AI Natural Language Parsing Error:', error);

            // Return basic fallback
            return {
                title: input.substring(0, 100),
                description: null,
                assignee: null,
                dueDate: null,
                priority: "Medium",
                project: null,
                labels: [],
                confidence: "Low"
            };
        }
    }

    /**
     * Generate project insights
     */
    async generateProjectInsights(projectData, historicalData = []) {
        try {
            const contextMessage = `
Analyze this project and provide actionable insights:

Current Project State:
- Name: ${projectData.name}
- Status: ${projectData.status}
- Total Tasks: ${projectData.totalTasks}
- Completed: ${projectData.completedTasks}
- In Progress: ${projectData.inProgressTasks}
- Team Size: ${projectData.teamSize}
- Start Date: ${projectData.startDate}
- Deadline: ${projectData.deadline}

Team Members Workload:
${JSON.stringify(projectData.members, null, 2)}

Historical Performance:
${JSON.stringify(historicalData, null, 2)}

Provide:
1. Workload balance assessment
2. Completion rate trend analysis
3. Team velocity metrics
4. Risk areas identification
5. Actionable suggestions for improvement
6. Predicted completion date with confidence level

IMPORTANT: Respond ONLY with valid JSON, no markdown, no extra text:
{
  "workloadBalance": {
    "status": "Balanced|Unbalanced",
    "message": "description",
    "overloadedMembers": ["member1"]
  },
  "completionRate": {
    "current": 75,
    "trend": "Improving|Declining|Stable",
    "message": "analysis"
  },
  "velocity": {
    "tasksPerWeek": 12,
    "trend": "Increasing|Decreasing|Stable",
    "comparison": "compared to average"
  },
  "riskAreas": [
    {
      "area": "risk description",
      "severity": "High|Medium|Low",
      "recommendation": "what to do"
    }
  ],
  "suggestions": [
    {
      "type": "Process|Resource|Timeline",
      "suggestion": "specific suggestion",
      "expectedImpact": "outcome"
    }
  ],
  "predictedCompletion": {
    "date": "YYYY-MM-DD",
    "confidence": "High|Medium|Low",
    "reasoning": "explanation"
  }
}
`;

            const response = await this.groq.chat.completions.create({
                model: this.model,
                messages: [
                    {
                        role: "system",
                        content: "You are an AI project analytics expert. Analyze project data and provide actionable insights to improve team performance. Always respond with ONLY valid JSON, no markdown formatting."
                    },
                    {
                        role: "user",
                        content: contextMessage
                    }
                ],
                temperature: 0.6,
                max_tokens: 2000
            });

            const content = response.choices[0].message.content.trim();
            const cleanedContent = content.replace(/```json\n?|\n?```/g, '').trim();
            return JSON.parse(cleanedContent);

        } catch (error) {
            console.error('AI Project Insights Error:', error);

            // Return comprehensive fallback
            const completionRate = Math.round(
                (projectData.completedTasks / projectData.totalTasks) * 100
            ) || 0;

            return {
                workloadBalance: {
                    status: "Balanced",
                    message: "Team workload appears evenly distributed",
                    overloadedMembers: []
                },
                completionRate: {
                    current: completionRate,
                    trend: completionRate >= 75 ? "Improving" : "Stable",
                    message: `${completionRate}% of tasks completed`
                },
                velocity: {
                    tasksPerWeek: Math.ceil(projectData.totalTasks / 4) || 0,
                    trend: "Stable",
                    comparison: "Based on project timeline"
                },
                riskAreas: [],
                suggestions: [
                    {
                        type: "Process",
                        suggestion: "Continue current workflow and monitor progress",
                        expectedImpact: "Maintained productivity"
                    }
                ],
                predictedCompletion: {
                    date: projectData.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    confidence: "Medium",
                    reasoning: "Based on current progress rate"
                }
            };
        }
    }
}

export default new AIService();
