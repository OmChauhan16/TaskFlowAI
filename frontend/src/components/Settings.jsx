import { useState } from 'react';
import {
    Settings, Globe, Clock, Layout, Sparkles, Brain,
    Sliders, Tag, CalendarDays, Palette, Monitor, Sun, Moon,
    Github, Slack, Calendar, Zap, Users, Shield,
    Download, Trash2, Eye, ToggleLeft, Check, ChevronDown,
    Plug, Bell, Database
} from 'lucide-react';
import Header from './Header';
import toast from 'react-hot-toast';

const SECTIONS = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'ai', label: 'AI Preferences', icon: Sparkles },
    { id: 'tasks', label: 'Task Defaults', icon: Sliders },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'integrations', label: 'Integrations', icon: Plug },
    { id: 'team', label: 'Team & Permissions', icon: Users },
    { id: 'data', label: 'Data & Privacy', icon: Database },
];

// ── Reusable primitives ───────────────────────────────────────────────────────

const SectionCard = ({ title, description, children }) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6">
        <div className="px-4 sm:px-8 py-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">{title}</h2>
            {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
        </div>
        <div className="px-4 sm:px-8 py-6">{children}</div>
    </div>
);

const Toggle = ({ checked, onChange }) => (
    <button
        onClick={() => onChange(!checked)}
        className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${checked ? 'bg-blue-600' : 'bg-gray-200'}`}
    >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
);

const SettingRow = ({ label, description, children }) => (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-gray-50 last:border-0">
        <div className="min-w-0">
            <p className="text-sm font-medium text-gray-800">{label}</p>
            {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
        </div>
        <div className="flex-shrink-0">{children}</div>
    </div>
);

const SelectField = ({ value, onChange, options }) => (
    <div className="relative">
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
            {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
    </div>
);

const IntegrationCard = ({ icon: Icon, iconBg, name, description, connected, onToggle }) => (
    <div className="flex items-center gap-4 py-4 border-b border-gray-50 last:border-0">
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800">{name}</p>
            <p className="text-xs text-gray-500 truncate">{description}</p>
        </div>
        <button
            onClick={onToggle}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition ${connected
                ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                : 'bg-blue-600 text-white hover:bg-blue-700'}`}
        >
            {connected ? 'Connected' : 'Connect'}
        </button>
    </div>
);

const TeamMemberRow = ({ name, email, role, avatar, onRoleChange }) => (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
        <img
            src={avatar || `https://ui-avatars.com/api/?name=${name}&background=3b82f6&color=fff`}
            alt={name}
            className="w-9 h-9 rounded-full flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{name}</p>
            <p className="text-xs text-gray-500 truncate">{email}</p>
        </div>
        <SelectField
            value={role}
            onChange={onRoleChange}
            options={[
                { value: 'admin', label: 'Admin' },
                { value: 'member', label: 'Member' },
                { value: 'viewer', label: 'Viewer' },
            ]}
        />
    </div>
);

// ── Main component ────────────────────────────────────────────────────────────

const SettingsPage = () => {
    const [activeSection, setActiveSection] = useState('general');

    // General
    const [workspaceName, setWorkspaceName] = useState('My Workspace');
    const [timezone, setTimezone] = useState('Asia/Kolkata');
    const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
    const [defaultView, setDefaultView] = useState('kanban');
    const [language, setLanguage] = useState('en');

    // AI Preferences
    const [aiPrefs, setAiPrefs] = useState({
        autoSuggestPriority: true,
        aiGeneratedDescriptions: true,
        nlpParsing: true,
        autoDueDate: false,
        aiTone: 'balanced',
        smartReminders: true,
        aiSummary: true,
    });

    // Task Defaults
    const [taskDefaults, setTaskDefaults] = useState({
        defaultPriority: 'medium',
        defaultAssignee: 'self',
        defaultDueDateOffset: '3',
        defaultLabels: 'bug',
    });

    // Appearance
    const [theme, setTheme] = useState('light');
    const [accentColor, setAccentColor] = useState('blue');
    const [density, setDensity] = useState('comfortable');

    // Integrations
    const [integrations, setIntegrations] = useState({
        github: false,
        slack: false,
        googleCalendar: false,
        zapier: false,
    });

    // Team
    const [teamMembers, setTeamMembers] = useState([
        { id: 1, name: 'Om Chauhan', email: 'om@example.com', role: 'admin' },
        { id: 2, name: 'Priya Sharma', email: 'priya@example.com', role: 'member' },
        { id: 3, name: 'Rahul Verma', email: 'rahul@example.com', role: 'viewer' },
    ]);
    const [inviteEmail, setInviteEmail] = useState('');

    const handleSave = () => toast.success('Settings saved!');

    const accentColors = [
        { value: 'blue', bg: 'bg-blue-500' },
        { value: 'purple', bg: 'bg-purple-500' },
        { value: 'green', bg: 'bg-green-500' },
        { value: 'rose', bg: 'bg-rose-500' },
        { value: 'orange', bg: 'bg-orange-500' },
        { value: 'teal', bg: 'bg-teal-500' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10">
                {/* Page heading */}
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-500 mt-1 text-sm">Configure your workspace and preferences</p>
                </div>

                {/* ── Mobile: horizontal scrollable tab bar ── */}
                <div className="lg:hidden flex bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto mb-4 scrollbar-hide">
                    {SECTIONS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveSection(id)}
                            className={`flex-shrink-0 px-4 py-3 flex flex-col items-center gap-1 text-xs font-medium transition border-b-2 ${activeSection === id
                                ? 'border-blue-600 text-blue-700 bg-blue-50'
                                : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
                        >
                            <Icon className="w-4 h-4" />
                            <span className="whitespace-nowrap">{label}</span>
                        </button>
                    ))}
                </div>

                <div className="flex gap-8">
                    {/* ── Desktop sidebar ── */}
                    <aside className="hidden lg:block w-56 flex-shrink-0">
                        <nav className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-6">
                            {SECTIONS.map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => setActiveSection(id)}
                                    className={`w-full text-left px-5 py-3.5 text-sm font-medium flex items-center gap-3 transition-colors border-l-2 ${activeSection === id
                                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                                >
                                    <Icon className="w-4 h-4 flex-shrink-0" />
                                    {label}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* ── Main content ── */}
                    <main className="flex-1 min-w-0">

                        {/* ════ GENERAL ════ */}
                        {activeSection === 'general' && (
                            <>
                                <SectionCard title="Workspace" description="Basic workspace configuration">
                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Workspace Name</label>
                                            <input
                                                type="text"
                                                value={workspaceName}
                                                onChange={e => setWorkspaceName(e.target.value)}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Language</label>
                                                <SelectField value={language} onChange={setLanguage} options={[
                                                    { value: 'en', label: 'English' },
                                                    { value: 'hi', label: 'Hindi' },
                                                    { value: 'es', label: 'Spanish' },
                                                    { value: 'fr', label: 'French' },
                                                ]} />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Date Format</label>
                                                <SelectField value={dateFormat} onChange={setDateFormat} options={[
                                                    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                                                    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                                                    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
                                                ]} />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Timezone</label>
                                                <SelectField value={timezone} onChange={setTimezone} options={[
                                                    { value: 'Asia/Kolkata', label: 'IST (UTC+5:30)' },
                                                    { value: 'America/New_York', label: 'EST (UTC-5)' },
                                                    { value: 'America/Los_Angeles', label: 'PST (UTC-8)' },
                                                    { value: 'Europe/London', label: 'GMT (UTC+0)' },
                                                    { value: 'Europe/Berlin', label: 'CET (UTC+1)' },
                                                ]} />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Default View</label>
                                                <SelectField value={defaultView} onChange={setDefaultView} options={[
                                                    { value: 'kanban', label: 'Kanban Board' },
                                                    { value: 'list', label: 'List View' },
                                                    { value: 'dashboard', label: 'Dashboard' },
                                                ]} />
                                            </div>
                                        </div>
                                    </div>
                                </SectionCard>
                                <div className="flex justify-end">
                                    <button onClick={handleSave} className="px-6 py-2.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition font-medium">
                                        Save Changes
                                    </button>
                                </div>
                            </>
                        )}

                        {/* ════ AI PREFERENCES ════ */}
                        {activeSection === 'ai' && (
                            <>
                                <SectionCard
                                    title="AI Intelligence"
                                    description="Control how TaskFlow AI assists you throughout your workflow"
                                >
                                    {/* AI Tone */}
                                    <div className="mb-6">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">AI Response Tone</p>
                                        <div className="grid grid-cols-3 gap-2">
                                            {[
                                                { value: 'concise', label: 'Concise', desc: 'Brief & to the point' },
                                                { value: 'balanced', label: 'Balanced', desc: 'Default mix' },
                                                { value: 'detailed', label: 'Detailed', desc: 'In-depth analysis' },
                                            ].map(opt => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => setAiPrefs(p => ({ ...p, aiTone: opt.value }))}
                                                    className={`p-3 rounded-xl border-2 text-left transition ${aiPrefs.aiTone === opt.value
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 hover:border-gray-300'}`}
                                                >
                                                    <p className="text-sm font-semibold text-gray-800">{opt.label}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                                                    {aiPrefs.aiTone === opt.value && (
                                                        <Check className="w-3.5 h-3.5 text-blue-600 mt-1" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Toggles */}
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Automation</p>
                                    {[
                                        { key: 'autoSuggestPriority', label: 'Auto-suggest priority', desc: 'AI analyzes task context to recommend priority levels' },
                                        { key: 'aiGeneratedDescriptions', label: 'AI-generated descriptions', desc: 'Automatically expand short task titles into full descriptions' },
                                        { key: 'nlpParsing', label: 'Natural language parsing', desc: 'Create tasks by describing them in plain English' },
                                        { key: 'autoDueDate', label: 'Auto-assign due dates', desc: 'AI infers deadlines from context (e.g. "by end of sprint")' },
                                        { key: 'smartReminders', label: 'Smart reminders', desc: 'AI sends reminders based on task complexity and deadline' },
                                        { key: 'aiSummary', label: 'Daily AI digest', desc: 'Morning summary of your tasks, priorities and blockers' },
                                    ].map(({ key, label, desc }) => (
                                        <SettingRow key={key} label={label} description={desc}>
                                            <Toggle checked={aiPrefs[key]} onChange={val => setAiPrefs(p => ({ ...p, [key]: val }))} />
                                        </SettingRow>
                                    ))}
                                </SectionCard>

                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3 mb-6">
                                    <Brain className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-semibold text-blue-900">AI Model: Claude (Powered by Anthropic)</p>
                                        <p className="text-xs text-blue-700 mt-0.5">TaskFlow AI uses state-of-the-art language models. Your task data is processed securely and never used to train models.</p>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button onClick={handleSave} className="px-6 py-2.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition font-medium">
                                        Save Preferences
                                    </button>
                                </div>
                            </>
                        )}

                        {/* ════ TASK DEFAULTS ════ */}
                        {activeSection === 'tasks' && (
                            <>
                                <SectionCard title="Task Defaults" description="Pre-fill values when creating new tasks">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Default Priority</label>
                                            <SelectField value={taskDefaults.defaultPriority} onChange={v => setTaskDefaults(p => ({ ...p, defaultPriority: v }))} options={[
                                                { value: 'low', label: 'Low' },
                                                { value: 'medium', label: 'Medium' },
                                                { value: 'high', label: 'High' },
                                                { value: 'urgent', label: 'Urgent' },
                                            ]} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Default Assignee</label>
                                            <SelectField value={taskDefaults.defaultAssignee} onChange={v => setTaskDefaults(p => ({ ...p, defaultAssignee: v }))} options={[
                                                { value: 'self', label: 'Assign to me' },
                                                { value: 'none', label: 'No assignee' },
                                            ]} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Due Date Offset (days from creation)</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="90"
                                                value={taskDefaults.defaultDueDateOffset}
                                                onChange={e => setTaskDefaults(p => ({ ...p, defaultDueDateOffset: e.target.value }))}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <p className="text-xs text-gray-400 mt-1">Set 0 to disable auto due date</p>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Default Label</label>
                                            <input
                                                type="text"
                                                value={taskDefaults.defaultLabels}
                                                onChange={e => setTaskDefaults(p => ({ ...p, defaultLabels: e.target.value }))}
                                                placeholder="e.g. bug, feature"
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <p className="text-xs text-gray-400 mt-1">Comma-separated labels</p>
                                        </div>
                                    </div>
                                </SectionCard>
                                <div className="flex justify-end">
                                    <button onClick={handleSave} className="px-6 py-2.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition font-medium">
                                        Save Defaults
                                    </button>
                                </div>
                            </>
                        )}

                        {/* ════ APPEARANCE ════ */}
                        {activeSection === 'appearance' && (
                            <>
                                <SectionCard title="Theme" description="Choose how TaskFlow AI looks">
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { value: 'light', icon: Sun, label: 'Light' },
                                            { value: 'dark', icon: Moon, label: 'Dark' },
                                            { value: 'system', icon: Monitor, label: 'System' },
                                        ].map(({ value, icon: Icon, label }) => (
                                            <button
                                                key={value}
                                                onClick={() => setTheme(value)}
                                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition ${theme === value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                                            >
                                                <Icon className={`w-6 h-6 ${theme === value ? 'text-blue-600' : 'text-gray-400'}`} />
                                                <span className={`text-sm font-medium ${theme === value ? 'text-blue-700' : 'text-gray-600'}`}>{label}</span>
                                                {theme === value && <Check className="w-3.5 h-3.5 text-blue-600" />}
                                            </button>
                                        ))}
                                    </div>
                                </SectionCard>

                                <SectionCard title="Accent Color" description="Primary color used for buttons and highlights">
                                    <div className="flex gap-3 flex-wrap">
                                        {accentColors.map(({ value, bg }) => (
                                            <button
                                                key={value}
                                                onClick={() => setAccentColor(value)}
                                                className={`w-9 h-9 rounded-full ${bg} transition-transform hover:scale-110 flex items-center justify-center ${accentColor === value ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''}`}
                                            >
                                                {accentColor === value && <Check className="w-4 h-4 text-white" />}
                                            </button>
                                        ))}
                                    </div>
                                </SectionCard>

                                <SectionCard title="Display Density" description="Controls spacing and element sizes">
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { value: 'compact', label: 'Compact', desc: 'More content, less space' },
                                            { value: 'comfortable', label: 'Comfortable', desc: 'Balanced default' },
                                            { value: 'spacious', label: 'Spacious', desc: 'Relaxed layout' },
                                        ].map(opt => (
                                            <button
                                                key={opt.value}
                                                onClick={() => setDensity(opt.value)}
                                                className={`p-3 rounded-xl border-2 text-left transition ${density === opt.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                                            >
                                                <p className="text-sm font-semibold text-gray-800">{opt.label}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                                            </button>
                                        ))}
                                    </div>
                                </SectionCard>

                                <div className="flex justify-end">
                                    <button onClick={handleSave} className="px-6 py-2.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition font-medium">
                                        Save Appearance
                                    </button>
                                </div>
                            </>
                        )}

                        {/* ════ INTEGRATIONS ════ */}
                        {activeSection === 'integrations' && (
                            <>
                                <SectionCard title="Connected Apps" description="Link your tools to sync tasks and notifications automatically">
                                    <IntegrationCard
                                        icon={Github}
                                        iconBg="bg-gray-900"
                                        name="GitHub"
                                        description="Auto-create tasks from issues and PRs"
                                        connected={integrations.github}
                                        onToggle={() => {
                                            setIntegrations(p => ({ ...p, github: !p.github }));
                                            toast.success(integrations.github ? 'GitHub disconnected' : 'GitHub connected!');
                                        }}
                                    />
                                    <IntegrationCard
                                        icon={Slack}
                                        iconBg="bg-purple-600"
                                        name="Slack"
                                        description="Get task updates and AI digests in Slack channels"
                                        connected={integrations.slack}
                                        onToggle={() => {
                                            setIntegrations(p => ({ ...p, slack: !p.slack }));
                                            toast.success(integrations.slack ? 'Slack disconnected' : 'Slack connected!');
                                        }}
                                    />
                                    <IntegrationCard
                                        icon={Calendar}
                                        iconBg="bg-blue-500"
                                        name="Google Calendar"
                                        description="Sync task due dates with your calendar"
                                        connected={integrations.googleCalendar}
                                        onToggle={() => {
                                            setIntegrations(p => ({ ...p, googleCalendar: !p.googleCalendar }));
                                            toast.success(integrations.googleCalendar ? 'Google Calendar disconnected' : 'Google Calendar connected!');
                                        }}
                                    />
                                    <IntegrationCard
                                        icon={Zap}
                                        iconBg="bg-yellow-500"
                                        name="Zapier"
                                        description="Connect 5,000+ apps via automated workflows"
                                        connected={integrations.zapier}
                                        onToggle={() => {
                                            setIntegrations(p => ({ ...p, zapier: !p.zapier }));
                                            toast.success(integrations.zapier ? 'Zapier disconnected' : 'Zapier connected!');
                                        }}
                                    />
                                </SectionCard>

                                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-center">
                                    <p className="text-sm text-gray-500">More integrations coming soon — Jira, Notion, Linear, Figma</p>
                                </div>
                            </>
                        )}

                        {/* ════ TEAM ════ */}
                        {activeSection === 'team' && (
                            <>
                                <SectionCard title="Team Members" description="Manage who has access to this workspace">
                                    {teamMembers.map(member => (
                                        <TeamMemberRow
                                            key={member.id}
                                            {...member}
                                            onRoleChange={(role) => setTeamMembers(prev =>
                                                prev.map(m => m.id === member.id ? { ...m, role } : m)
                                            )}
                                        />
                                    ))}
                                </SectionCard>

                                <SectionCard title="Invite Member" description="Send an invitation to join this workspace">
                                    <div className="flex gap-3">
                                        <input
                                            type="email"
                                            value={inviteEmail}
                                            onChange={e => setInviteEmail(e.target.value)}
                                            placeholder="colleague@company.com"
                                            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <button
                                            onClick={() => {
                                                if (!inviteEmail) return;
                                                toast.success(`Invitation sent to ${inviteEmail}`);
                                                setInviteEmail('');
                                            }}
                                            className="px-5 py-2.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition font-medium whitespace-nowrap"
                                        >
                                            Send Invite
                                        </button>
                                    </div>
                                </SectionCard>
                            </>
                        )}

                        {/* ════ DATA & PRIVACY ════ */}
                        {activeSection === 'data' && (
                            <>
                                <SectionCard title="Data Export" description="Download a copy of all your workspace data">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">Export all data</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Download tasks, projects, and settings as JSON or CSV</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => toast.success('Exporting as JSON...')}
                                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition font-medium"
                                            >
                                                <Download className="w-4 h-4" /> JSON
                                            </button>
                                            <button
                                                onClick={() => toast.success('Exporting as CSV...')}
                                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition font-medium"
                                            >
                                                <Download className="w-4 h-4" /> CSV
                                            </button>
                                        </div>
                                    </div>
                                </SectionCard>

                                <SectionCard title="AI Data Usage" description="Control how your data is used by AI features">
                                    {[
                                        { key: 'analyticsConsent', label: 'Usage analytics', desc: 'Help improve TaskFlow AI by sharing anonymous usage data' },
                                        { key: 'aiPersonalization', label: 'AI personalization', desc: 'Allow AI to learn your patterns for better suggestions' },
                                    ].map(({ key, label, desc }) => (
                                        <SettingRow key={key} label={label} description={desc}>
                                            <Toggle checked={true} onChange={() => toast('Preference updated')} />
                                        </SettingRow>
                                    ))}
                                </SectionCard>

                                {/* Danger Zone */}
                                <div className="bg-white rounded-2xl border border-red-100 shadow-sm">
                                    <div className="px-4 sm:px-8 py-5 border-b border-red-100">
                                        <h2 className="font-semibold text-red-600">Danger Zone</h2>
                                        <p className="text-sm text-gray-500 mt-0.5">These actions are permanent and cannot be undone</p>
                                    </div>
                                    <div className="px-4 sm:px-8 py-6 space-y-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">Reset AI preferences</p>
                                                <p className="text-xs text-gray-500 mt-0.5">Clears all learned AI patterns and resets to defaults</p>
                                            </div>
                                            <button
                                                onClick={() => toast('AI preferences reset')}
                                                className="w-full sm:w-auto px-4 py-2 border border-orange-300 text-orange-600 text-sm rounded-lg hover:bg-orange-50 transition font-medium"
                                            >
                                                Reset AI Data
                                            </button>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">Delete Workspace</p>
                                                <p className="text-xs text-gray-500 mt-0.5">Permanently deletes all projects, tasks, and members</p>
                                            </div>
                                            <button
                                                onClick={() => toast.error('Workspace deletion requires email confirmation')}
                                                className="w-full sm:w-auto px-4 py-2 border border-red-300 text-red-600 text-sm rounded-lg hover:bg-red-50 transition font-medium flex items-center justify-center gap-2"
                                            >
                                                <Trash2 className="w-4 h-4" /> Delete Workspace
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;