import React, { useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { Bell, BookOpen, Calendar, Award, Star } from "lucide-react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { UserContext } from '../contexts/UserContext';

import { NotificationContext } from '../contexts/NotificationContext';

export default function HeaderProfile() {
  const navigation = useNavigation();
  const { user } = useContext(UserContext);
  const { unreadCount } = useContext(NotificationContext);

  return (
    <View style={styles.container}>
      {/* Bell icon top-right */}
      <Pressable style={styles.bell} onPress={() => navigation.navigate('Notifications')}>
        <Ionicons name="notifications-outline" color="#000" size={42} />
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </Pressable>

      {/* Avatar + Details Center */}
      <View style={styles.centerContent}>
        <View style={styles.avatarWrapper}>
          {/* Floating dots */}
          <View style={[styles.dot, styles.dotBlue]} />
          <View style={[styles.dot, styles.dotPink]} />
          <View style={[styles.dot, styles.dotYellow]} />
          <View style={[styles.dot, styles.dotGreen]} />

          <Image
            source={require("../assets/avatar.png")}
            style={styles.avatar}
          />
        </View>
        <View style={{ paddingTop: 30, paddingBottom: 30 }}>
          <Text style={styles.name}>{user?.full_name || 'Guest User'}</Text>
          <Text style={styles.id}>{user?.email || 'ID: 230L170'}</Text>
          <Text style={styles.grade}>{user?.role ? user.role.toUpperCase() : 'Grade 1 - B'}</Text>
        </View>


      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    paddingHorizontal: 20,
    paddingTop: 12,
    position: "relative",
    alignItems: "center",
  },
  bell: {
    position: "absolute",
    top: 10,
    right: 20,
  },
  badge: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },

  centerContent: { alignItems: "center", marginTop: 20 },

  avatarWrapper: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#e5e7eb",
  },
  dot: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  dotBlue: { top: 10, left: -15, backgroundColor: "#3B82F6" },
  dotPink: { top: -5, right: 15, backgroundColor: "#EC4899" },
  dotYellow: { bottom: 15, left: -10, backgroundColor: "#F59E0B" },
  dotGreen: { bottom: -5, right: -5, backgroundColor: "#10B981" },

  name: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111",
    marginTop: 10,
    textAlign: "center",
  },
  id: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
    textAlign: "center",
  },
  grade: {
    fontSize: 14,
    color: "#111",
    marginTop: 2,
    textAlign: "center",
  },

  iconRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  iconWrapper: {
    alignItems: "center",
    marginHorizontal: 12,
  },
  iconLabel: {
    fontSize: 10,
    color: "#374151",
    marginTop: 4,
  },
});
