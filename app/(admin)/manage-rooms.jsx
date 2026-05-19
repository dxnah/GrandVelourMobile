import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useRooms } from '../../hooks/useRooms';
import { Feather } from '@expo/vector-icons';

export default function ManageRoomsScreen() {
  const router = useRouter();
  const { rooms, loading, deleteRoom } = useRooms();

  const handleDelete = (id, number) => {
    Alert.alert('Delete Room', `Delete Room ${number}? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteRoom(id) },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color={Colors.gold} />
        </TouchableOpacity>
        <Text style={styles.title}>Manage Rooms</Text>
      </View>

      {loading && <ActivityIndicator color={Colors.gold} style={{ marginTop: 40 }} />}

      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.roomNumber}>Room {item.room_number}</Text>
              <Text style={styles.roomType}>{item.room_type.toUpperCase()} · ₱{item.price_per_night}/night</Text>
              <Text style={[styles.roomAvail, { color: item.is_available ? Colors.success : Colors.error }]}>
                {item.is_available ? 'Available' : 'Occupied'}
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.id, item.room_number)} style={styles.deleteBtn}>
              <Feather name="trash-2" size={16} color={Colors.error} />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={!loading && <Text style={styles.emptyText}>No rooms found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: Colors.background },
  header:     { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 24, gap: 16 },
  backBtn:    { padding: 4 },
  title:      { fontFamily: 'CormorantGaramond_400Regular', fontSize: 28, color: Colors.textPrimary },
  list:       { paddingHorizontal: 24, paddingBottom: 32 },
  row:        { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, padding: 20, marginBottom: 10, borderWidth: 1, borderColor: Colors.border },
  roomNumber: { fontFamily: 'CormorantGaramond_400Regular', fontSize: 20, color: Colors.textPrimary, marginBottom: 4 },
  roomType:   { fontFamily: 'Jost_400Regular', fontSize: 11, color: Colors.textMuted, letterSpacing: 1, marginBottom: 4 },
  roomAvail:  { fontFamily: 'Jost_400Regular', fontSize: 11, letterSpacing: 1 },
  deleteBtn:  { padding: 8, borderWidth: 1, borderColor: Colors.error + '50' },
  emptyText:  { fontFamily: 'Jost_300Light', fontSize: 13, color: Colors.textMuted, textAlign: 'center', marginTop: 40 },
});