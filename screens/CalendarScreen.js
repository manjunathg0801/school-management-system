// screens/CalendarScreen.js
import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const CalendarScreen = () => {
  const [viewType, setViewType] = useState('Month');
  const [selectedDate, setSelectedDate] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Example events
  const events = [
    {
      id: '1',
      start: '2025-09-05',
      end: '2025-09-05',
      title: "Teachers' Day (Special Assembly)",
    },
    {
      id: '2',
      start: '2025-09-06',
      end: '2025-09-15',
      title: 'Periodic Test 2 (G1-9 & 11) & Periodic Test 3 (G10 & 12)',
    },
    {
      id: '3',
      start: '2025-09-06',
      end: '2025-09-06',
      title: 'Follow up for Parent Orientation Programme',
    },
  ];

  // Auto-generate markedDates from events
  const markedDates = useMemo(() => {
    const marks = {};

    events.forEach(event => {
      let current = new Date(event.start);
      const end = new Date(event.end);

      while (current <= end) {
        const dateStr = current.toISOString().split('T')[0];
        marks[dateStr] = { marked: true, dotColor: '#ef4444' };
        current.setDate(current.getDate() + 1);
      }
    });

    if (selectedDate) {
      marks[selectedDate] = {
        ...(marks[selectedDate] || {}),
        selected: true,
        selectedColor: '#2563eb',
      };
    }

    return marks;
  }, [events, selectedDate]);

// Always use selectedDate or today
const effectiveDate = selectedDate || new Date().toISOString().split("T")[0];
const sel = new Date(effectiveDate);
const filteredEvents = events.filter((event) => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
  
    if (viewType === 'Day') {
      const sel = new Date(selectedDate);
      sel.setHours(0, 0, 0, 0);
      return eventStart <= sel && eventEnd >= sel;
    }
  
    if (viewType === 'Week') {
      if (!selectedDate) return false;
      const sel = new Date(selectedDate);
      const startOfWeek = new Date(sel);
      startOfWeek.setDate(sel.getDate() - sel.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
  
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
  
      return eventStart <= endOfWeek && eventEnd >= startOfWeek;
    }
  
    if (viewType === 'Month') {
        const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        startOfMonth.setHours(0, 0, 0, 0);
      
        const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
        endOfMonth.setHours(23, 59, 59, 999);
      
        return eventStart <= endOfMonth && eventEnd >= startOfMonth;
      }
  
    return false;
  });
  

  const renderEvent = ({ item }) => (
    <Card style={styles.eventCard}>
      <View style={styles.eventContent}>
        <View style={{ flex: 1 }}>
          <Text style={styles.eventDate}>
            {item.start} - {item.end}
          </Text>
          <Text style={styles.eventTitle}>{item.title}</Text>
        </View>
        <Ionicons name="calendar-outline" size={28} color="#3b82f6" />
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Calendar */}
      <Calendar
        style={styles.calendar}
        theme={{
          todayTextColor: '#2563eb',
          selectedDayBackgroundColor: '#2563eb',
          arrowColor: '#7c3aed',
          monthTextColor: '#111827',
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14,
        }}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        onMonthChange={(month) => {
            // month = {year: 2025, month: 9, day: 1, timestamp: ...}
            setCurrentMonth(new Date(month.year, month.month - 1, 1));
          }}
        markedDates={markedDates}
      />

      {/* Toggle Buttons */}
      <View style={styles.toggleRow}>
        {['Day', 'Week', 'Month'].map(type => (
          <TouchableOpacity
            key={type}
            onPress={() => setViewType(type)}
            style={[
              styles.toggleButton,
              viewType === type && styles.activeToggle,
            ]}
          >
            <Text
              style={[
                styles.toggleText,
                viewType === type && styles.activeToggleText,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 20, color: 'gray' }}>
          No events this {viewType.toLowerCase()}
        </Text>
      ) : (
        <FlatList
          data={filteredEvents}
          renderItem={renderEvent}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </View>
  );
};

export default CalendarScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 12 },
  calendar: {
    marginTop: 50,
    borderRadius: 12,
    elevation: 2,
    marginBottom: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 24,
    padding: 6,
  },
  toggleButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 20,
  },
  toggleText: {
    fontSize: 14,
    color: '#6b7280',
  },
  activeToggle: {
    backgroundColor: '#fff',
    elevation: 2,
  },
  activeToggleText: {
    color: '#111827',
    fontWeight: '600',
  },
  eventCard: {
    marginBottom: 12,
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
    elevation: 2,
  },
  eventContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventDate: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 4,
  },
  eventTitle: {
    fontSize: 13,
    color: '#374151',
  },
});
