import axios from 'axios';

// Use localhost for development. 
// Note: If running on a different device, this needs to be the machine's IP.
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';

const api = axios.create({
    baseURL: API_URL,
    timeout: 5000, // 5 seconds timeout
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const loginUser = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};

export const getUserProfile = async (email) => {
    const response = await api.get(`/users/me/profile?email=${email}`);
    return response.data;
};

export const getStudents = async () => {
    const response = await api.get('/users/students');
    return response.data;
};

export const getStudentById = async (id) => {
    const response = await api.get(`/users/students/${id}`);
    return response.data;
};

export const updateStudent = async (id, data) => {
    const response = await api.put(`/users/students/${id}`, data);
    return response.data;
};

export const createStudent = async (data) => {
    const response = await api.post('/users/students', data);
    return response.data;
};

export const getAttendance = async (params) => {
    const response = await api.get('/attendance/', { params });
    return response.data;
};

export const markAttendance = async (attendanceData) => {
    const response = await api.post('/attendance/batch', attendanceData);
    return response.data;
};

export const getResults = async (params) => {
    const response = await api.get('/results/', { params });
    return response.data;
};

export const saveResults = async (resultsData) => {
    const response = await api.post('/results/batch', resultsData);
    return response.data;
};

export const getEvents = async () => {
    const response = await api.get('/events/');
    return response.data;
};

export const createEvent = async (eventData) => {
    const response = await api.post('/events/', eventData);
    return response.data;
};

export const getNotifications = async () => {
    const response = await api.get('/notifications/');
    return response.data;
};

export const getSentNotifications = async () => {
    const response = await api.get('/notifications/sent');
    return response.data;
};

export const createNotification = async (notificationData) => {
    const response = await api.post('/notifications/', notificationData);
    return response.data;
};

export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/utils/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const getDashboardStats = async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
};

export const getTeachers = async () => {
    const response = await api.get('/teachers/');
    return response.data;
};

export const getTeacherById = async (id) => {
    const response = await api.get(`/teachers/${id}`);
    return response.data;
};

export const createTeacher = async (data) => {
    const response = await api.post('/teachers/', data);
    return response.data;
};

export const updateTeacher = async (id, data) => {
    const response = await api.put(`/teachers/${id}`, data);
    return response.data;
};

export default api;
