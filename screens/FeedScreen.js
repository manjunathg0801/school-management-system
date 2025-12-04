// screens/FeedScreen.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getFeeds } from '../services/api';

const { width } = Dimensions.get('window');

const FeedScreen = ({ navigation }) => {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndexes, setActiveIndexes] = useState({});
  const [expanded, setExpanded] = useState({}); // track expanded descriptions
  const scrollRefs = useRef({});

  useEffect(() => {
    fetchFeeds();
  }, []);

  const fetchFeeds = async () => {
    try {
      const data = await getFeeds();
      setFeeds(data);
    } catch (error) {
      console.log("Failed to load feeds", error);
    } finally {
      setLoading(false);
    }
  };

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
      {item.images && item.images.length > 0 ? (
        <>
          <FlatList
            ref={(ref) => (scrollRefs.current[item.id] = ref)}
            data={item.images}
            keyExtractor={(_, idx) => `${item.id}-${idx}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={({ item: img }) => (
              <Image source={{ uri: img }} style={styles.feedImage} />
            )}
            onScroll={(e) => handleScroll(e, item.id)}
            scrollEventThrottle={16}
          />
          {/* Dots */}
          {item.images.length > 1 && (
            <View style={styles.dots}>
              {item.images.map((_, idx) => (
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
          )}
        </>
      ) : null}

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

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

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
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No feeds available.</Text>
        }
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
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#9ca3af',
    fontSize: 16,
  },
});
