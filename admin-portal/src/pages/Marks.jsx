import React, { useState, useEffect } from 'react';
import { getStudents, saveResults, getResults } from '../services/api';
import { Save, CheckCircle, Search } from 'lucide-react';

const Marks = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedClass, setSelectedClass] = useState('1');
    const [selectedSection, setSelectedSection] = useState('A');
    const [examTitle, setExamTitle] = useState('Mid-Term Examination');
    const [subject, setSubject] = useState('Mathematics');
    const [marksData, setMarksData] = useState({});
    const [message, setMessage] = useState('');

    const subjects = ['Mathematics', 'Science', 'English', 'Social Studies', 'Computer', 'Art'];
    const exams = ['Periodic Test 1', 'Mid-Term Examination', 'Periodic Test 2', 'Final Examination'];

    useEffect(() => {
        fetchData();
    }, [selectedClass, selectedSection, examTitle, subject]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch students
            const allStudents = await getStudents();
            const filteredStudents = allStudents.filter(
                s => s.class_grade === selectedClass && s.section === selectedSection
            );
            setStudents(filteredStudents);

            // Fetch existing results
            const existingResults = await getResults({
                exam_title: examTitle,
                subject: subject
            });

            // Map existing results to state
            const initialMarks = {};
            filteredStudents.forEach(student => {
                const result = existingResults.find(r => r.student_id === student.id);
                if (result) {
                    initialMarks[student.id] = {
                        marks_obtained: result.marks_obtained,
                        total_marks: result.total_marks,
                        grade: result.grade
                    };
                } else {
                    initialMarks[student.id] = {
                        marks_obtained: '',
                        total_marks: 100,
                        grade: ''
                    };
                }
            });
            setMarksData(initialMarks);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkChange = (studentId, field, value) => {
        setMarksData(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                [field]: value
            }
        }));
    };

    const calculateGrade = (marks, total) => {
        if (!marks || !total) return '';
        const percentage = (marks / total) * 100;
        if (percentage >= 90) return 'A1';
        if (percentage >= 80) return 'A2';
        if (percentage >= 70) return 'B1';
        if (percentage >= 60) return 'B2';
        if (percentage >= 50) return 'C1';
        if (percentage >= 40) return 'C2';
        if (percentage <= 35) return 'F';
        return 'D';
    };

    const handleAutoGrade = () => {
        const newData = { ...marksData };
        Object.keys(newData).forEach(studentId => {
            const { marks_obtained, total_marks } = newData[studentId];
            newData[studentId].grade = calculateGrade(marks_obtained, total_marks);
        });
        setMarksData(newData);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setMessage('');
        try {
            const payload = Object.keys(marksData).map(studentId => ({
                student_id: parseInt(studentId),
                exam_title: examTitle,
                exam_date: new Date().toISOString().split('T')[0], // Default to today
                subject: subject,
                marks_obtained: parseFloat(marksData[studentId].marks_obtained) || 0,
                total_marks: parseFloat(marksData[studentId].total_marks) || 100,
                grade: marksData[studentId].grade
            }));

            await saveResults(payload);
            setMessage('Results saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error("Error saving results", error);
            setMessage('Failed to save results.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Marks Entry</h1>
                {message && (
                    <div className={`px-4 py-2 rounded flex items-center ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        <CheckCircle size={18} className="mr-2" />
                        {message}
                    </div>
                )}
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-6 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                    <select
                        className="border rounded-md p-2 w-full"
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
                        className="border rounded-md p-2 w-full"
                        value={selectedSection}
                        onChange={(e) => setSelectedSection(e.target.value)}
                    >
                        {['A', 'B', 'C', 'D'].map(sec => (
                            <option key={sec} value={sec}>{sec}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Exam</label>
                    <select
                        className="border rounded-md p-2 w-full"
                        value={examTitle}
                        onChange={(e) => setExamTitle(e.target.value)}
                    >
                        {exams.map(exam => (
                            <option key={exam} value={exam}>{exam}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <select
                        className="border rounded-md p-2 w-full"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    >
                        {subjects.map(sub => (
                            <option key={sub} value={sub}>{sub}</option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={fetchData}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                    Load Data
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
                        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-end">
                            <button
                                onClick={handleAutoGrade}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-4"
                            >
                                Auto-Calculate Grades
                            </button>
                        </div>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks Obtained</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Marks</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {students.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.admission_number}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="number"
                                                className="border rounded p-1 w-24"
                                                value={marksData[student.id]?.marks_obtained || ''}
                                                onChange={(e) => handleMarkChange(student.id, 'marks_obtained', e.target.value)}
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="number"
                                                className="border rounded p-1 w-24"
                                                value={marksData[student.id]?.total_marks || ''}
                                                onChange={(e) => handleMarkChange(student.id, 'total_marks', e.target.value)}
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="text"
                                                className="border rounded p-1 w-16 uppercase"
                                                value={marksData[student.id]?.grade || ''}
                                                onChange={(e) => handleMarkChange(student.id, 'grade', e.target.value)}
                                            />
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
                                Save Results
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Marks;
