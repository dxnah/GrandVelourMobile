import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { Colors } from '../../constants/Colors';
import VelourInput from './VelourInput';
import GoldButton from './GoldButton';
import OutlineButton from './OutlineButton';
import api from '../../services/api';
import Toast from 'react-native-toast-message';

const STATUS_COLOR = {
  confirmed:   Colors.success,
  cancelled:   Colors.error,
  rescheduled: Colors.warning,
};

export default function BookingCard({ booking, onCancel, onRescheduled }) {
  const statusColor = STATUS_COLOR[booking.status] || Colors.textMuted;
  const [modalVisible, setModalVisible] = useState(false);
  const [checkIn,  setCheckIn]  = useState(booking.check_in);
  const [checkOut, setCheckOut] = useState(booking.check_out);
  const [saving,   setSaving]   = useState(false);
  const [errors,   setErrors]   = useState({});

  const validate = () => {
    const e = {};
    if (!checkIn)  e.checkIn  = 'Check-in date is required.';
    if (!checkOut) e.checkOut = 'Check-out date is required.';
    if (checkIn && checkOut && new Date(checkOut) <= new Date(checkIn))
      e.checkOut = 'Check-out must be after check-in.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleReschedule = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await api.patch(`/api/v1/bookings/${booking.id}/reschedule/`, {
        check_in:  checkIn,
        check_out: checkOut,
      });
      Toast.show({ type: 'success', text1: 'Booking rescheduled!' });
      setModalVisible(false);
      if (onRescheduled) onRescheduled();
    } catch (e) {
      const msg = e.response?.data?.error || 'Could not reschedule.';
      Toast.show({ type: 'error', text1: 'Reschedule failed', text2: msg });
    } finally {
      setSaving(false);
    }
  };

  const canEdit = booking.status === 'confirmed' || booking.status === 'rescheduled';

  return (
    <>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.roomLabel}>Room {booking.room_number || booking.room}</Text>
          <View style={[styles.badge, { borderColor: statusColor }]}>
            <Text style={[styles.badgeText, { color: statusColor }]}>{booking.status.toUpperCase()}</Text>
          </View>
        </View>

        <Text style={styles.roomType}>{booking.room_type?.toUpperCase() || '—'}</Text>

        <View style={styles.dateRow}>
          <View style={styles.dateBox}>
            <Text style={styles.dateLabel}>CHECK IN</Text>
            <Text style={styles.dateValue}>{booking.check_in}</Text>
          </View>
          <Text style={styles.dateArrow}>›</Text>
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

          {canEdit && (
            <View style={styles.actions}>
              <TouchableOpacity style={styles.editBtn} onPress={() => {
                setCheckIn(booking.check_in);
                setCheckOut(booking.check_out);
                setErrors({});
                setModalVisible(true);
              }}>
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>

              {booking.status === 'confirmed' && onCancel && (
                <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>

      {/* Reschedule Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>Edit</Text>
                  <Text style={styles.modalSub}>ROOM {booking.room_number || booking.room}</Text>
                </View>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={styles.closeBtn}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.divider} />

              <VelourInput
                label="New Check-in (YYYY-MM-DD)"
                value={checkIn}
                onChangeText={setCheckIn}
                placeholder="2026-06-01"
                error={errors.checkIn}
              />
              <VelourInput
                label="New Check-out (YYYY-MM-DD)"
                value={checkOut}
                onChangeText={setCheckOut}
                placeholder="2026-06-05"
                error={errors.checkOut}
              />

              {checkIn && checkOut && new Date(checkOut) > new Date(checkIn) && (() => {
                const nights = Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000);
                return (
                  <View style={styles.preview}>
                    <Text style={styles.previewText}>{nights} night{nights !== 1 ? 's' : ''}</Text>
                    <Text style={styles.previewTotal}>
                      ₱{(nights * parseFloat(booking.total_price / Math.round((new Date(booking.check_out) - new Date(booking.check_in)) / 86400000) || 0)).toLocaleString()}
                    </Text>
                  </View>
                );
              })()}

              <GoldButton
                title={saving ? 'Saving...' : 'Confirm New Dates'}
                onPress={handleReschedule}
                disabled={saving}
              />
              <OutlineButton title="Cancel" onPress={() => setModalVisible(false)} />
              <View style={{ height: 32 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card:        { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, padding: 20, marginBottom: 12 },
  header:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  roomLabel:   { fontFamily: 'CormorantGaramond_400Regular', fontSize: 22, color: Colors.textPrimary },
  badge:       { borderWidth: 1, paddingVertical: 3, paddingHorizontal: 8 },
  badgeText:   { fontFamily: 'Jost_500Medium', fontSize: 9, letterSpacing: 2 },
  roomType:    { fontFamily: 'Jost_300Light', fontSize: 10, letterSpacing: 2, color: Colors.textMuted, marginBottom: 16 },
  dateRow:     { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  dateBox:     { flex: 1 },
  dateLabel:   { fontFamily: 'Jost_400Regular', fontSize: 9, letterSpacing: 2, color: Colors.textMuted, marginBottom: 4 },
  dateValue:   { fontFamily: 'Jost_400Regular', fontSize: 13, color: Colors.textPrimary },
  dateArrow:   { color: Colors.gold, fontSize: 16 },
  footer:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 16 },
  totalLabel:  { fontFamily: 'Jost_400Regular', fontSize: 9, letterSpacing: 2, color: Colors.textMuted, marginBottom: 2 },
  totalValue:  { fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 22, color: Colors.gold },
  actions:     { flexDirection: 'row', gap: 8 },
  editBtn:     { borderWidth: 1, borderColor: Colors.gold + '80', paddingVertical: 8, paddingHorizontal: 14 },
  editText:    { fontFamily: 'Jost_400Regular', fontSize: 11, color: Colors.gold, letterSpacing: 1 },
  cancelBtn:   { borderWidth: 1, borderColor: Colors.error + '80', paddingVertical: 8, paddingHorizontal: 14 },
  cancelText:  { fontFamily: 'Jost_400Regular', fontSize: 11, color: Colors.error, letterSpacing: 1 },

  overlay:     { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  sheet:       { backgroundColor: Colors.background, borderTopWidth: 1, borderTopColor: Colors.gold, maxHeight: '80%', paddingHorizontal: 24, paddingTop: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  modalTitle:  { fontFamily: 'CormorantGaramond_400Regular', fontSize: 26, color: Colors.textPrimary },
  modalSub:    { fontFamily: 'Jost_300Light', fontSize: 10, letterSpacing: 2, color: Colors.gold, marginTop: 4 },
  closeBtn:    { fontFamily: 'Jost_400Regular', fontSize: 16, color: Colors.textMuted, padding: 4 },
  divider:     { height: 1, backgroundColor: Colors.border, marginVertical: 20 },
  preview:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                 backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border,
                 paddingHorizontal: 16, paddingVertical: 12, marginBottom: 20 },
  previewText: { fontFamily: 'Jost_400Regular', fontSize: 12, color: Colors.textMuted, letterSpacing: 1 },
  previewTotal:{ fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 22, color: Colors.gold },
});