import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudents } from '../services/api';
import { Search, Plus, Filter } from 'lucide-react';

const Students = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [filterClass, setFilterClass] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const data = await getStudents();
            setStudents(data);
        } catch (error) {
            console.error("Failed to fetch students", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(student => {
        const matchesSearch = (student.admission_number && student.admission_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (student.class_grade && student.class_grade.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesClass = filterClass ? student.class_grade === filterClass : true;

        return matchesSearch && matchesClass;
    });

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Students</h1>
                <button
                    onClick={() => navigate('/students/new')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700"
                >
                    <Plus size={20} className="mr-2" />
                    Add Student
                </button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex items-center justify-between">
                <div className="relative w-full max-w-md">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-5 w-5 text-gray-400" />
                    </span>
                    <input
                        type="text"
                        className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="Search by Admission No or Class..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative">
                    <button
                        onClick={() => setShowFilter(!showFilter)}
                        className={`flex items-center px-4 py-2 rounded-lg border ${showFilter ? 'bg-blue-50 border-blue-200 text-blue-600' : 'text-gray-600 border-transparent hover:bg-gray-100'}`}
                    >
                        <Filter size={20} className="mr-2" />
                        Filter
                    </button>

                    {showFilter && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-100 p-4">
                            <div className="text-xs font-semibold text-gray-500 mb-2">Filter by Class</div>
                            <select
                                className="w-full border rounded p-2 text-sm focus:outline-none focus:border-blue-500"
                                value={filterClass}
                                onChange={(e) => setFilterClass(e.target.value)}
                            >
                                <option value="">All Classes</option>
                                {[...Array(12)].map((_, i) => (
                                    <option key={i + 1} value={String(i + 1)}>Class {i + 1}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admission No</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DOB</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredStudents.map((student) => (
                            <tr key={student.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.admission_number}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.class_grade}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.section}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.gender}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.date_of_birth}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => navigate(`/students/${student.id}`)}
                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                    >
                                        Edit
                                    </button>
                                    <button className="text-red-600 hover:text-red-900">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredStudents.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        No students found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Students;
