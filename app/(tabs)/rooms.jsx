import { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, ActivityIndicator,
  TouchableOpacity, Modal, ScrollView, Alert, Platform,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { useRooms } from '../../hooks/useRooms';
import { useBookings } from '../../hooks/useBookings';
import { useAuth } from '../../hooks/useAuth';
import RoomCard from '../../components/ui/RoomCard';
import GoldButton from '../../components/ui/GoldButton';
import OutlineButton from '../../components/ui/OutlineButton';
import VelourInput from '../../components/ui/VelourInput';
import api from '../../services/api';

const FILTERS = ['All', 'Single', 'Double', 'Suite', 'Deluxe'];

export default function RoomsScreen() {
  const { rooms, loading, error, refetch } = useRooms();
  const { createBooking } = useBookings();
  const { user } = useAuth();

  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [submitting, setSubmitting]     = useState(false);

  const [form, setForm] = useState({
    check_in:   '',
    check_out:  '',
    first_name: '',
    last_name:  '',
    email:      '',
    phone:      '',
  });
  const [errors, setErrors] = useState({});

  const filtered = activeFilter === 'All'
    ? rooms
    : rooms.filter(r => r.room_type.toLowerCase() === activeFilter.toLowerCase());

  const openBooking = (room) => {
    setSelectedRoom(room);
    setForm({
      check_in:   '',
      check_out:  '',
      first_name: user?.first_name || '',
      last_name:  user?.last_name  || '',
      email:      user?.email      || '',
      phone:      user?.phone      || '',
    });
    setErrors({});
    setModalVisible(true);
  };

  const validate = () => {
    const e = {};
    if (!form.check_in)   e.check_in   = 'Check-in date is required.';
    if (!form.check_out)  e.check_out  = 'Check-out date is required.';
    if (!form.first_name) e.first_name = 'First name is required.';
    if (!form.last_name)  e.last_name  = 'Last name is required.';
    if (!form.email)      e.email      = 'Email is required.';
    if (!form.phone)      e.phone      = 'Phone is required.';

    if (form.check_in && form.check_out) {
      if (new Date(form.check_out) <= new Date(form.check_in))
        e.check_out = 'Check-out must be after check-in.';
      if (new Date(form.check_in) < new Date(new Date().toDateString()))
        e.check_in = 'Check-in cannot be in the past.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleBook = async () => {
  if (!validate()) return;
  setSubmitting(true);

  let clientId;
  try {
    const clientRes = await api.post('/api/v1/clients/', {
      name:  `${form.first_name} ${form.last_name}`,
      email: form.email,
      phone: form.phone,
    });
    clientId = clientRes.data.id;
  } catch (e) {
    // Duplicate email (400) — find the existing client
    if (e.response?.status === 400) {
      try {
        const list = await api.get('/api/v1/clients/');
        const existing = list.data.find(c => c.email === form.email);
        if (existing) {
          clientId = existing.id;
        } else {
          Toast.show({ type: 'error', text1: 'Could not identify guest.' });
          setSubmitting(false);
          return;
        }
      } catch {
        Toast.show({ type: 'error', text1: 'Network error. Please try again.' });
        setSubmitting(false);
        return;
      }
    } else {
      Toast.show({ type: 'error', text1: 'Network error. Please try again.' });
      setSubmitting(false);
      return;
    }
  }

  const result = await createBooking({
    room:      selectedRoom.id,
    client:    clientId,
    check_in:  form.check_in,
    check_out: form.check_out,
  });

  setSubmitting(false);
  if (result.success) {
    setModalVisible(false);
    refetch();
  }
};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Our Rooms</Text>
        <Text style={styles.subtitle}>SELECT YOUR SUITE</Text>
      </View>

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
        renderItem={({ item }) => (
          <RoomCard room={item} onBook={() => openBooking(item)} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={!loading && <Text style={styles.emptyText}>No rooms found.</Text>}
      />

      {/* ── Booking Modal ── */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <ScrollView showsVerticalScrollIndicator={false}>

              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>Reserve Room {selectedRoom?.room_number}</Text>
                  <Text style={styles.modalSub}>{selectedRoom?.room_type?.toUpperCase()} · ₱{parseFloat(selectedRoom?.price_per_night || 0).toLocaleString()}/NIGHT</Text>
                </View>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={styles.closeBtn}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.modalDivider} />

              {/* Dates */}
              <Text style={styles.sectionLabel}>STAY DATES</Text>
              <VelourInput
                label="Check-in Date (YYYY-MM-DD)"
                value={form.check_in}
                onChangeText={v => setForm(f => ({ ...f, check_in: v }))}
                placeholder="2026-06-01"
                placeholderTextColor={Colors.textMuted}
                error={errors.check_in}
              />
              <VelourInput
                label="Check-out Date (YYYY-MM-DD)"
                value={form.check_out}
                onChangeText={v => setForm(f => ({ ...f, check_out: v }))}
                placeholder="2026-06-05"
                placeholderTextColor={Colors.textMuted}
                error={errors.check_out}
              />

              {/* Nights + total preview */}
              {form.check_in && form.check_out && new Date(form.check_out) > new Date(form.check_in) && (() => {
                const nights = Math.round((new Date(form.check_out) - new Date(form.check_in)) / 86400000);
                const total  = nights * parseFloat(selectedRoom?.price_per_night || 0);
                return (
                  <View style={styles.pricePreview}>
                    <Text style={styles.pricePreviewText}>{nights} night{nights !== 1 ? 's' : ''}</Text>
                    <Text style={styles.pricePreviewTotal}>₱{total.toLocaleString()}</Text>
                  </View>
                );
              })()}

              <View style={styles.modalDivider} />

              {/* Guest info */}
              <Text style={styles.sectionLabel}>GUEST DETAILS</Text>
              <VelourInput label="First Name" value={form.first_name}
                onChangeText={v => setForm(f => ({ ...f, first_name: v }))} error={errors.first_name} />
              <VelourInput label="Last Name"  value={form.last_name}
                onChangeText={v => setForm(f => ({ ...f, last_name: v }))}  error={errors.last_name} />
              <VelourInput label="Email" value={form.email}
                onChangeText={v => setForm(f => ({ ...f, email: v }))}
                keyboardType="email-address" autoCapitalize="none" error={errors.email} />
              <VelourInput label="Phone" value={form.phone}
                onChangeText={v => setForm(f => ({ ...f, phone: v }))}
                keyboardType="phone-pad" error={errors.phone} />

              <GoldButton
                title={submitting ? 'Confirming...' : 'Confirm Reservation'}
                onPress={handleBook}
                disabled={submitting}
              />
              <OutlineButton title="Cancel" onPress={() => setModalVisible(false)} />

              <View style={{ height: 32 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: Colors.background },
  header:           { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 16 },
  title:            { fontFamily: 'CormorantGaramond_300Light', fontSize: 38, color: Colors.textPrimary, letterSpacing: 4 },
  subtitle:         { fontFamily: 'Jost_300Light', fontSize: 10, letterSpacing: 4, color: Colors.gold, marginTop: 4 },
  filterList:       { paddingHorizontal: 24, paddingBottom: 16, gap: 8 },
  filterBtn:        { paddingVertical: 8, paddingHorizontal: 16, borderWidth: 1, borderColor: Colors.border },
  filterBtnActive:  { borderColor: Colors.gold, backgroundColor: Colors.goldLight },
  filterText:       { fontFamily: 'Jost_400Regular', fontSize: 10, color: Colors.textMuted, letterSpacing: 2 },
  filterTextActive: { color: Colors.gold },
  list:             { paddingHorizontal: 24, paddingBottom: 32 },
  errorText:        { fontFamily: 'Jost_400Regular', fontSize: 13, color: Colors.error, textAlign: 'center', marginTop: 40 },
  emptyText:        { fontFamily: 'Jost_300Light', fontSize: 13, color: Colors.textMuted, textAlign: 'center', marginTop: 40 },

  modalOverlay:     { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalSheet:       { backgroundColor: Colors.background, borderTopWidth: 1, borderTopColor: Colors.gold,
                      maxHeight: '90%', paddingHorizontal: 24, paddingTop: 24 },
  modalHeader:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  modalTitle:       { fontFamily: 'CormorantGaramond_400Regular', fontSize: 26, color: Colors.textPrimary },
  modalSub:         { fontFamily: 'Jost_300Light', fontSize: 10, letterSpacing: 2, color: Colors.gold, marginTop: 4 },
  closeBtn:         { fontFamily: 'Jost_400Regular', fontSize: 16, color: Colors.textMuted, padding: 4 },
  modalDivider:     { height: 1, backgroundColor: Colors.border, marginVertical: 20 },
  sectionLabel:     { fontFamily: 'Jost_400Regular', fontSize: 10, letterSpacing: 3, color: Colors.textMuted, marginBottom: 16 },

  pricePreview:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                      backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border,
                      paddingHorizontal: 16, paddingVertical: 12, marginBottom: 20 },
  pricePreviewText: { fontFamily: 'Jost_400Regular', fontSize: 12, color: Colors.textMuted, letterSpacing: 1 },
  pricePreviewTotal:{ fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 22, color: Colors.gold },
});