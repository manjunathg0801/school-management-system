// App.js
import React from 'react';
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
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// -------- Custom Drawer ----------
function CustomDrawerContent(props) {
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
        <DrawerItem icon="file-text" label="Holiday/Event" />
        <DrawerItem icon="mail" label="Post Office" />
        <DrawerItem icon="rupee" label="   Fee Payment Status" />
        <DrawerItem icon="bar-chart" label="Assessment" />
        <DrawerItem icon="user-check" label="Attendance" />
        <DrawerItem icon="calendar" label="Timetable" />
        <DrawerItem icon="envelope" label="Mails" />
        <DrawerItem icon="book" label="Rules & Regulations" />
      </View>

      {/* Highlighted items */}
      <TouchableOpacity style={[styles.drawerItem, styles.highlightItem]}>
        <Text style={styles.highlightText}>***   Change Password</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.drawerItem, styles.highlightItem]}>
        <MaterialIcons name="refresh" size={30} color="#000" style={{ marginRight: 5 }} />
        <Text style={styles.highlightText}>Refresh</Text>
      </TouchableOpacity>

      {/* Footer with Profile */}
      <View style={styles.footer}>
        <Image
          source={{ uri: 'https://i.ibb.co/bQpHpGc/profile-pic.png' }} // replace with real profile pic
          style={styles.profilePic}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.profileName}>Jeevan M</Text>
          <Text style={styles.profileEmail}>v1.4.2</Text>
        </View>
        <Feather name="log-out" size={22} color="#000" />
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
function DrawerItem({ icon, label }) {
  let IconComponent = Feather;
  if (icon === 'rupee') IconComponent = FontAwesome;
  if (icon === 'envelope') IconComponent = FontAwesome;
  if (icon === 'book') IconComponent = FontAwesome;
  if (icon === 'clipboard') IconComponent = FontAwesome;

  return (
    <TouchableOpacity style={styles.drawerItem}>
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
export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Drawer.Navigator
        screenOptions={{ headerShown: false }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen name="MainStack" component={MainStack} />
      </Drawer.Navigator>
    </NavigationContainer>
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
