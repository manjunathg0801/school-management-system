import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getNotifications, markNotificationAsRead } from '../services/api';
import { NotificationContext } from '../contexts/NotificationContext';
import { useFocusEffect } from '@react-navigation/native';

export default function NotificationsScreen({ navigation }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const { decrementUnreadCount, fetchUnreadCount } = React.useContext(NotificationContext);

    useFocusEffect(
        React.useCallback(() => {
            fetchNotifications();
            fetchUnreadCount();
        }, [])
    );

    const fetchNotifications = async () => {
        try {
            const data = await getNotifications();
            setNotifications(data);
        } catch (error) {
            console.log("Failed to load notifications", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await markNotificationAsRead(id);
            // Update local state to reflect change
            setNotifications(prev =>
                prev.map(item => item.id === id ? { ...item, is_read: true } : item)
            );
            // Update global count
            decrementUnreadCount();
        } catch (error) {
            console.log("Failed to mark as read", error);
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        return `${Math.floor(diffInSeconds / 86400)} days ago`;
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.card, !item.is_read && styles.unreadCard]}
            onPress={() => !item.is_read && handleMarkAsRead(item.id)}
        >
            <View style={styles.iconContainer}>
                <View style={[styles.iconBg, !item.is_read && styles.unreadIconBg]}>
                    <Ionicons
                        name="notifications-outline"
                        size={24}
                        color={item.is_read ? '#6b7280' : '#3b82f6'}
                    />
                </View>
            </View>
            <View style={styles.contentContainer}>
                <View style={styles.headerRow}>
                    <Text style={[styles.title, !item.is_read && styles.unreadTitle]}>{item.title}</Text>
                    <Text style={styles.time}>{formatTime(item.created_at)}</Text>
                </View>
                <Text style={styles.message} numberOfLines={2}>
                    {item.message}
                </Text>
                {item.attachment_url && (
                    <TouchableOpacity
                        style={styles.attachmentButton}
                        onPress={() => {
                            const baseUrl = 'http://127.0.0.1:8000';
                            const url = item.attachment_url.startsWith('http')
                                ? item.attachment_url
                                : `${baseUrl}${item.attachment_url}`;
                            Linking.openURL(url);
                        }}
                    >
                        <Ionicons name="attach" size={16} color="#3b82f6" />
                        <Text style={styles.attachmentText}>View Attachment</Text>
                    </TouchableOpacity>
                )}
            </View>
            {!item.is_read && <View style={styles.dot} />}
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#2196F3" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
            </View>

            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No notifications yet.</Text>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', paddingTop: 50 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
        paddingBottom: 16,
    },
    headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 10, color: '#111' },
    listContent: { padding: 16 },

    card: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#fff',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#f3f4f6',
    },
    unreadCard: {
        backgroundColor: '#eff6ff',
        borderColor: '#bfdbfe',
    },
    iconContainer: { marginRight: 12 },
    iconBg: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#f3f4f6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    unreadIconBg: {
        backgroundColor: '#dbeafe',
    },
    contentContainer: { flex: 1 },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    title: { fontSize: 16, fontWeight: '600', color: '#374151', flex: 1, marginRight: 8 },
    unreadTitle: { color: '#111', fontWeight: 'bold' },
    time: { fontSize: 12, color: '#9ca3af' },
    message: { fontSize: 14, color: '#6b7280', lineHeight: 20 },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#3b82f6',
        position: 'absolute',
        top: 16,
        right: 16,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 40,
        color: '#9ca3af',
        fontSize: 16,
    },
    attachmentButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        padding: 4,
    },
    attachmentText: {
        color: '#3b82f6',
        fontSize: 14,
        marginLeft: 4,
        fontWeight: '500',
    },
});
