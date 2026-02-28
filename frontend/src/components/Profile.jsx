import { useState, useRef, useEffect } from 'react';
import {
    User, Mail, Phone, MapPin, Briefcase, Camera,
    Save, X, Edit3, Shield, Bell, Key,
    CheckCircle, AlertCircle, Calendar, Globe
} from 'lucide-react';
import Header from './Header';
import toast from 'react-hot-toast';
import { updateProfile, uploadAvatar, changePassword } from '../services/userService';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

const TABS = ['Profile', 'Security', 'Notifications'];

const ProfilePage = () => {
    const { user, setUser } = useContext(AuthContext);
    const fileInputRef = useRef(null);

    const [activeTab, setActiveTab] = useState('Profile');
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [avatarUploading, setAvatarUploading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        jobTitle: '',
        website: '',
        bio: '',
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [notifications, setNotifications] = useState({
        emailTaskAssigned: true,
        emailProjectUpdates: true,
        emailWeeklyDigest: false,
        pushTaskDue: true,
        pushMentions: true,
        pushProjectActivity: false,
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                location: user.location || '',
                jobTitle: user.jobTitle || '',
                website: user.website || '',
                bio: user.bio || '',
            });
        }
    }, [user]);

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            const data = await updateProfile(formData);
            setUser(data.user);
            setIsEditing(false);
            toast.success('Profile updated successfully!');
        } catch (err) {
            toast.error('Failed to update profile');
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setFormData({
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || '',
            location: user?.location || '',
            jobTitle: user?.jobTitle || '',
            website: user?.website || '',
            bio: user?.bio || '',
        });
        setIsEditing(false);
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setAvatarUploading(true);
        try {
            const data = await uploadAvatar(file);
            setUser(prev => ({ ...prev, avatar: data.avatarUrl }));
            toast.success('Avatar updated!');
        } catch (err) {
            toast.error('Failed to upload avatar');
            console.error(err);
        } finally {
            setAvatarUploading(false);
        }
    };

    const handlePasswordChange = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        setSaving(true);
        try {
            await changePassword(passwordData);
            toast.success('Password updated!');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update password');
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const Field = ({ icon: Icon, label, name, type = 'text', placeholder }) => (
        <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                {label}
            </label>
            {isEditing ? (
                <div className="relative">
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type={type}
                        value={formData[name]}
                        onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
                        placeholder={placeholder}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                </div>
            ) : (
                <div className="flex items-center gap-2.5 text-gray-700">
                    <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm break-all">{formData[name] || <span className="text-gray-400 italic">Not set</span>}</span>
                </div>
            )}
        </div>
    );

    const initials = (user?.name || 'U')
        .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10">

                {/* Page heading */}
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Account Settings</h1>
                    <p className="text-gray-500 mt-1 text-sm">Manage your profile and preferences</p>
                </div>

                {/* ── Mobile: Compact avatar card ── */}
                <div className="lg:hidden bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 mb-4">
                    <div className="relative group flex-shrink-0">
                        {user?.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-14 h-14 rounded-full object-cover ring-4 ring-white shadow-md"
                            />
                        ) : (
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg ring-4 ring-white shadow-md">
                                {initials}
                            </div>
                        )}
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={avatarUploading}
                            className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all duration-200"
                        >
                            <Camera className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 text-sm truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        {user?.createdAt && (
                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                                <Calendar className="w-3 h-3 flex-shrink-0" />
                                <span>Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Mobile: Horizontal tab bar ── */}
                <div className="lg:hidden flex bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-3 text-sm font-medium flex flex-col items-center gap-1 transition-colors border-b-2 ${activeTab === tab
                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                : 'border-transparent text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            {tab === 'Profile' && <User className="w-4 h-4" />}
                            {tab === 'Security' && <Shield className="w-4 h-4" />}
                            {tab === 'Notifications' && <Bell className="w-4 h-4" />}
                            <span className="text-xs">{tab}</span>
                        </button>
                    ))}
                </div>

                {/* ── Layout: sidebar (desktop) + main ── */}
                <div className="flex gap-8">

                    {/* Sidebar — desktop only */}
                    <aside className="hidden lg:block w-56 flex-shrink-0">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center gap-3 mb-4">
                            <div className="relative group">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-md" />
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-2xl ring-4 ring-white shadow-md">
                                        {initials}
                                    </div>
                                )}
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={avatarUploading}
                                    className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all duration-200"
                                >
                                    {avatarUploading
                                        ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white opacity-0 group-hover:opacity-100" />
                                        : <Camera className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                    }
                                </button>
                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                            </div>
                            <div className="text-center">
                                <p className="font-semibold text-gray-900 text-sm">{user?.name}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
                            </div>
                            {user?.createdAt && (
                                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                                </div>
                            )}
                        </div>
                        <nav className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            {TABS.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`w-full text-left px-5 py-3.5 text-sm font-medium flex items-center gap-3 transition-colors border-l-2 ${activeTab === tab
                                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    {tab === 'Profile' && <User className="w-4 h-4" />}
                                    {tab === 'Security' && <Shield className="w-4 h-4" />}
                                    {tab === 'Notifications' && <Bell className="w-4 h-4" />}
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* Main content */}
                    <main className="flex-1 min-w-0">

                        {/* ════ PROFILE TAB ════ */}
                        {activeTab === 'Profile' && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-8 py-5 border-b border-gray-100">
                                    <div>
                                        <h2 className="font-semibold text-gray-900">Personal Information</h2>
                                        <p className="text-sm text-gray-500 mt-0.5">Update your personal details</p>
                                    </div>
                                    {!isEditing ? (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition font-medium"
                                        >
                                            <Edit3 className="w-4 h-4" /> Edit Profile
                                        </button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleCancelEdit}
                                                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition font-medium flex-1 sm:flex-none"
                                            >
                                                <X className="w-4 h-4" /> Cancel
                                            </button>
                                            <button
                                                onClick={handleSaveProfile}
                                                disabled={saving}
                                                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 flex-1 sm:flex-none"
                                            >
                                                <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save'}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* 1 col on mobile, 2 on sm+ */}
                                <div className="px-4 sm:px-8 py-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <Field icon={User} label="Full Name" name="name" placeholder="Your full name" />
                                    <Field icon={Mail} label="Email" name="email" type="email" placeholder="your@email.com" />
                                    <Field icon={Phone} label="Phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" />
                                    <Field icon={MapPin} label="Location" name="location" placeholder="City, Country" />
                                    <Field icon={Briefcase} label="Job Title" name="jobTitle" placeholder="Your role" />
                                    <Field icon={Globe} label="Website" name="website" type="url" placeholder="https://yoursite.com" />
                                </div>

                                <div className="px-4 sm:px-8 pb-8">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Bio</label>
                                    {isEditing ? (
                                        <textarea
                                            value={formData.bio}
                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                            placeholder="Tell your team a little about yourself…"
                                            rows={4}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                            {formData.bio || <span className="text-gray-400 italic">No bio added yet</span>}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ════ SECURITY TAB ════ */}
                        {activeTab === 'Security' && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                                    <div className="px-4 sm:px-8 py-5 border-b border-gray-100">
                                        <h2 className="font-semibold text-gray-900">
                                            {user?.oauthProvider && !user?.password ? 'Set Password' : 'Change Password'}
                                        </h2>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            {user?.oauthProvider && !user?.password
                                                ? 'Set a password to enable email/password login'
                                                : 'Keep your account secure with a strong password'}
                                        </p>
                                    </div>
                                    <div className="px-4 sm:px-8 py-6 space-y-4">
                                        {(!user?.oauthProvider || user?.password) && (
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Current Password</label>
                                                <div className="relative">
                                                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <input type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} placeholder="••••••••" className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                                                </div>
                                            </div>
                                        )}
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">New Password</label>
                                            <div className="relative">
                                                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} placeholder="••••••••" className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Confirm New Password</label>
                                            <div className="relative">
                                                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} placeholder="••••••••" className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                                            </div>
                                        </div>
                                        {passwordData.newPassword && passwordData.confirmPassword && (
                                            <div className={`flex items-center gap-2 text-sm ${passwordData.newPassword === passwordData.confirmPassword ? 'text-green-600' : 'text-red-500'}`}>
                                                {passwordData.newPassword === passwordData.confirmPassword
                                                    ? <><CheckCircle className="w-4 h-4" /> Passwords match</>
                                                    : <><AlertCircle className="w-4 h-4" /> Passwords do not match</>}
                                            </div>
                                        )}
                                        <button onClick={handlePasswordChange} disabled={saving} className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50">
                                            {saving ? 'Updating…' : user?.oauthProvider && !user?.password ? 'Set Password' : 'Update Password'}
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl border border-red-100 shadow-sm">
                                    <div className="px-4 sm:px-8 py-5 border-b border-red-100">
                                        <h2 className="font-semibold text-red-600">Danger Zone</h2>
                                        <p className="text-sm text-gray-500 mt-0.5">Irreversible actions — proceed with caution</p>
                                    </div>
                                    <div className="px-4 sm:px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">Delete Account</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Permanently remove your account and all associated data</p>
                                        </div>
                                        <button className="w-full sm:w-auto px-4 py-2 border border-red-300 text-red-600 text-sm rounded-lg hover:bg-red-50 transition font-medium">
                                            Delete Account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ════ NOTIFICATIONS TAB ════ */}
                        {activeTab === 'Notifications' && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                                <div className="px-4 sm:px-8 py-5 border-b border-gray-100">
                                    <h2 className="font-semibold text-gray-900">Notification Preferences</h2>
                                    <p className="text-sm text-gray-500 mt-0.5">Choose how and when you get notified</p>
                                </div>
                                <div className="px-4 sm:px-8 py-6 space-y-1">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Email</p>
                                    {[
                                        { key: 'emailTaskAssigned', label: 'Task assigned to me', desc: 'When a task is assigned to you' },
                                        { key: 'emailProjectUpdates', label: 'Project updates', desc: 'Status changes in your projects' },
                                        { key: 'emailWeeklyDigest', label: 'Weekly digest', desc: 'Summary of your week every Monday' },
                                    ].map(({ key, label, desc }) => (
                                        <div key={key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 gap-4">
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-gray-800">{label}</p>
                                                <p className="text-xs text-gray-500">{desc}</p>
                                            </div>
                                            <button onClick={() => setNotifications(n => ({ ...n, [key]: !n[key] }))} className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${notifications[key] ? 'bg-blue-600' : 'bg-gray-200'}`}>
                                                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${notifications[key] ? 'translate-x-5' : 'translate-x-0'}`} />
                                            </button>
                                        </div>
                                    ))}
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 pt-6">Push</p>
                                    {[
                                        { key: 'pushTaskDue', label: 'Task due reminders', desc: 'Reminders when tasks are due soon' },
                                        { key: 'pushMentions', label: 'Mentions', desc: 'When someone @mentions you' },
                                        { key: 'pushProjectActivity', label: 'Project activity', desc: 'General activity in your projects' },
                                    ].map(({ key, label, desc }) => (
                                        <div key={key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 gap-4">
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-gray-800">{label}</p>
                                                <p className="text-xs text-gray-500">{desc}</p>
                                            </div>
                                            <button onClick={() => setNotifications(n => ({ ...n, [key]: !n[key] }))} className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${notifications[key] ? 'bg-blue-600' : 'bg-gray-200'}`}>
                                                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${notifications[key] ? 'translate-x-5' : 'translate-x-0'}`} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="px-4 sm:px-8 pb-6">
                                    <button onClick={() => toast.success('Notification preferences saved!')} className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition font-medium">
                                        Save Preferences
                                    </button>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;