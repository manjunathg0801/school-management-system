import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getTimetable } from '../services/api';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function TimetableScreen({ navigation }) {
    const [selectedDay, setSelectedDay] = useState('Mon');
    const [timetableData, setTimetableData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTimetable();
    }, []);

    const fetchTimetable = async () => {
        try {
            const data = await getTimetable();
            processTimetableData(data);
        } catch (error) {
            console.log("Failed to load timetable", error);
        } finally {
            setLoading(false);
        }
    };

    const processTimetableData = (data) => {
        const grouped = {};
        DAYS.forEach(day => grouped[day] = []);

        data.forEach(item => {
            if (grouped[item.day_of_week]) {
                grouped[item.day_of_week].push({
                    time: `${item.start_time.slice(0, 5)} - ${item.end_time.slice(0, 5)}`,
                    subject: item.subject,
                    teacher: item.teacher
                });
            }
        });

        setTimetableData(grouped);
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{item.time}</Text>
            </View>
            <View style={styles.subjectContainer}>
                <Text style={styles.subjectText}>{item.subject}</Text>
                {item.teacher ? <Text style={styles.teacherText}>{item.teacher}</Text> : null}
            </View>
        </View>
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
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Timetable</Text>
            </View>

            {/* Day Selector */}
            <View style={styles.daySelector}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {DAYS.map((day) => (
                        <TouchableOpacity
                            key={day}
                            style={[styles.dayButton, selectedDay === day && styles.dayButtonActive]}
                            onPress={() => setSelectedDay(day)}
                        >
                            <Text style={[styles.dayText, selectedDay === day && styles.dayTextActive]}>
                                {day}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Timetable List */}
            <FlatList
                data={timetableData[selectedDay] || []}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No classes scheduled for this day.</Text>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9fafb', paddingTop: 50 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 10, color: '#111' },

    daySelector: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        elevation: 2,
        marginBottom: 10,
    },
    dayButton: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: '#f3f4f6',
        marginRight: 10,
    },
    dayButtonActive: {
        backgroundColor: '#3b82f6',
    },
    dayText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6b7280',
    },
    dayTextActive: {
        color: '#fff',
    },

    listContent: { padding: 16 },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        alignItems: 'center',
    },
    timeContainer: {
        width: 100,
        borderRightWidth: 1,
        borderRightColor: '#e5e7eb',
        marginRight: 16,
    },
    timeText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#3b82f6',
    },
    subjectContainer: { flex: 1 },
    subjectText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111',
    },
    teacherText: {
        fontSize: 13,
        color: '#6b7280',
        marginTop: 4,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 40,
        color: '#9ca3af',
        fontSize: 16,
    },
});
