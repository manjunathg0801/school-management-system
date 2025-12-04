import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MailsScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mails</Text>
            </View>
            <View style={styles.content}>
                <Text style={styles.placeholderText}>Mails Screen</Text>
                <Text style={styles.subText}>Coming Soon...</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', paddingTop: 50, paddingHorizontal: 16 },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 10 },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    placeholderText: { fontSize: 18, fontWeight: '600', color: '#333' },
    subText: { fontSize: 14, color: '#666', marginTop: 8 },
});
