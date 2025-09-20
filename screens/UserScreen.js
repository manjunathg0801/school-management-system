// screens/UserScreen.js
import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { User, Users, Home, MapPin, Phone } from "lucide-react-native";

export default function UserScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 80 }} // ✅ space for BottomTab
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("../assets/avatar.png")} // replace with actual student image
          style={styles.avatar}
        />
        <Text style={styles.name}>Jeevan M</Text>
        <Text style={styles.id}>230L170</Text>
      </View>

      {/* Student Info */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <User size={20} color="#000" />
          <Text style={styles.cardTitle}> Student Information</Text>
        </View>
        {[
          ["Student ID", "230L170"],
          ["Date of Birth", "03-Feb-2019"],
          ["Gender", "M"],
          ["Blood Group", "B +ve"],
          ["Nationality", "Indian"],
        ].map(([label, value], idx) => (
          <View style={styles.cardRow} key={idx}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
          </View>
        ))}
      </View>

      {/* Parent Info */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Users size={20} color="#000" />
          <Text style={styles.cardTitle}> Parent Information</Text>
        </View>

        <Text style={styles.subHeading}>Father</Text>
        <View style={styles.cardRow}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>Manjunath G</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>9886890834</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>manjunathg0801@gmail.com</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.subHeading}>Mother</Text>
        <View style={styles.cardRow}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>Banupriya S</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>9880050686</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>banupriyas147@gmail.com</Text>
        </View>
      </View>

      {/* Address */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MapPin size={20} color="#000" />
          <Text style={styles.cardTitle}> Address</Text>
        </View>
        <Text style={styles.label}>Present Address</Text>
        <Text style={styles.value}>
          #50 Srilakshmi Venkateshwara NIlaya 8th Cross Vasanthpura Road,
          Konankunte Cross Kanakpura Main Road, Bangalore, Karnataka-560062
        </Text>
        <Text style={styles.value}>9980388555</Text>
      </View>

      {/* Emergency Contacts */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Phone size={20} color="#000" />
          <Text style={styles.cardTitle}> Emergency Contacts</Text>
        </View>
        <Text style={styles.value}>Manjunath G</Text>
        <Text style={styles.value}>
          #50 Srilakshmi Venkateshwara NIlaya 8th Cross Vasanthpura Road,
          Bangalore 560062
        </Text>
        <Text style={styles.value}>9886890834</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    marginTop: 80,
    width: 410,
    marginLeft:12,
    height: 180,
    backgroundColor: "#2196F3",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,

    
  },
  avatar: {
    marginTop: 5,
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    alignItems: "center",
    borderColor: "#fff",
    marginBottom: 10,
  },
  name: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  id: { fontSize: 16, color: "#fff" },
  card: {
    backgroundColor: "#fff",
    margin: 12,
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  cardTitle: { fontSize: 16, fontWeight: "bold", marginLeft: 6 },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: { color: "grey" },
  value: { fontWeight: "500", flexShrink: 1 },
  subHeading: { fontWeight: "600", marginTop: 8, marginBottom: 4 },
  divider: { borderBottomWidth: 1, borderBottomColor: "#eee", marginVertical: 8 },
});
