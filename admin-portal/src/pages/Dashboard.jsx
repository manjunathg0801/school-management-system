import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/api';
import { Users, Calendar, Award, TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
        <div className={`p-4 rounded-full ${color} text-white mr-4`}>
            <Icon size={24} />
        </div>
        <div>
            <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        total_students: 0,
        total_teachers: 0,
        events_this_month: 0,
        avg_attendance: 0
    });
    const [recentNotices, setRecentNotices] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getDashboardStats();
                setStats(data.stats);
                setRecentNotices(data.recent_notices);
                setUpcomingEvents(data.upcoming_events);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { title: 'Total Students', value: stats.total_students, icon: Users, color: 'bg-blue-500' },
        { title: 'Total Teachers', value: stats.total_teachers, icon: Award, color: 'bg-green-500' },
        { title: 'Events This Month', value: stats.events_this_month, icon: Calendar, color: 'bg-purple-500' },
        { title: 'Avg. Attendance', value: `${stats.avg_attendance}%`, icon: TrendingUp, color: 'bg-orange-500' },
    ];

    if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activities / Notices */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Notices</h2>
                    <div className="space-y-4">
                        {recentNotices.length === 0 ? (
                            <p className="text-gray-500">No recent notices.</p>
                        ) : (
                            recentNotices.map((notice) => (
                                <div key={notice.id} className="border-l-4 border-blue-500 pl-4 py-2">
                                    <p className="text-sm text-gray-500">{notice.created_at}</p>
                                    <p className="font-medium text-gray-800">{notice.title}: {notice.message}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Upcoming Events */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Upcoming Events</h2>
                    <div className="space-y-4">
                        {upcomingEvents.length === 0 ? (
                            <p className="text-gray-500">No upcoming events.</p>
                        ) : (
                            upcomingEvents.map((event) => (
                                <div key={event.id} className="flex items-center">
                                    <div className="bg-blue-100 text-blue-600 p-3 rounded-lg text-center min-w-[60px]">
                                        <span className="block text-xs font-bold">{new Date(event.start_time).toLocaleString('default', { month: 'short' }).toUpperCase()}</span>
                                        <span className="block text-xl font-bold">{new Date(event.start_time).getDate()}</span>
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="font-bold text-gray-800">{event.title}</h4>
                                        <p className="text-sm text-gray-500">{event.location || 'School Campus'} • {event.description}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
