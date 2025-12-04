import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStudentById, updateStudent, createStudent } from '../services/api';
import { User, MapPin, Phone, Users, Save, ArrowLeft, CheckCircle } from 'lucide-react';

const StudentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState('profile');

    const isNew = id === 'new';

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        full_name: '',
        admission_number: '',
        date_of_birth: '',
        gender: '',
        blood_group: '',
        class_grade: '',
        section: '',
        address: {
            street: '',
            city: '',
            state: '',
            zip_code: '',
            country: ''
        },
        parent_profile: {
            father_name: '',
            father_occupation: '',
            father_phone: '',
            mother_name: '',
            mother_occupation: '',
            mother_phone: ''
        },
        emergency_contact: {
            contact_name: '',
            relation_type: '',
            phone_number: ''
        }
    });

    useEffect(() => {
        fetchStudentData();
    }, [id]);

    const fetchStudentData = async () => {
        if (isNew) {
            setLoading(false);
            return;
        }
        try {
            const data = await getStudentById(id);
            // Merge with default structure to handle nulls
            setFormData({
                ...formData,
                ...data,
                address: { ...formData.address, ...(data.address || {}) },
                parent_profile: { ...formData.parent_profile, ...(data.parent_profile || {}) },
                emergency_contact: { ...formData.emergency_contact, ...(data.emergency_contact || {}) }
            });
        } catch (error) {
            console.error("Failed to fetch student details", error);
            setMessage('Failed to load student details.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (section, field, value) => {
        if (section === 'root') {
            setFormData(prev => ({ ...prev, [field]: value }));
        } else {
            setFormData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value
                }
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        try {
            if (isNew) {
                await createStudent(formData);
                setMessage('Student created successfully!');
                setTimeout(() => navigate('/students'), 1500);
            } else {
                await updateStudent(id, formData);
                setMessage('Student details updated successfully!');
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (error) {
            console.error("Failed to save student", error);
            setMessage(isNew ? 'Failed to create student.' : 'Failed to update student details.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    const tabs = [
        { id: 'profile', label: 'Student Profile', icon: User },
        { id: 'parent', label: 'Parent Information', icon: Users },
        { id: 'address', label: 'Address', icon: MapPin },
        { id: 'emergency', label: 'Emergency Contact', icon: Phone },
    ];

    return (
        <div>
            <div className="flex items-center mb-6">
                <button
                    onClick={() => navigate('/students')}
                    className="mr-4 p-2 rounded-full hover:bg-gray-200"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-3xl font-bold text-gray-800">{isNew ? 'Add New Student' : 'Student Details'}</h1>
                {message && (
                    <div className={`ml-auto px-4 py-2 rounded flex items-center ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        <CheckCircle size={18} className="mr-2" />
                        {message}
                    </div>
                )}
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="flex border-b border-gray-200">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex - 1 py - 4 px - 6 text - center font - medium flex items - center justify - center ${activeTab === tab.id
                                ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                } `}
                        >
                            <tab.icon size={18} className="mr-2" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit}>
                        {activeTab === 'profile' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {isNew && (
                                    <>
                                        <div className="col-span-2 md:col-span-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                            <input
                                                type="text"
                                                className="w-full border rounded-md p-2"
                                                value={formData.full_name || ''}
                                                onChange={(e) => handleChange('root', 'full_name', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="col-span-2 md:col-span-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                            <input
                                                type="email"
                                                className="w-full border rounded-md p-2"
                                                value={formData.email || ''}
                                                onChange={(e) => handleChange('root', 'email', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="col-span-2 md:col-span-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                            <input
                                                type="password"
                                                className="w-full border rounded-md p-2"
                                                value={formData.password || ''}
                                                onChange={(e) => handleChange('root', 'password', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="col-span-2 border-t border-gray-100 my-2"></div>
                                    </>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Admission Number</label>
                                    <input
                                        type="text"
                                        className="w-full border rounded-md p-2"
                                        value={formData.admission_number || ''}
                                        onChange={(e) => handleChange('root', 'admission_number', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                    <input
                                        type="date"
                                        className="w-full border rounded-md p-2"
                                        value={formData.date_of_birth || ''}
                                        onChange={(e) => handleChange('root', 'date_of_birth', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                    <select
                                        className="w-full border rounded-md p-2"
                                        value={formData.gender || ''}
                                        onChange={(e) => handleChange('root', 'gender', e.target.value)}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                                    <input
                                        type="text"
                                        className="w-full border rounded-md p-2"
                                        value={formData.blood_group || ''}
                                        onChange={(e) => handleChange('root', 'blood_group', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                                    <select
                                        className="w-full border rounded-md p-2"
                                        value={formData.class_grade || ''}
                                        onChange={(e) => handleChange('root', 'class_grade', e.target.value)}
                                    >
                                        <option value="">Select Class</option>
                                        {[...Array(12)].map((_, i) => (
                                            <option key={i + 1} value={String(i + 1)}>{i + 1}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                                    <select
                                        className="w-full border rounded-md p-2"
                                        value={formData.section || ''}
                                        onChange={(e) => handleChange('root', 'section', e.target.value)}
                                    >
                                        <option value="">Select Section</option>
                                        {['A', 'B', 'C', 'D'].map(sec => (
                                            <option key={sec} value={sec}>{sec}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        {activeTab === 'parent' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label>
                                    <input
                                        type="text"
                                        className="w-full border rounded-md p-2"
                                        value={formData.parent_profile.father_name || ''}
                                        onChange={(e) => handleChange('parent_profile', 'father_name', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Father's Occupation</label>
                                    <input
                                        type="text"
                                        className="w-full border rounded-md p-2"
                                        value={formData.parent_profile.father_occupation || ''}
                                        onChange={(e) => handleChange('parent_profile', 'father_occupation', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Father's Phone</label>
                                    <input
                                        type="text"
                                        className="w-full border rounded-md p-2"
                                        value={formData.parent_profile.father_phone || ''}
                                        onChange={(e) => handleChange('parent_profile', 'father_phone', e.target.value)}
                                    />
                                </div>
                                <div className="col-span-2 border-t border-gray-100 my-2"></div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Name</label>
                                    <input
                                        type="text"
                                        className="w-full border rounded-md p-2"
                                        value={formData.parent_profile.mother_name || ''}
                                        onChange={(e) => handleChange('parent_profile', 'mother_name', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Occupation</label>
                                    <input
                                        type="text"
                                        className="w-full border rounded-md p-2"
                                        value={formData.parent_profile.mother_occupation || ''}
                                        onChange={(e) => handleChange('parent_profile', 'mother_occupation', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Phone</label>
                                    <input
                                        type="text"
                                        className="w-full border rounded-md p-2"
                                        value={formData.parent_profile.mother_phone || ''}
                                        onChange={(e) => handleChange('parent_profile', 'mother_phone', e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === 'address' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                                    <input
                                        type="text"
                                        className="w-full border rounded-md p-2"
                                        value={formData.address.street || ''}
                                        onChange={(e) => handleChange('address', 'street', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                    <input
                                        type="text"
                                        className="w-full border rounded-md p-2"
                                        value={formData.address.city || ''}
                                        onChange={(e) => handleChange('address', 'city', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                    <input
                                        type="text"
                                        className="w-full border rounded-md p-2"
                                        value={formData.address.state || ''}
                                        onChange={(e) => handleChange('address', 'state', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                                    <input
                                        type="text"
                                        className="w-full border rounded-md p-2"
                                        value={formData.address.zip_code || ''}
                                        onChange={(e) => handleChange('address', 'zip_code', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                    <input
                                        type="text"
                                        className="w-full border rounded-md p-2"
                                        value={formData.address.country || ''}
                                        onChange={(e) => handleChange('address', 'country', e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === 'emergency' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                                    <input
                                        type="text"
                                        className="w-full border rounded-md p-2"
                                        value={formData.emergency_contact.contact_name || ''}
                                        onChange={(e) => handleChange('emergency_contact', 'contact_name', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Relation</label>
                                    <input
                                        type="text"
                                        className="w-full border rounded-md p-2"
                                        value={formData.emergency_contact.relation_type || ''}
                                        onChange={(e) => handleChange('emergency_contact', 'relation_type', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        type="text"
                                        className="w-full border rounded-md p-2"
                                        value={formData.emergency_contact.phone_number || ''}
                                        onChange={(e) => handleChange('emergency_contact', 'phone_number', e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="mt-8 flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center font-bold disabled:opacity-50"
                            >
                                <Save size={20} className="mr-2" />
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StudentDetails;
