import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTeacherById, createTeacher, updateTeacher } from '../services/api';
import { ArrowLeft, Save, User, Mail, Lock } from 'lucide-react';

const TeacherDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = !id || id === 'new';

    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        is_active: true
    });
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isNew) {
            fetchTeacher();
        }
    }, [id]);

    const fetchTeacher = async () => {
        try {
            const data = await getTeacherById(id);
            setFormData({
                full_name: data.full_name,
                email: data.email,
                password: '', // Don't populate password
                is_active: data.is_active,
                phone_number: data.teacher_profile?.phone_number || '',
                address: data.teacher_profile?.address || '',
                qualification: data.teacher_profile?.qualification || '',
                subjects: data.teacher_profile?.subjects || '',
                date_of_joining: data.teacher_profile?.date_of_joining || ''
            });
        } catch (error) {
            console.error("Failed to fetch teacher details", error);
            setError("Failed to load teacher details.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        // Prepare data for API
        const apiData = {
            full_name: formData.full_name,
            email: formData.email,
            is_active: formData.is_active,
            profile: {
                phone_number: formData.phone_number,
                address: formData.address,
                qualification: formData.qualification,
                subjects: formData.subjects,
                date_of_joining: formData.date_of_joining || null
            }
        };

        if (formData.password) {
            apiData.password = formData.password;
        }

        try {
            if (isNew) {
                await createTeacher(apiData);
            } else {
                await updateTeacher(id, apiData);
            }
            navigate('/teachers');
        } catch (error) {
            console.error("Failed to save teacher", error);
            setError(error.response?.data?.detail || "Failed to save teacher. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading teacher details...</div>;

    return (
        <div className="max-w-3xl mx-auto">
            <button
                onClick={() => navigate('/teachers')}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
            >
                <ArrowLeft size={20} className="mr-2" />
                Back to Teachers
            </button>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-blue-600 px-6 py-4">
                    <h1 className="text-xl font-bold text-white">
                        {isNew ? 'Add New Teacher' : 'Edit Teacher'}
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4">
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Full Name */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User size={18} className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="full_name"
                                    required
                                    className="pl-10 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="John Doe"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail size={18} className="text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    disabled={!isNew}
                                    className={`pl-10 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${!isNew ? 'bg-gray-100' : ''}`}
                                    placeholder="john@school.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {isNew ? 'Password' : 'New Password (optional)'}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock size={18} className="text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    required={isNew}
                                    className="pl-10 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder={isNew ? "Enter password" : "Enter new password"}
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input
                                type="text"
                                name="phone_number"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="+1 234 567 890"
                                value={formData.phone_number || ''}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Date of Joining */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Joining</label>
                            <input
                                type="date"
                                name="date_of_joining"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.date_of_joining || ''}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Qualification */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                            <input
                                type="text"
                                name="qualification"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="M.Sc, B.Ed"
                                value={formData.qualification || ''}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Subjects */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subjects (comma separated)</label>
                            <input
                                type="text"
                                name="subjects"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Math, Physics"
                                value={formData.subjects || ''}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Address */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <textarea
                                name="address"
                                rows="3"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="123 Main St, City, Country"
                                value={formData.address || ''}
                                onChange={handleChange}
                            ></textarea>
                        </div>

                        {/* Status */}
                        {!isNew && (
                            <div className="flex items-center md:col-span-2">
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    id="is_active"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    checked={formData.is_active}
                                    onChange={handleChange}
                                />
                                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                                    Active Account
                                </label>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/teachers')}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg mr-4 hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center hover:bg-blue-700 disabled:opacity-50"
                        >
                            <Save size={20} className="mr-2" />
                            {saving ? 'Saving...' : 'Save Teacher'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TeacherDetails;
