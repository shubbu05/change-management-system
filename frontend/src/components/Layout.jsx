import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FileText, PlusCircle, LogOut, Users } from 'lucide-react';

const Layout = () => {

    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { label: 'Change Requests', path: '/crs', icon: <FileText size={20} /> },
    ];

    // Submit CR (Requester + Admin)
    if (user && (user.role === 'Change Requester' || user.role === 'Admin')) {
        navItems.push({
            label: 'Submit CR',
            path: '/crs/new',
            icon: <PlusCircle size={20} />
        });
    }

    // ✅ Admin User Management
    if (user && user.role === 'Admin') {
        navItems.push({
            label: 'User Management',
            path: '/users',
            icon: <Users size={20} />
        });
    }

    return (

        <div className="flex h-screen bg-gray-100">

            {/* Sidebar */}
            <aside className="w-64 bg-blue-900 text-white shadow-xl flex flex-col">

                {/* Logo */}
                <div className="p-6 border-b border-blue-800 flex items-center gap-3">

                    <img
                        src="/aai-logo.png"
                        alt="AAI Logo"
                        className="h-10 w-auto object-contain"
                    />

                    <div>
                        <h1 className="font-bold text-lg">AAI</h1>
                        <p className="text-xs text-blue-200">Change Management</p>
                    </div>

                </div>

                {/* Logged in user */}
                <div className="px-6 py-4 border-b border-blue-800">

                    <p className="text-xs uppercase text-blue-300 font-semibold mb-1">
                        Logged in as
                    </p>

                    <p className="font-semibold text-sm text-white">
                        {user?.username}
                    </p>

                    <p className="text-xs text-blue-200">
                        {user?.role}
                    </p>

                </div>

                {/* Navigation */}
                <nav className="flex-1 mt-4">

                    <ul className="space-y-2 px-4">

                        {navItems.map(item => {

                            const active = location.pathname.startsWith(item.path);

                            return (

                                <li key={item.path}>

                                    <Link
                                        to={item.path}
                                        className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all
                                        ${active
                                                ? 'bg-blue-700 text-white shadow'
                                                : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                                            }`}
                                    >

                                        <span className="mr-3">{item.icon}</span>

                                        {item.label}

                                    </Link>

                                </li>

                            );

                        })}

                    </ul>

                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-blue-800">

                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-3 text-sm font-medium text-blue-100 hover:bg-blue-800 rounded-lg transition"
                    >

                        <LogOut size={20} className="mr-3" />

                        Logout

                    </button>

                </div>

            </aside>


            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">

                {/* Header */}
                <header className="bg-white shadow-sm px-8 py-4 flex items-center justify-between">

                    <h2 className="text-xl font-bold text-gray-900">
                        Airport Authority of India – Change Management System
                    </h2>

                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                    <Outlet />
                </div>

            </main>

        </div>

    );

};

export default Layout;