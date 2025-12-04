import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    CalendarCheck,
    GraduationCap,
    Calendar,
    LogOut,
    Menu,
    X,
    ChevronDown,
    ChevronRight,
    BookOpen,
    Settings,
    MessageSquare,
    Bell
} from 'lucide-react';

const Layout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(window.innerWidth >= 768);
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

    React.useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            // Only force close if moving to mobile, otherwise respect user choice or default to open on desktop if previously mobile
            if (mobile) {
                setIsSidebarOpen(false);
            } else if (isMobile) {
                // If transitioning from mobile to desktop, open it
                setIsSidebarOpen(true);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMobile]);

    const navGroups = [
        {
            title: null,
            icon: null,
            items: [
                { path: '/', label: 'Dashboard', icon: LayoutDashboard },
            ]
        },
        {
            title: 'Academics',
            icon: BookOpen,
            items: [
                { path: '/students', label: 'Students', icon: Users },
                { path: '/attendance', label: 'Attendance', icon: CalendarCheck },
                { path: '/marks', label: 'Marks & Results', icon: GraduationCap },
            ]
        },
        {
            title: 'Administration',
            icon: Settings,
            items: [
                { path: '/teachers', label: 'Teachers', icon: GraduationCap },
            ]
        },
        {
            title: 'Communication',
            icon: MessageSquare,
            items: [
                { path: '/events', label: 'Events & Holidays', icon: Calendar },
                { path: '/notifications', label: 'Notifications', icon: Bell },
            ]
        }
    ];

    const [expandedGroups, setExpandedGroups] = React.useState({
        'Academics': true,
        'Administration': true,
        'Communication': true
    });

    const toggleGroup = (title) => {
        if (!title) return;
        setExpandedGroups(prev => ({
            ...prev,
            [title]: !prev[title]
        }));
    };

    return (
        <div className="flex h-screen bg-gray-100 relative">
            {/* Mobile Header */}
            {isMobile && (
                <div className="bg-white p-4 flex items-center justify-between shadow-sm absolute top-0 left-0 right-0 z-10 h-16">
                    <span className="font-bold text-xl text-gray-800">School Admin</span>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 rounded hover:bg-gray-100 transition-colors text-gray-600"
                    >
                        <Menu size={24} />
                    </button>
                </div>
            )}

            {/* Backdrop for Mobile */}
            {isMobile && isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`bg-slate-900 text-white transition-all duration-300 ease-in-out flex flex-col
                    ${isMobile
                        ? `fixed inset-y-0 left-0 z-30 w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
                        : `relative ${isSidebarOpen ? 'w-64' : 'w-20'}`
                    }
                `}
            >
                <div className="p-4 flex items-center justify-between border-b border-slate-800 h-16">
                    {(!isMobile && isSidebarOpen) || isMobile ? <span className="font-bold text-xl">School Admin</span> : null}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded hover:bg-slate-800 transition-colors"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="flex-1 py-4 overflow-y-auto">
                    {navGroups.map((group, groupIndex) => {
                        const isCollapsed = !isMobile && !isSidebarOpen;
                        const GroupIcon = group.icon;

                        // If collapsed and group has title, show Group Icon
                        if (isCollapsed && group.title) {
                            return (
                                <div key={groupIndex} className="mb-4 px-2">
                                    <button
                                        onClick={() => {
                                            setIsSidebarOpen(true);
                                            setExpandedGroups(prev => ({ ...prev, [group.title]: true }));
                                        }}
                                        className="w-full flex justify-center p-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                                        title={group.title}
                                    >
                                        <GroupIcon size={24} />
                                    </button>
                                </div>
                            );
                        }

                        // If collapsed and NO title (e.g. Dashboard), show items directly (icons only)
                        if (isCollapsed && !group.title) {
                            return (
                                <div key={groupIndex} className="mb-4 px-2">
                                    {group.items.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = location.pathname === item.path;
                                        return (
                                            <Link
                                                key={item.path}
                                                to={item.path}
                                                className={`flex justify-center p-3 rounded-lg transition-colors ${isActive
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                                    }`}
                                                title={item.label}
                                            >
                                                <Icon size={24} />
                                            </Link>
                                        );
                                    })}
                                </div>
                            );
                        }

                        // Expanded State (Mobile or Desktop Open)
                        return (
                            <div key={groupIndex} className="mb-4">
                                {group.title && (
                                    <button
                                        onClick={() => toggleGroup(group.title)}
                                        className="w-full px-4 py-2 flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-300 transition-colors focus:outline-none"
                                    >
                                        <div className="flex items-center">
                                            {GroupIcon && <GroupIcon size={16} className="mr-2" />}
                                            <span>{group.title}</span>
                                        </div>
                                        {expandedGroups[group.title] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                    </button>
                                )}
                                {(!group.title || expandedGroups[group.title]) && (
                                    <ul className="space-y-1 px-2">
                                        {group.items.map((item) => {
                                            const Icon = item.icon;
                                            const isActive = location.pathname === item.path;
                                            return (
                                                <li key={item.path}>
                                                    <Link
                                                        to={item.path}
                                                        onClick={() => isMobile && setIsSidebarOpen(false)}
                                                        className={`flex items-center p-3 rounded-lg transition-colors ${isActive
                                                            ? 'bg-blue-600 text-white'
                                                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                                            }`}
                                                    >
                                                        <Icon size={20} />
                                                        <span className="ml-3">{item.label}</span>
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className={`flex items-center ${(!isMobile && !isSidebarOpen) && 'justify-center'}`}>
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shrink-0">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        {((!isMobile && isSidebarOpen) || isMobile) && (
                            <div className="ml-3 overflow-hidden">
                                <p className="text-sm font-medium truncate">{user?.name}</p>
                                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={logout}
                        className={`mt-4 w-full flex items-center ${(!isMobile && isSidebarOpen) || isMobile ? 'px-4' : 'justify-center'
                            } py-2 text-red-400 hover:bg-slate-800 rounded-lg transition-colors`}
                    >
                        <LogOut size={20} />
                        {((!isMobile && isSidebarOpen) || isMobile) && <span className="ml-3">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 overflow-auto ${isMobile ? 'pt-16' : ''}`}>
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
