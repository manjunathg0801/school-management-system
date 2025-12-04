// App.js
import React, { useState, useEffect, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import UserScreen from './screens/UserScreen';
import CalendarScreen from './screens/CalendarScreen';
import FeedScreen from './screens/FeedScreen';
import HolidayScreen from './screens/HolidayScreen';
import PostOfficeScreen from './screens/PostOfficeScreen';
import FeeScreen from './screens/FeeScreen';
import AssessmentScreen from './screens/AssessmentScreen';
import AttendanceScreen from './screens/AttendanceScreen';
import TimetableScreen from './screens/TimetableScreen';
import MailsScreen from './screens/MailsScreen';
import RulesScreen from './screens/RulesScreen';
import LoginScreen from './screens/LoginScreen';
import ChangePasswordScreen from './screens/ChangePasswordScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// -------- Custom Drawer ----------
import { UserProvider, UserContext } from './contexts/UserContext';


// ... (imports remain same)

import { NotificationContext } from './contexts/NotificationContext';
import { Alert } from 'react-native';

// -------- Custom Drawer ----------
function CustomDrawerContent(props) {
  const { user, logout } = useContext(UserContext);
  const { fetchUnreadCount } = useContext(NotificationContext);

  const handleRefresh = async () => {
    try {
      await fetchUnreadCount();
      // You can add other refresh calls here (e.g., fetchUser, fetchFeeds if they were in context)
      Alert.alert("Refreshed", "Data has been updated.");
      props.navigation.closeDrawer();
    } catch (error) {
      console.log("Refresh failed", error);
    }
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      {/* Header with Logo + School Name */}
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://i.ibb.co/9hh6sMb/school-logo.png' }} // replace with real logo
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.schoolName}>THE SCHOOL</Text>
          <Text style={styles.schoolBranch}>@ Nagar</Text>
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        <DrawerItem icon="file-text" label="Holiday/Event" onPress={() => props.navigation.navigate('Holiday')} />
        <DrawerItem icon="mail" label="Post Office" onPress={() => props.navigation.navigate('PostOffice')} />
        <DrawerItem icon="rupee" label="   Fee Payment Status" onPress={() => props.navigation.navigate('Fee')} />
        <DrawerItem icon="bar-chart" label="Assessment" onPress={() => props.navigation.navigate('Assessment')} />
        <DrawerItem icon="user-check" label="Attendance" onPress={() => props.navigation.navigate('Attendance')} />
        <DrawerItem icon="calendar" label="Timetable" onPress={() => props.navigation.navigate('Timetable')} />
        <DrawerItem icon="envelope" label="Mails" onPress={() => props.navigation.navigate('Mails')} />
        <DrawerItem icon="book" label="Rules & Regulations" onPress={() => props.navigation.navigate('Rules')} />
      </View>

      {/* Highlighted items */}
      <TouchableOpacity style={[styles.drawerItem, styles.highlightItem]} onPress={() => props.navigation.navigate('ChangePassword')}>
        <Text style={styles.highlightText}>***   Change Password</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.drawerItem, styles.highlightItem]} onPress={handleRefresh}>
        <MaterialIcons name="refresh" size={30} color="#000" style={{ marginRight: 5 }} />
        <Text style={styles.highlightText}>Refresh</Text>
      </TouchableOpacity>

      {/* Footer with Profile */}
      <View style={styles.footer}>
        <Image
          //source={{ uri: 'https://i.ibb.co/bQpHpGc/profile-pic.png' }} // replace with real profile pic
          source={require("./assets/avatar.png")}
          style={styles.profilePic}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.profileName}>{user?.full_name || 'User'}</Text>
          <Text style={styles.profileEmail}>{user?.email || ''}</Text>
        </View>
        <TouchableOpacity onPress={logout}>
          <Feather name="log-out" size={22} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Powered by */}
      <View style={styles.powered}>
        <Text style={{ fontSize: 12, color: '#444' }}>Powered by</Text>
        <Image
          source={{ uri: 'https://i.ibb.co/7YN6FQG/myschoolone.png' }} // replace with logo
          style={{ width: 120, height: 30, marginTop: 4 }}
          resizeMode="contain"
        />
      </View>
    </DrawerContentScrollView>
  );
}

// Helper Drawer Item
function DrawerItem({ icon, label, onPress }) {
  let IconComponent = Feather;
  if (icon === 'rupee') IconComponent = FontAwesome;
  if (icon === 'envelope') IconComponent = FontAwesome;
  if (icon === 'book') IconComponent = FontAwesome;
  if (icon === 'clipboard') IconComponent = FontAwesome;

  return (
    <TouchableOpacity style={styles.drawerItem} onPress={onPress}>
      <IconComponent name={icon} size={24} color="#000" style={{ marginRight: 10 }} />
      <Text style={styles.drawerText}>{label}</Text>
    </TouchableOpacity>
  );
}

// -------- Bottom Tabs -------------
function BottomTabs({ navigation }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 2,
          left: 16,
          right: 16,
          backgroundColor: '#fff',
          borderRadius: 20,
          height: 64,
          elevation: 8,
        },
      }}
    >
      <Tab.Screen
        name="Menu"
        component={HomeScreen}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            navigation.openDrawer();
          },
        }}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="menu" size={28} color={color || '#808080'} />
          ),
        }}
      />
      <Tab.Screen
        name="User"
        component={UserScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user-circle-o" size={28} color={color || '#808080'} />
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={28} color={color || '#808080'} />
          ),
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="calendar" size={28} color={color || '#808080'} />
          ),
        }}
      />
      <Tab.Screen
        name="Mail"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="mail-open-outline" size={32} color={color || '#808080'} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// -------- Stack for Tabs + Feed -------------
function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={BottomTabs} />
      <Stack.Screen name="Buzz" component={FeedScreen} />
    </Stack.Navigator>
  );
}

// -------- Root App --------------
function AppContent() {
  const { isLoggedIn } = useContext(UserContext);

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      {isLoggedIn ? (
        <Drawer.Navigator
          screenOptions={{ headerShown: false }}
          drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
          <Drawer.Screen name="MainStack" component={MainStack} />
          <Drawer.Screen name="Holiday" component={HolidayScreen} />
          <Drawer.Screen name="PostOffice" component={PostOfficeScreen} />
          <Drawer.Screen name="Fee" component={FeeScreen} />
          <Drawer.Screen name="Assessment" component={AssessmentScreen} />
          <Drawer.Screen name="Attendance" component={AttendanceScreen} />
          <Drawer.Screen name="Timetable" component={TimetableScreen} />
          <Drawer.Screen name="Mails" component={MailsScreen} />
          <Drawer.Screen name="Rules" component={RulesScreen} />
          <Drawer.Screen name="ChangePassword" component={ChangePasswordScreen} />
          <Drawer.Screen name="Notifications" component={NotificationsScreen} />
        </Drawer.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

import { NotificationProvider } from './contexts/NotificationContext';

export default function App() {
  return (
    <UserProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  logo: { width: 60, height: 60, marginRight: 12 },
  schoolName: { fontSize: 16, fontWeight: 'bold' },
  schoolBranch: { fontSize: 14, color: 'gray' },

  menuSection: { marginTop: 10 },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  drawerText: { fontSize: 15 },

  highlightItem: {
    backgroundColor: '#eef2ff',
    marginHorizontal: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  highlightText: { fontSize: 16, fontWeight: 'bold', color: '#000' },

  footer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  profilePic: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  profileName: { fontSize: 16, fontWeight: 'bold' },
  profileEmail: { fontSize: 13, color: 'gray' },

  powered: {
    marginTop: 10,
    alignItems: 'center',
    paddingBottom: 20,
  },
});
