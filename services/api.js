import { Alert } from 'react-native';

const API_URL = 'http://127.0.0.1:8000/api/v1'; // Use localhost for Simulator

const timeout = (ms, promise) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error("Request timed out"));
        }, ms);
        promise.then(resolve, reject);
    });
};

export const loginUser = async (email, password) => {
    console.log(`[API] Logging in to: ${API_URL}/auth/login`);
    try {
        console.log("[API] Starting fetch request...");
        const response = await timeout(10000, fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        }));

        console.log("[API] Response status:", response.status);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || data.error || 'Login failed');
        }

        return data;
    } catch (error) {
        console.error('Login Error:', error);
        Alert.alert('Login Failed', error.message);
        throw error;
    }
};

export const registerUser = async (name, email, password, role) => {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password, role }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || data.error || 'Registration failed');
        }

        return data;
    } catch (error) {
        console.error('Registration Error:', error);
        Alert.alert('Registration Failed', error.message);
        throw error;
    }
};
export const changePassword = async (email, currentPassword, newPassword) => {
    try {
        const response = await fetch(`${API_URL}/auth/change-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, current_password: currentPassword, new_password: newPassword }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || data.error || 'Password change failed');
        }

        return data;
    } catch (error) {
        console.error('Change Password Error:', error);
        Alert.alert('Error', error.message);
        throw error;
    }
};

export const getUserProfile = async (email) => {
    try {
        const response = await fetch(`${API_URL}/users/me/profile?email=${email}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const text = await response.text();
        console.log("Profile Response:", text);
        try {
            const data = JSON.parse(text);
            if (!response.ok) {
                throw new Error(data.detail || 'Failed to fetch profile');
            }
            return data;
        } catch (e) {
            console.error("JSON Parse Error:", e, "Response was:", text);
            throw new Error("Invalid server response");
        }
    } catch (error) {
        console.error('Get Profile Error:', error);
        throw error;
    }
};

export const getEvents = async () => {
    try {
        const response = await fetch(`${API_URL}/events/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Failed to fetch events');
        }

        return data;
    } catch (error) {
        console.error('Get Events Error:', error);
        throw error;
    }
};

export const getFees = async () => {
    try {
        const response = await fetch(`${API_URL}/fees/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Failed to fetch fees');
        }

        return data;
    } catch (error) {
        console.error('Get Fees Error:', error);
        throw error;
    }
};

export const getAttendance = async () => {
    try {
        const response = await fetch(`${API_URL}/attendance/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Failed to fetch attendance');
        }

        return data;
    } catch (error) {
        console.error('Get Attendance Error:', error);
        throw error;
    }
};

export const getTimetable = async () => {
    try {
        const response = await fetch(`${API_URL}/timetable/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Failed to fetch timetable');
        }

        return data;
    } catch (error) {
        console.error('Get Timetable Error:', error);
        throw error;
    }
};

export const getResults = async () => {
    try {
        const response = await fetch(`${API_URL}/results/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Failed to fetch results');
        }

        return data;
    } catch (error) {
        console.error('Get Results Error:', error);
        throw error;
    }
};

export const getNotifications = async () => {
    try {
        const response = await fetch(`${API_URL}/notifications/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Failed to fetch notifications');
        }

        return data;
    } catch (error) {
        console.error('Get Notifications Error:', error);
        throw error;
    }
};

export const markNotificationAsRead = async (id) => {
    try {
        const response = await fetch(`${API_URL}/notifications/${id}/read`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Failed to mark notification as read');
        }

        return data;
    } catch (error) {
        console.error('Mark Notification Read Error:', error);
        throw error;
    }
};

export const getFeeds = async () => {
    try {
        const response = await fetch(`${API_URL}/feed/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Failed to fetch feeds');
        }

        return data;
    } catch (error) {
        console.error('Get Feeds Error:', error);
        throw error;
    }
};
