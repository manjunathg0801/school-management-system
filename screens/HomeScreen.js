import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import HeaderProfile from '../components/HeaderProfile';
import BuzzCarousel from '../components/BuzzCarousel';
import BottomTab from '../components/BottomTab';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <HeaderProfile />
        <BuzzCarousel />
        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 12, paddingBottom: 24 }
});
