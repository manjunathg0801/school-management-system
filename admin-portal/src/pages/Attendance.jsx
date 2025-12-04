import React, { useState, useEffect } from 'react';
import { getStudents, markAttendance, getAttendance } from '../services/api';
import { Calendar, Save, CheckCircle } from 'lucide-react';

const Attendance = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedClass, setSelectedClass] = useState('1');
    const [selectedSection, setSelectedSection] = useState('A');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendanceData, setAttendanceData] = useState({});
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchData();
    }, [selectedClass, selectedSection, selectedDate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch students
            const allStudents = await getStudents();
            const filteredStudents = allStudents.filter(
                s => s.class_grade === selectedClass && s.section === selectedSection
            );
            setStudents(filteredStudents);

            // Fetch existing attendance
            const existingAttendance = await getAttendance({
                class_grade: selectedClass,
                section: selectedSection,
                date_from: selectedDate,
                date_to: selectedDate
            });

            // Map existing attendance to state
            const initialAttendance = {};
            filteredStudents.forEach(student => {
                const record = existingAttendance.find(a => a.student_id === student.id);
                initialAttendance[student.id] = record ? record.status : 'Present';
            });
            setAttendanceData(initialAttendance);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (studentId, status) => {
        setAttendanceData(prev => ({
            ...prev,
            [studentId]: status
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setMessage('');
        try {
            const payload = Object.keys(attendanceData).map(studentId => ({
                student_id: parseInt(studentId),
                date: selectedDate,
                status: attendanceData[studentId],
                class_grade: selectedClass,
                section: selectedSection,
                remarks: attendanceData[studentId] === 'Absent' ? 'Marked by Admin' : null
            }));

            await markAttendance(payload);
            setMessage('Attendance saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error("Error saving attendance", error);
            setMessage('Failed to save attendance.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Attendance</h1>
                {message && (
                    <div className={`px-4 py-2 rounded flex items-center ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        <CheckCircle size={18} className="mr-2" />
                        {message}
                    </div>
                )}
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-wrap gap-4 items-end">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                    <select
                        className="border rounded-md p-2 w-32"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                    >
                        {[...Array(12)].map((_, i) => (
                            <option key={i + 1} value={String(i + 1)}>{i + 1}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                    <select
                        className="border rounded-md p-2 w-32"
                        value={selectedSection}
                        onChange={(e) => setSelectedSection(e.target.value)}
                    >
                        {['A', 'B', 'C', 'D'].map(sec => (
                            <option key={sec} value={sec}>{sec}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                        type="date"
                        className="border rounded-md p-2"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>
                <button
                    onClick={fetchData}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 ml-auto"
                >
                    Refresh
                </button>
            </div>

            {/* Student List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">Loading...</div>
                ) : students.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No students found for this class/section.</div>
                ) : (
                    <>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No / Adm No</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {students.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.admission_number}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex space-x-4">
                                                {['Present', 'Absent', 'Half Day', 'Late', 'Holiday'].map(status => (
                                                    <label key={status} className="inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name={`status-${student.id}`}
                                                            value={status}
                                                            checked={attendanceData[student.id] === status}
                                                            onChange={() => handleStatusChange(student.id, status)}
                                                            className="form-radio h-4 w-4 text-blue-600"
                                                        />
                                                        <span className={`ml-2 ${status === 'Absent' ? 'text-red-600' :
                                                            status === 'Late' ? 'text-orange-500' :
                                                                status === 'Holiday' ? 'text-purple-600' :
                                                                    status === 'Half Day' ? 'text-yellow-600' : 'text-green-600'
                                                            }`}>{status}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                            <button
                                onClick={handleSubmit}
                                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center font-bold"
                            >
                                <Save size={20} className="mr-2" />
                                Save Attendance
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Attendance;
