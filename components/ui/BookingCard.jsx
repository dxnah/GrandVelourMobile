import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/Colors';

const STATUS_COLOR = {
  confirmed:   Colors.success,
  cancelled:   Colors.error,
  rescheduled: Colors.warning,
};

export default function BookingCard({ booking, onCancel }) {
  const statusColor = STATUS_COLOR[booking.status] || Colors.textMuted;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.roomLabel}>Room {booking.room?.room_number}</Text>
        <View style={[styles.badge, { borderColor: statusColor }]}>
          <Text style={[styles.badgeText, { color: statusColor }]}>{booking.status.toUpperCase()}</Text>
        </View>
      </View>

      <Text style={styles.roomType}>{booking.room?.room_type?.toUpperCase()}</Text>

      <View style={styles.dateRow}>
        <View style={styles.dateBox}>
          <Text style={styles.dateLabel}>CHECK IN</Text>
          <Text style={styles.dateValue}>{booking.check_in}</Text>
        </View>
        <Text style={styles.dateArrow}>→</Text>
        <View style={styles.dateBox}>
          <Text style={styles.dateLabel}>CHECK OUT</Text>
          <Text style={styles.dateValue}>{booking.check_out}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View>
          <Text style={styles.totalLabel}>TOTAL</Text>
          <Text style={styles.totalValue}>₱{parseFloat(booking.total_price || 0).toLocaleString()}</Text>
        </View>
        {booking.status === 'confirmed' && onCancel && (
          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card:       { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, padding: 20, marginBottom: 12 },
  header:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  roomLabel:  { fontFamily: 'CormorantGaramond_400Regular', fontSize: 22, color: Colors.textPrimary },
  badge:      { borderWidth: 1, paddingVertical: 3, paddingHorizontal: 8 },
  badgeText:  { fontFamily: 'Jost_500Medium', fontSize: 9, letterSpacing: 2 },
  roomType:   { fontFamily: 'Jost_300Light', fontSize: 10, letterSpacing: 2, color: Colors.textMuted, marginBottom: 16 },
  dateRow:    { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  dateBox:    { flex: 1 },
  dateLabel:  { fontFamily: 'Jost_400Regular', fontSize: 9, letterSpacing: 2, color: Colors.textMuted, marginBottom: 4 },
  dateValue:  { fontFamily: 'Jost_400Regular', fontSize: 13, color: Colors.textPrimary },
  dateArrow:  { color: Colors.gold, fontSize: 16 },
  footer:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 16 },
  totalLabel: { fontFamily: 'Jost_400Regular', fontSize: 9, letterSpacing: 2, color: Colors.textMuted, marginBottom: 2 },
  totalValue: { fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 22, color: Colors.gold },
  cancelBtn:  { borderWidth: 1, borderColor: Colors.error + '80', paddingVertical: 8, paddingHorizontal: 16 },
  cancelText: { fontFamily: 'Jost_400Regular', fontSize: 11, color: Colors.error, letterSpacing: 1 },
});