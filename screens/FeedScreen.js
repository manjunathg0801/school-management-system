// screens/FeedScreen.js
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const FeedScreen = ({ navigation }) => {
  const [feeds] = useState([
    {
      id: '1',
      image: [
        require('../assets/buzz1.jpg'),
        require('../assets/buzz2.jpg'),
      ],
      title: 'Our Administrator on Sports as a Way of Life – National Sports Day',
      description: `In today’s world where convenience often keeps us indoors, it is more important than ever to engage with sports and physical activity. Sports not only build fitness but also shape character, discipline, and resilience. Through active participation, children and young adults learn teamwork, develop leadership qualities, and embrace the values of perseverance and fair play.`,
    },
    {
      id: '2',
      image: require('../assets/buzz2.jpg'),
      title: 'Kaira Baliga of 10B - Second Runners-Up, Vijayanagar District Table Tennis',
      description: `Game on! Whether it’s the court, the pool, or the table — our Sports Stars leap, splash, and smash their way to victory! We are so proud to celebrate the achievements of our students who continue to shine in every arena.`,
    },
    {
        id: '3',
        image: [
            require('../assets/buzz1.jpg'),
            require('../assets/buzz2.jpg'),
          ],
        title: 'Kaira Baliga of 10B - Second Runners-Up, Vijayanagar District Table Tennis',
        description: `Game on! Whether it’s the court, the pool, or the table — our Sports Stars leap, splash, and smash their way to victory! We are so proud to celebrate the achievements of our students who continue to shine in every arena.`,
      },
  ]);

  const [activeIndexes, setActiveIndexes] = useState({});
  const [expanded, setExpanded] = useState({}); // track expanded descriptions
  const scrollRefs = useRef({});

  const handleScroll = (event, feedId) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndexes((prev) => ({ ...prev, [feedId]: index }));
  };

  const handleDotPress = (feedId, index) => {
    if (scrollRefs.current[feedId]) {
      scrollRefs.current[feedId].scrollToIndex({ index, animated: true });
      setActiveIndexes((prev) => ({ ...prev, [feedId]: index }));
    }
  };

  const toggleExpand = (feedId) => {
    setExpanded((prev) => ({ ...prev, [feedId]: !prev[feedId] }));
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* Images */}
      {Array.isArray(item.image) ? (
        <>
          <FlatList
            ref={(ref) => (scrollRefs.current[item.id] = ref)}
            data={item.image}
            keyExtractor={(_, idx) => `${item.id}-${idx}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={({ item: img }) => (
              <Image source={img} style={styles.feedImage} />
            )}
            onScroll={(e) => handleScroll(e, item.id)}
            scrollEventThrottle={16}
          />
          {/* Dots */}
          <View style={styles.dots}>
            {item.image.map((_, idx) => (
              <TouchableOpacity
                key={`${item.id}-dot-${idx}`}
                onPress={() => handleDotPress(item.id, idx)}
              >
                <View
                  style={[
                    styles.dot,
                    idx === (activeIndexes[item.id] || 0) && styles.dotActive,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
        </>
      ) : (
        <Image
          source={typeof item.image === 'string' ? { uri: item.image } : item.image}
          style={styles.feedImage}
        />
      )}

      {/* Title */}
      <Text style={styles.feedTitle}>{item.title}</Text>

      {/* Description with Show More / Less */}
      <Text
        style={styles.feedDesc}
        numberOfLines={expanded[item.id] ? undefined : 3} // limit to 3 lines if collapsed
      >
        {item.description}
      </Text>
      {item.description.length > 100 && ( // only show toggle if text is long
        <TouchableOpacity onPress={() => toggleExpand(item.id)}>
          <Text style={styles.showMore}>
            {expanded[item.id] ? 'Show Less ▲' : 'Show More ▼'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            navigation.canGoBack()
              ? navigation.goBack()
              : navigation.navigate('Home')
          }
        >
          <Ionicons name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Feed</Text>
      </View>

      {/* Feed List */}
      <FlatList
        data={feeds}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default FeedScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 12 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 50,
  },
  headerTitle: { fontSize: 20, fontWeight: '600', marginLeft: 10 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    elevation: 2,
  },
  feedImage: {
    width: width - 48,
    height: 200,
    borderRadius: 12,
    marginBottom: 8,
  },
  feedTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
  feedDesc: { fontSize: 14, color: '#374151' },
  showMore: { color: '#3b82f6', fontWeight: '600', marginTop: 4 },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d1d5db',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#3b82f6',
    width: 16,
  },
});
