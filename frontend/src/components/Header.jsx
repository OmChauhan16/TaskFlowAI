import React from 'react'
import { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const getActiveTab = () => {
        if (location.pathname === '/dashboard') return 'Dashboard';
        if (location.pathname === '/kanban-board') return 'Kanban';
        if (location.pathname === '/projects') return 'Projects';
        if (location.pathname === '/tasks') return 'Tasks';
        return 'Dashboard';
    };

    const handleTabClick = (tab) => {
        if (tab === 'Dashboard') navigate('/dashboard');
        if (tab === 'Kanban') navigate('/kanban-board');
        if (tab === 'Projects') navigate('/projects');
        if (tab === 'Tasks') navigate('/tasks');
        setShowMobileMenu(false); // close mobile menu on navigation
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
        setShowDropdown(false);
        setShowMobileMenu(false);
    };

    return (
        <div>
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">

                        {/* Logo and Brand */}
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">
                                T
                            </div>
                            <h1 className="text-xl font-bold text-gray-900">TaskFlow AI</h1>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-1">
                            {['Dashboard', 'Kanban', 'Projects', 'Tasks'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => handleTabClick(tab)}
                                    className={`px-6 py-2 rounded-lg font-medium transition-all ${getActiveTab() === tab
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>

                        {/* Right Side */}
                        <div className="flex items-center gap-2">

                            {/* Profile Dropdown (desktop) */}
                            <div className="relative hidden md:block">
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="flex items-center gap-3 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors"
                                >
                                    <img
                                        src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.user?.name || 'User'}&background=3b82f6&color=fff`}
                                        alt="User"
                                        className="w-9 h-9 rounded-full"
                                    />
                                    <div className="text-left">
                                        <div className="text-sm font-medium text-gray-800">
                                            {user?.user?.name || 'User'}
                                        </div>
                                    </div>
                                    <svg
                                        className={`w-4 h-4 text-gray-600 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                        <button
                                            onClick={() => { navigate('/profile'); setShowDropdown(false); }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Profile
                                        </button>
                                        <button
                                            onClick={() => { navigate('/settings'); setShowDropdown(false); }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            Settings
                                        </button>
                                        <div className="border-t border-gray-200 my-1"></div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Mobile: Hamburger only */}
                            <div className="flex items-center md:hidden">
                                {/* Hamburger Button */}
                                <button
                                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                    aria-label="Toggle menu"
                                >
                                    {showMobileMenu ? (
                                        /* X icon */
                                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    ) : (
                                        /* Hamburger icon */
                                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Drawer */}
                {showMobileMenu && (
                    <div className="md:hidden border-t border-gray-200 bg-white">
                        {/* User Info */}
                        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
                            <img
                                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.user?.name || 'User'}&background=3b82f6&color=fff`}
                                alt="User"
                                className="w-10 h-10 rounded-full"
                            />
                            <div>
                                <div className="text-sm font-semibold text-gray-800">{user?.user?.name || 'User'}</div>
                                <div className="text-xs text-gray-500">{user?.user?.email || ''}</div>
                            </div>
                        </div>

                        {/* Nav Tabs */}
                        <nav className="px-3 py-2">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-2">Navigation</p>
                            {['Dashboard', 'Kanban', 'Projects', 'Tasks'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => handleTabClick(tab)}
                                    className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all mb-1 ${getActiveTab() === tab
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>

                        {/* Account Options */}
                        <div className="px-3 py-2 border-t border-gray-100">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-2">Account</p>
                            <button
                                onClick={() => { navigate('/profile'); setShowMobileMenu(false); }}
                                className="w-full text-left px-4 py-3 rounded-lg text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 mb-1"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Profile
                            </button>
                            <button
                                onClick={() => { navigate('/settings'); setShowMobileMenu(false); }}
                                className="w-full text-left px-4 py-3 rounded-lg text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 mb-1"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Settings
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-3 rounded-lg text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </header>
        </div>
    );
};

export default Header;