import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SectionList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getResults } from '../services/api';

export default function AssessmentScreen({ navigation }) {
    const [assessmentData, setAssessmentData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            const data = await getResults();
            processResultsData(data);
        } catch (error) {
            console.log("Failed to load results", error);
        } finally {
            setLoading(false);
        }
    };

    const processResultsData = (data) => {
        const grouped = {};

        data.forEach(item => {
            if (!grouped[item.exam_title]) {
                grouped[item.exam_title] = [];
            }
            grouped[item.exam_title].push(item);
        });

        const sections = Object.keys(grouped).map(title => ({
            title: title,
            data: grouped[title]
        }));

        setAssessmentData(sections);
    };

    const renderSectionHeader = ({ section: { title } }) => (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
        </View>
    );

    const renderItem = ({ item }) => (
        <View style={styles.row}>
            <View style={{ flex: 1 }}>
                <Text style={styles.subject}>{item.subject}</Text>
            </View>
            <View style={styles.marksContainer}>
                <Text style={styles.marks}>{item.marks_obtained}/{item.total_marks}</Text>
                <View style={[styles.gradeBadge, { backgroundColor: getGradeColor(item.grade) }]}>
                    <Text style={styles.grade}>{item.grade}</Text>
                </View>
            </View>
        </View>
    );

    const getGradeColor = (grade) => {
        if (grade === 'A1') return '#dcfce7'; // Green
        if (grade === 'A2') return '#ecfccb'; // Lime
        if (grade === 'B1') return '#fef9c3'; // Yellow
        return '#f3f4f6'; // Gray
    };

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
                <Text style={styles.headerTitle}>Assessment</Text>
            </View>

            <SectionList
                sections={assessmentData}
                keyExtractor={(item, index) => item.subject + index}
                renderItem={renderItem}
                renderSectionHeader={renderSectionHeader}
                contentContainerStyle={styles.listContent}
                stickySectionHeadersEnabled={false}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                renderSectionFooter={() => <View style={{ height: 20 }} />}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No results found.</Text>
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
        marginBottom: 10,
    },
    headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 10, color: '#111' },
    listContent: { padding: 16 },

    sectionHeader: {
        backgroundColor: '#3b82f6',
        padding: 12,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        marginTop: 10,
    },
    sectionTitle: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        justifyContent: 'space-between',
    },
    subject: { fontSize: 16, color: '#374151', fontWeight: '500' },
    marksContainer: { flexDirection: 'row', alignItems: 'center' },
    marks: { fontSize: 16, fontWeight: 'bold', marginRight: 12, color: '#111' },
    gradeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        minWidth: 36,
        alignItems: 'center',
    },
    grade: { fontSize: 14, fontWeight: 'bold', color: '#374151' },

    separator: { height: 1, backgroundColor: '#f3f4f6' },
    emptyText: {
        textAlign: 'center',
        marginTop: 40,
        color: '#9ca3af',
        fontSize: 16,
    },
});
