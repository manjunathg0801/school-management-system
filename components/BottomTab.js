// BottomTab.js
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function BottomTab() {
  const navigation = useNavigation();

  return (
    <View style={styles.tab}>
      <TouchableOpacity>
        <Feather name="menu" style={styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('User')}>
        <FontAwesome name="user-circle-o" style={styles.icon} />
      </TouchableOpacity>

      <View style={styles.centerIconWrapper}>
        <TouchableOpacity>
          <Ionicons name="mail-open-outline" style={styles.centerIcon} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity>
        <FontAwesome name="calendar" style={styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Feather name="home" style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tab: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    height: 64,
    elevation: 8,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  icon: {
    fontSize: 28,
    color: '#808080',
    opacity: 0.8,
  },
  centerIconWrapper: {
    backgroundColor: '#fff',
    borderRadius: 40,
    padding: 6,
    elevation: 4,
  },
  centerIcon: {
    fontSize: 42,
    color: '#808080',
  },
});
