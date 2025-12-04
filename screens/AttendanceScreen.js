import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { getAttendance } from '../services/api';

export default function AttendanceScreen({ navigation }) {
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [markedDates, setMarkedDates] = useState({});
    const [stats, setStats] = useState([
        { label: 'Total Days', value: 0, color: '#3b82f6' },
        { label: 'Present', value: 0, color: '#10b981' },
        { label: 'Absent', value: 0, color: '#ef4444' },
        { label: 'Holidays', value: 0, color: '#f59e0b' },
    ]);

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        try {
            const data = await getAttendance();
            setAttendanceData(data);
            processAttendanceData(data);
        } catch (error) {
            console.log("Failed to load attendance", error);
        } finally {
            setLoading(false);
        }
    };

    const processAttendanceData = (data) => {
        const marked = {};
        let present = 0;
        let absent = 0;
        let holidays = 0;
        let total = 0;

        data.forEach(record => {
            let color = '#9ca3af'; // Default gray
            if (record.status === 'Present') {
                color = '#10b981';
                present++;
            } else if (record.status === 'Absent') {
                color = '#ef4444';
                absent++;
            } else if (record.status === 'Half Day') {
                color = '#f97316'; // Orange
                present += 0.5;
                absent += 0.5;
            } else if (record.status === 'Holiday' || record.status === 'Late') {
                color = '#f59e0b';
                holidays++;
            } else if (record.status === 'Weekend') {
                color = '#9ca3af';
            }

            marked[record.date] = { selected: true, selectedColor: color };
            total++;
        });

        setMarkedDates(marked);
        setStats([
            { label: 'Total Days', value: total, color: '#3b82f6' },
            { label: 'Present', value: present, color: '#10b981' },
            { label: 'Absent', value: absent, color: '#ef4444' },
            { label: 'Holidays', value: holidays, color: '#f59e0b' },
        ]);
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#2196F3" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Attendance</Text>
            </View>

            {/* Calendar Card */}
            <View style={styles.card}>
                <Calendar
                    current={selectedMonth}
                    onMonthChange={(month) => setSelectedMonth(month.dateString.slice(0, 7))}
                    markedDates={markedDates}
                    theme={{
                        todayTextColor: '#3b82f6',
                        arrowColor: '#3b82f6',
                        textDayFontWeight: '600',
                        textMonthFontWeight: 'bold',
                        textDayHeaderFontWeight: '600',
                    }}
                />

                {/* Legend */}
                <View style={styles.legendContainer}>
                    <View style={styles.legendItem}>
                        <View style={[styles.dot, { backgroundColor: '#10b981' }]} />
                        <Text style={styles.legendText}>Present</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.dot, { backgroundColor: '#ef4444' }]} />
                        <Text style={styles.legendText}>Absent</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.dot, { backgroundColor: '#f97316' }]} />
                        <Text style={styles.legendText}>Half Day</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.dot, { backgroundColor: '#f59e0b' }]} />
                        <Text style={styles.legendText}>Holiday/Leave</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.dot, { backgroundColor: '#9ca3af' }]} />
                        <Text style={styles.legendText}>Weekend</Text>
                    </View>
                </View>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
                {stats.map((stat, index) => (
                    <View key={index} style={styles.statCard}>
                        <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                        <Text style={styles.statLabel}>{stat.label}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9fafb', paddingTop: 50 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 10, color: '#111' },

    card: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        borderRadius: 16,
        padding: 10,
        elevation: 3,
        marginBottom: 20,
    },
    legendContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 8,
        marginBottom: 8,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 6,
    },
    legendText: { fontSize: 12, color: '#4b5563' },

    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 8,
        marginBottom: 30,
    },
    statCard: {
        width: '45%',
        backgroundColor: '#fff',
        margin: '2.5%',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 2,
    },
    statValue: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
    statLabel: { fontSize: 14, color: '#6b7280' },
});
