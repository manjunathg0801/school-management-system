import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, SafeAreaView, StatusBar } from "react-native";
import { Calendar, MapPin, Clock, ArrowLeft } from "lucide-react-native";
import { getEvents } from "../services/api";
import { useNavigation } from "@react-navigation/native";

export default function HolidayScreen() {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState("Holiday");
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const data = await getEvents();
            setEvents(data);
        } catch (error) {
            console.log("Failed to load events", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredData = events.filter(
        (item) => item.type.toLowerCase() === activeTab.toLowerCase()
    );

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.dateBox}>
                <Text style={styles.dateText}>{new Date(item.date).getDate()}</Text>
                <Text style={styles.monthText}>
                    {new Date(item.date).toLocaleString('default', { month: 'short' })}
                </Text>
            </View>
            <View style={styles.details}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.subtitle}>{item.description}</Text>
                <View style={styles.metaRow}>
                    <Clock size={14} color="gray" />
                    <Text style={styles.metaText}>All Day</Text>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Holidays & Events</Text>
            </View>

            <View style={styles.container}>
                <View style={styles.tabs}>
                    {["Holiday", "Event"].map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.tab, activeTab === tab && styles.activeTab]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    activeTab === tab && styles.activeTabText,
                                ]}
                            >
                                {tab}s
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {loading ? (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color="#2196F3" />
                    </View>
                ) : (
                    <FlatList
                        data={filteredData}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                        contentContainerStyle={styles.list}
                        ListEmptyComponent={
                            <View style={styles.center}>
                                <Text style={styles.emptyText}>No {activeTab.toLowerCase()}s found</Text>
                            </View>
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#fff" },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        backgroundColor: "#fff",
    },
    backButton: { marginRight: 16 },
    headerTitle: { fontSize: 20, fontWeight: "bold", color: "#333" },
    container: { flex: 1, backgroundColor: "#f5f5f5" },
    tabs: {
        flexDirection: "row",
        backgroundColor: "#fff",
        padding: 10,
        justifyContent: "center",
        marginBottom: 10,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginHorizontal: 5,
        backgroundColor: "#f0f0f0",
    },
    activeTab: { backgroundColor: "#2196F3" },
    tabText: { color: "#333", fontWeight: "600" },
    activeTabText: { color: "#fff" },
    list: { padding: 15 },
    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    dateBox: {
        backgroundColor: "#E3F2FD",
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
        minWidth: 50,
    },
    dateText: { fontSize: 18, fontWeight: "bold", color: "#2196F3" },
    monthText: { fontSize: 12, color: "#2196F3" },
    details: { marginLeft: 15, flex: 1 },
    title: { fontSize: 16, fontWeight: "bold", color: "#333" },
    subtitle: { fontSize: 14, color: "gray", marginVertical: 2 },
    metaRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
    metaText: { fontSize: 12, color: "gray", marginLeft: 4 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
    emptyText: { color: 'gray', fontSize: 16 }
});
