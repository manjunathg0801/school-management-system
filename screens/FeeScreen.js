import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image, SafeAreaView, StatusBar } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { getFees } from "../services/api";
import { useNavigation } from "@react-navigation/native";

export default function FeeScreen() {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState("Pending");
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFees();
    }, []);

    const fetchFees = async () => {
        try {
            const data = await getFees();
            setFees(data);
        } catch (error) {
            console.log("Failed to load fees", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredData = fees.filter(
        (item) => item.status.toLowerCase() === activeTab.toLowerCase()
    );

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Image
                source={require("../assets/avatar.png")}
                style={styles.avatar}
            />
            <View style={styles.details}>
                <Text style={styles.referenceNumber}>{item.reference_number}</Text>
                <Text style={styles.academicYear}>{item.academic_year}</Text>
            </View>
            <View style={styles.amountContainer}>
                <Text style={styles.amount}>Rs.{item.amount.toFixed(2)}</Text>
                <Text style={styles.date}>
                    {activeTab === "Paid" ? item.payment_date : item.due_date}
                </Text>
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
                <Text style={styles.headerTitle}>Fee Payment Status</Text>
            </View>

            <View style={styles.container}>
                <View style={styles.tabContainer}>
                    {["Pending", "Paid"].map((tab) => (
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
                                {tab}
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
                                <Text style={styles.emptyText}>No {activeTab.toLowerCase()} fees found</Text>
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
    tabContainer: {
        flexDirection: "row",
        backgroundColor: "#e0e0e0",
        borderRadius: 25,
        margin: 16,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: "center",
        borderRadius: 20,
    },
    activeTab: { backgroundColor: "#fff", elevation: 2 },
    tabText: { color: "gray", fontWeight: "600" },
    activeTabText: { color: "#000", fontWeight: "bold" },
    list: { paddingHorizontal: 16 },
    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 15,
        marginBottom: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    details: { flex: 1 },
    referenceNumber: { fontSize: 16, fontWeight: "bold", color: "#333" },
    academicYear: { fontSize: 14, color: "gray", marginTop: 2 },
    amountContainer: { alignItems: "flex-end" },
    amount: { fontSize: 16, fontWeight: "bold", color: "#4CAF50" },
    date: { fontSize: 12, color: "gray", marginTop: 2 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
    emptyText: { color: 'gray', fontSize: 16 }
});
