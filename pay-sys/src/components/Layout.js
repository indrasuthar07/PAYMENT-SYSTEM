import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

function Layout({ children, userName = "User" }) {
    const user = useSelector((state) => state.users.user);
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path 
            ? 'bg-gradient-to-r from-cyan-900 to-cyan-800 text-cyan-300 border-l-4 border-cyan-400' 
            : 'text-cyan-200 hover:bg-cyan-900 hover:bg-opacity-30 hover:text-cyan-300 transition-all duration-200';
    };

    const menuItems = [
        { 
            path: '/home', 
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
            ), 
            label: 'Dashboard' 
        },
        { 
            path: '/transactions', 
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
                </svg>
            ), 
            label: 'Transactions' 
        },
        { 
            path: '/profile', 
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
            ), 
            label: 'Profile' 
        },
        { 
            path: '/settings', 
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
            ), 
            label: 'Settings' 
        }
    ];

    return (
        <div className="min-h-screen flex bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700">
            {/* Sidebar */}
            <aside className="w-72 bg-gradient-to-b from-blue-900 via-indigo-900 to-gray-900 shadow-2xl flex flex-col items-center py-8 border-r-4 border-cyan-400">
                <div className="mb-8">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-400/20">
                        <svg className="w-8 h-8 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                            <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
                <h2 className="text-cyan-400 text-2xl font-extrabold tracking-widest mb-2 font-mono">
                    PAYMENT-SYSTEM
                </h2>
                <div className="w-full border-b border-cyan-700 mb-6"></div>
                <nav className="flex flex-col gap-2 w-full px-4">
                    {menuItems.map((item) => (
                        <Link 
                            key={item.path}
                            to={item.path} 
                            className={`flex items-center gap-3 py-3 px-4 font-medium transition-all duration-200 rounded-lg ${isActive(item.path)}`}
                        >
                            {item.icon}
                            <span className="font-mono tracking-wide">{item.label}</span>
                        </Link>
                    ))}
                </nav>
                <div className="mt-auto w-full px-4">
                    <div className="bg-gradient-to-r from-cyan-900 to-blue-900 rounded-lg p-4 text-cyan-200 text-center mt-8 shadow-lg border border-cyan-700/50">
                        <span className="block text-xs opacity-70 font-mono tracking-wider">LOGGED IN AS</span>
                        <div className="flex items-center justify-center gap-2 mt-1">
                            <svg className="w-5 h-5 text-cyan-300" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            <span className="font-bold text-cyan-300 font-mono tracking-wide">{userName}</span>
                        </div>
                    </div>
                </div>
            </aside>
            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <header className="bg-gradient-to-r from-cyan-900 via-cyan-700 to-cyan-500 text-white p-6 shadow-lg flex items-center">
                    <h1 className="text-3xl font-bold tracking-wider flex-1 font-mono">Payment System</h1>
                    <span className="text-lg font-mono text-cyan-200">Hello, {user?.firstName || userName}!</span>
                </header>
                <main className="flex-grow p-8 bg-gray-950 bg-opacity-90 text-gray-100 shadow-inner">
                    <div className="rounded-xl border border-cyan-700 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-6 shadow-2xl">
                        {children}
                    </div>
                </main>
                <footer className="bg-gradient-to-r from-cyan-900 via-cyan-700 to-cyan-500 text-white p-4 text-center shadow-lg font-mono">
                    &copy; {new Date().getFullYear()} Payment System &mdash; Sci-Fi Edition
                </footer>
            </div>
        </div>
    );
}

export default Layout;          