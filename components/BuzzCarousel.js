import React, { useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const CARD_W = width - 40;

const items = [
  { id: '1', img: require('../assets/buzz1.jpg'), caption: 'Our Administrator on Sports as a Way of Life – National Sports Day' },
  { id: '2', img: require('../assets/buzz2.jpg'), caption: 'Our Administrator on Sports as a Way of Life – National Sports Day' },
];

export default function BuzzCarousel() {
  const [index, setIndex] = useState(0);
  const navigation = useNavigation();

  const onViewRef = useRef(({ viewableItems }) => {
    if (viewableItems?.length) setIndex(viewableItems[0].index ?? 0);
  });
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  return (
    <View style={{ marginTop: 12 }}>
      {/* Header Row */}
      <View style={styles.row}>
        <Fontisto name="twitter" color="#000" size={24} />
        <Text style={styles.title}>Chirp @ School</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Buzz')}>
          <Text style={styles.more}> Show More ›</Text>
        </TouchableOpacity>
      </View>

      {/* Carousel */}
      <FlatList
        data={items}
        keyExtractor={i => i.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.img} style={styles.image} />
            <Text style={styles.caption}>{item.caption}</Text>
          </View>
        )}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
      />

      {/* Dots Indicator */}
      <View style={styles.dots}>
        {items.map((_, i) => (
          <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 10 },
  title: { fontSize: 24, fontWeight: '700', color: '#111', paddingLeft: 5 },
  more: { fontSize: 16,marginLeft: 80, color: '#3B82F6', fontWeight: '600' },
  card: {
    width: CARD_W,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 10,
    elevation: 3,
    overflow: 'hidden',
  },
  image: { width: '100%', height: CARD_W * 0.7, resizeMode: 'cover' },
  caption: { padding: 12, color: '#111' },
  dots: { flexDirection: 'row', justifyContent: 'center', marginTop: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#d1d5db', marginHorizontal: 4 },
  dotActive: { width: 18, backgroundColor: '#3B82F6' },
});
