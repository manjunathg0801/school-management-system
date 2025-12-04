import React, { useState, useEffect } from 'react';
import { getSentNotifications, createNotification, uploadFile } from '../services/api';
import { Bell, CheckCircle, Eye, Paperclip, FileText } from 'lucide-react';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [uploading, setUploading] = useState(false);

    // Notification Form State
    const [newNotification, setNewNotification] = useState({
        title: '',
        message: '',
        student_id: '', // Empty for global
        grade: '',
        section: '',
        attachment_url: ''
    });

    useEffect(() => {
        fetchData();
        const interval = setInterval(() => {
            fetchData(true); // Pass true to indicate background refresh (optional, to avoid loading spinner if desired)
        }, 10000); // Refresh every 10 seconds

        return () => clearInterval(interval);
    }, []);

    const fetchData = async (isBackground = false) => {
        if (!isBackground) setLoading(true);
        try {
            const data = await getSentNotifications();
            setNotifications(data);
        } catch (error) {
            console.error("Error fetching notifications", error);
        } finally {
            if (!isBackground) setLoading(false);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const data = await uploadFile(file);
            // Assuming backend returns relative path, prepend API URL if needed
            // For now, assuming backend serves static files at root or we handle it
            // Let's assume we need to prepend the backend URL if it's relative
            // But since we are in dev, let's just use the relative path and let browser handle it if proxy is set up
            // Or better, let's store the full URL if possible, or just the path
            // The backend returns {url: "/static/uploads/..."}
            // We need to make sure this points to the backend server.
            // Since we are using Vite proxy or CORS, we might need the full URL.
            // Let's assume for now we just store what backend gives.

            // Actually, for display, we might need to prepend backend URL.
            // Let's hardcode backend URL for now or use environment variable
            const backendUrl = 'http://localhost:8000'; // Adjust as needed
            const fullUrl = `${backendUrl}${data.url}`;

            setNewNotification(prev => ({ ...prev, attachment_url: fullUrl }));
            setMessage('File uploaded successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error("Error uploading file", error);
            setMessage('File upload failed.');
        } finally {
            setUploading(false);
        }
    };

    const handleCreateNotification = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...newNotification,
                student_id: newNotification.student_id ? parseInt(newNotification.student_id) : null,
                grade: newNotification.grade || null,
                section: newNotification.section || null,
                attachment_url: newNotification.attachment_url || null
            };
            await createNotification(payload);
            setMessage('Notification sent successfully!');
            setNewNotification({ title: '', message: '', student_id: '', grade: '', section: '', attachment_url: '' });
            fetchData();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error("Error creating notification", error);
            const errorMsg = error.response?.data?.detail || 'Failed to send notification.';
            setMessage(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                    <Bell className="mr-3" size={32} />
                    Notifications
                </h1>
                {message && (
                    <div className={`px-4 py-2 rounded flex items-center ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        <CheckCircle size={18} className="mr-2" />
                        {message}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            Send Notification
                        </h2>

                        <form onSubmit={handleCreateNotification}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-md p-2"
                                    value={newNotification.title}
                                    onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea
                                    className="w-full border rounded-md p-2"
                                    rows="4"
                                    value={newNotification.message}
                                    onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                                    required
                                ></textarea>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Grade (Optional)</label>
                                    <input
                                        type="text"
                                        className="w-full border rounded-md p-2"
                                        placeholder="e.g. 10"
                                        value={newNotification.grade}
                                        onChange={(e) => setNewNotification({ ...newNotification, grade: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Section (Optional)</label>
                                    <input
                                        type="text"
                                        className="w-full border rounded-md p-2"
                                        placeholder="e.g. A"
                                        value={newNotification.section}
                                        onChange={(e) => setNewNotification({ ...newNotification, section: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Attachment (Optional)</label>
                                <div className="flex items-center space-x-2">
                                    <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md inline-flex items-center transition-colors">
                                        <Paperclip size={18} className="mr-2" />
                                        {uploading ? 'Uploading...' : 'Choose File'}
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                    {newNotification.attachment_url && (
                                        <span className="text-sm text-green-600 flex items-center">
                                            <CheckCircle size={14} className="mr-1" />
                                            Attached
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Student ID (Optional)</label>
                                <input
                                    type="number"
                                    className="w-full border rounded-md p-2"
                                    placeholder="Leave empty for global notification"
                                    value={newNotification.student_id}
                                    onChange={(e) => setNewNotification({ ...newNotification, student_id: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-bold">
                                Send Notification
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-4 border-b border-gray-200 bg-gray-50">
                            <h2 className="font-bold text-gray-700">
                                Sent Notifications
                            </h2>
                        </div>
                        <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                            {loading && notifications.length === 0 ? (
                                <div className="p-8 text-center">Loading...</div>
                            ) : notifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">No notifications sent yet.</div>
                            ) : (
                                notifications.map((batch) => (
                                    <div key={batch.id} className="p-4 hover:bg-gray-50">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-gray-800">{batch.title}</h3>
                                                <p className="text-sm text-gray-600 mt-1">{batch.message}</p>
                                                <div className="mt-2 flex items-center space-x-2 flex-wrap gap-y-2">
                                                    {batch.target_student_id ? (
                                                        <span className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-800">
                                                            Student #{batch.target_student_id}
                                                        </span>
                                                    ) : batch.target_grade || batch.target_section ? (
                                                        <>
                                                            {batch.target_grade && (
                                                                <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                                                                    Grade: {batch.target_grade}
                                                                </span>
                                                            )}
                                                            {batch.target_section && (
                                                                <span className="px-2 py-0.5 text-xs rounded-full bg-indigo-100 text-indigo-800">
                                                                    Sec: {batch.target_section}
                                                                </span>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">
                                                            Global
                                                        </span>
                                                    )}
                                                </div>
                                                {batch.attachment_url && (
                                                    <div className="mt-2">
                                                        <a
                                                            href={batch.attachment_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                                                        >
                                                            <FileText size={14} className="mr-1" />
                                                            View Attachment
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs text-gray-500 mb-1">
                                                    {new Date(batch.created_at).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center justify-end text-sm font-medium text-gray-700" title="Read / Total">
                                                    <Eye size={16} className="mr-1 text-blue-500" />
                                                    {batch.read_count} / {batch.total_count}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notifications;
