import React, { createContext, useState, useEffect, useContext } from 'react';
import { getNotifications } from '../services/api';
import { UserContext } from './UserContext';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [unreadCount, setUnreadCount] = useState(0);
    const { isLoggedIn } = useContext(UserContext);

    useEffect(() => {
        let interval;
        if (isLoggedIn) {
            fetchUnreadCount();
            // Poll every 30 seconds
            interval = setInterval(fetchUnreadCount, 30000);
        }
        return () => clearInterval(interval);
    }, [isLoggedIn]);

    const fetchUnreadCount = async () => {
        try {
            const data = await getNotifications();
            const unread = data.filter(n => !n.is_read).length;
            setUnreadCount(unread);
        } catch (error) {
            console.log("Failed to fetch notification count", error);
        }
    };

    const updateUnreadCount = (count) => {
        setUnreadCount(count);
    };

    const decrementUnreadCount = () => {
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    return (
        <NotificationContext.Provider value={{ unreadCount, updateUnreadCount, decrementUnreadCount, fetchUnreadCount }}>
            {children}
        </NotificationContext.Provider>
    );
};
