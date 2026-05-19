import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useRooms } from '../../hooks/useRooms';
import RoomCard from '../../components/ui/RoomCard';
import SectionHeader from '../../components/ui/SectionHeader';

const FILTERS = ['All', 'Single', 'Double', 'Suite', 'Deluxe'];

export default function RoomsScreen() {
  const { rooms, loading, error } = useRooms();
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = activeFilter === 'All'
    ? rooms
    : rooms.filter(r => r.room_type.toLowerCase() === activeFilter.toLowerCase());

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Our Rooms</Text>
        <Text style={styles.subtitle}>SELECT YOUR SUITE</Text>
      </View>

      {/* Filter Tabs */}
      <FlatList
        data={FILTERS}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.filterList}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setActiveFilter(item)}
            style={[styles.filterBtn, activeFilter === item && styles.filterBtnActive]}
          >
            <Text style={[styles.filterText, activeFilter === item && styles.filterTextActive]}>
              {item.toUpperCase()}
            </Text>
          </TouchableOpacity>
        )}
      />

      {loading && <ActivityIndicator color={Colors.gold} style={{ marginTop: 40 }} />}
      {error   && <Text style={styles.errorText}>Could not load rooms. Check your connection.</Text>}

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <RoomCard room={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={!loading && <Text style={styles.emptyText}>No rooms found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: Colors.background },
  header:          { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 16 },
  title:           { fontFamily: 'CormorantGaramond_300Light', fontSize: 38, color: Colors.textPrimary, letterSpacing: 4 },
  subtitle:        { fontFamily: 'Jost_300Light', fontSize: 10, letterSpacing: 4, color: Colors.gold, marginTop: 4 },
  filterList:      { paddingHorizontal: 24, paddingBottom: 16, gap: 8 },
  filterBtn:       { paddingVertical: 8, paddingHorizontal: 16, borderWidth: 1, borderColor: Colors.border },
  filterBtnActive: { borderColor: Colors.gold, backgroundColor: Colors.goldLight },
  filterText:      { fontFamily: 'Jost_400Regular', fontSize: 10, color: Colors.textMuted, letterSpacing: 2 },
  filterTextActive:{ color: Colors.gold },
  list:            { paddingHorizontal: 24, paddingBottom: 32 },
  errorText:       { fontFamily: 'Jost_400Regular', fontSize: 13, color: Colors.error, textAlign: 'center', marginTop: 40 },
  emptyText:       { fontFamily: 'Jost_300Light', fontSize: 13, color: Colors.textMuted, textAlign: 'center', marginTop: 40 },
});