import React, { useContext, useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import { User, Users, Home, MapPin, Phone } from "lucide-react-native";
import { UserContext } from "../contexts/UserContext";
import { getUserProfile } from "../services/api";

export default function UserScreen() {
  const { user } = useContext(UserContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfile = async () => {
    if (user?.email) {
      try {
        const data = await getUserProfile(user.email);
        setProfile(data);
      } catch (error) {
        console.log("Failed to load profile", error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 80 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={profile?.photo_url ? { uri: profile.photo_url } : require("../assets/avatar.png")}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user?.full_name || 'Student Name'}</Text>
        <Text style={styles.id}>{profile?.admission_number || 'ID: --'}</Text>
      </View>

      {/* Student Info */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <User size={20} color="#000" />
          <Text style={styles.cardTitle}> Student Information</Text>
        </View>
        {[
          ["Student ID", profile?.admission_number || '--'],
          ["Date of Birth", profile?.date_of_birth || '--'],
          ["Gender", profile?.gender || '--'],
          ["Blood Group", profile?.blood_group || '--'],
          ["Class", `${profile?.class_grade || ''} - ${profile?.section || ''}`],
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
          <Text style={styles.value}>{profile?.parent_profile?.father_name || '--'}</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>{profile?.parent_profile?.father_phone || '--'}</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.label}>Occupation</Text>
          <Text style={styles.value}>{profile?.parent_profile?.father_occupation || '--'}</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.subHeading}>Mother</Text>
        <View style={styles.cardRow}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{profile?.parent_profile?.mother_name || '--'}</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>{profile?.parent_profile?.mother_phone || '--'}</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.label}>Occupation</Text>
          <Text style={styles.value}>{profile?.parent_profile?.mother_occupation || '--'}</Text>
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
          {profile?.address ?
            `${profile.address.street}, ${profile.address.city}, ${profile.address.state} - ${profile.address.zip_code}`
            : 'No address found'}
        </Text>
      </View>

      {/* Emergency Contacts */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Phone size={20} color="#000" />
          <Text style={styles.cardTitle}> Emergency Contacts</Text>
        </View>
        <Text style={styles.value}>{profile?.emergency_contact?.contact_name || '--'}</Text>
        <Text style={styles.value}>{profile?.emergency_contact?.relation_type || '--'}</Text>
        <Text style={styles.value}>{profile?.emergency_contact?.phone_number || '--'}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    marginTop: 80,
    width: 410,
    marginLeft: 12,
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
