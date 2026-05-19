import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/Colors';

export default function RoomCard({ room, onBook }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.roomNumber}>Room {room.room_number}</Text>
          <Text style={styles.roomType}>{room.room_type.toUpperCase()}</Text>
        </View>
        <View style={[styles.badge, { borderColor: room.is_available ? Colors.success : Colors.error }]}>
          <Text style={[styles.badgeText, { color: room.is_available ? Colors.success : Colors.error }]}>
            {room.is_available ? 'AVAILABLE' : 'OCCUPIED'}
          </Text>
        </View>
      </View>

      {room.description ? (
        <Text style={styles.desc}>{room.description}</Text>
      ) : null}

      <View style={styles.footer}>
        <View>
          <Text style={styles.priceLabel}>PER NIGHT</Text>
          <Text style={styles.price}>₱{parseFloat(room.price_per_night).toLocaleString()}</Text>
        </View>
        {room.is_available && onBook && (
          <TouchableOpacity style={styles.bookBtn} onPress={onBook}>
            <Text style={styles.bookBtnText}>BOOK NOW</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card:       { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, padding: 20, marginBottom: 12 },
  header:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  roomNumber: { fontFamily: 'CormorantGaramond_400Regular', fontSize: 22, color: Colors.textPrimary },
  roomType:   { fontFamily: 'Jost_300Light', fontSize: 10, letterSpacing: 2, color: Colors.textMuted, marginTop: 2 },
  badge:      { borderWidth: 1, paddingVertical: 3, paddingHorizontal: 8 },
  badgeText:  { fontFamily: 'Jost_500Medium', fontSize: 9, letterSpacing: 2 },
  desc:       { fontFamily: 'Jost_300Light', fontSize: 12, color: Colors.textSecondary, lineHeight: 18, marginBottom: 16 },
  footer:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 16 },
  priceLabel: { fontFamily: 'Jost_400Regular', fontSize: 9, letterSpacing: 2, color: Colors.textMuted, marginBottom: 2 },
  price:      { fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 24, color: Colors.gold },
  bookBtn:    { backgroundColor: Colors.gold, paddingVertical: 10, paddingHorizontal: 20 },
  bookBtnText:{ fontFamily: 'Jost_500Medium', fontSize: 10, letterSpacing: 2, color: Colors.background },
});