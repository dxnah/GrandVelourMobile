import { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image,
  TouchableOpacity, FlatList, Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../../constants/Colors';

const { width } = Dimensions.get('window');

const amenityData = {
  'fine-dining': {
    title: 'Fine Dining',
    icon: '🍽️',
    subtitle: 'A Culinary Journey',
    description: 'Experience world-class cuisine crafted by our Michelin-starred chefs. Our restaurant offers an extensive menu featuring local and international dishes, paired with a curated wine selection. Every dish is a masterpiece, prepared with the finest seasonal ingredients sourced from local farms and international markets.',
    longDesc: "Our dining experience is more than just a meal — it's an event. From the ambient lighting to the carefully curated playlist, every detail is designed to elevate your evening.",
    hours: 'Daily: 6:00 AM – 11:00 PM',
    location: 'Ground Floor, Main Building',
    rates: [
      { label: 'Breakfast Buffet', price: '₱850/person' },
      { label: 'Lunch Set Menu', price: '₱1,200/person' },
      { label: 'Dinner Set Menu', price: '₱1,800/person' },
      { label: 'Private Dining (min. 10 pax)', price: '₱2,500/person' },
    ],
    images: [
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&q=80',
    ],
  },
  'spa-wellness': {
    title: 'Spa & Wellness',
    icon: '💆',
    subtitle: 'Restore. Renew. Rejuvenate.',
    description: 'Unwind in our luxurious spa featuring aromatherapy, hot stone massages, and holistic treatments. Our certified therapists ensure a deeply relaxing experience tailored to your needs.',
    longDesc: 'Our spa draws inspiration from ancient wellness traditions blended with modern techniques. Private couple suites and wellness packages are available for a complete retreat experience.',
    hours: 'Daily: 8:00 AM – 10:00 PM',
    location: '3rd Floor, Wellness Wing',
    rates: [
      { label: '60-min Swedish Massage', price: '₱1,500' },
      { label: '90-min Deep Tissue', price: '₱2,200' },
      { label: 'Hot Stone Therapy', price: '₱2,800' },
      { label: "Couple's Package (2hrs)", price: '₱5,500' },
    ],
    images: [
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=900&q=80',
      'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=900&q=80',
      'https://images.unsplash.com/photo-1583416750470-965b2707b355?w=900&q=80',
    ],
  },
  'infinity-pool': {
    title: 'Infinity Pool',
    icon: '🏊',
    subtitle: 'Sky-High Serenity',
    description: 'Take a dip in our stunning rooftop infinity pool overlooking the city skyline. Open daily from 6AM to 10PM, with poolside bar service available for all guests.',
    longDesc: 'Perched atop our hotel, the infinity pool offers a breathtaking 360° view of the city. Poolside cabanas and bar service are available throughout the day.',
    hours: 'Daily: 6:00 AM – 10:00 PM',
    location: 'Rooftop, 15th Floor',
    rates: [
      { label: 'Hotel Guests', price: 'Complimentary' },
      { label: 'Day Pass (Non-guest)', price: '₱1,200/person' },
      { label: 'Cabana Rental (half day)', price: '₱2,500' },
      { label: 'Cabana Rental (full day)', price: '₱4,000' },
    ],
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=900&q=80',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=900&q=80',
    ],
  },
  'valet-parking': {
    title: 'Valet Parking',
    icon: '🚗',
    subtitle: 'Seamless Arrivals',
    description: 'Enjoy hassle-free parking with our professional valet service. Complimentary for all hotel guests, available 24/7 at the main entrance.',
    longDesc: 'Our trained valet team ensures your vehicle is handled with the utmost care. Electric vehicle charging stations are also available upon request.',
    hours: '24 Hours / 7 Days',
    location: 'Main Entrance, Ground Floor',
    rates: [
      { label: 'Hotel Guests', price: 'Complimentary' },
      { label: 'Restaurant Guests (3hrs)', price: 'Free with validation' },
      { label: 'Day Visitor Parking', price: '₱150/hour' },
      { label: 'Overnight Parking', price: '₱500/night' },
    ],
    images: [
      'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=900&q=80',
      'https://images.unsplash.com/photo-1621929747188-0b4dc28498d2?w=900&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80',
    ],
  },
  'gym': {
    title: 'Gym / Fitness Center',
    icon: '🏋️',
    subtitle: 'Train. Strengthen. Thrive.',
    description: 'Stay on top of your fitness routine with our fully equipped gym featuring state-of-the-art cardio machines, free weights, resistance equipment, and dedicated workout zones.',
    longDesc: 'Whether you\'re an early morning jogger or a late-night lifter, the gym is open 24 hours to accommodate your schedule. Personal training sessions are available upon request.',
    hours: 'Open 24 Hours',
    location: '2nd Floor, East Wing',
    rates: [
      { label: 'Hotel Guests', price: 'Complimentary' },
      { label: 'Day Pass (Non-guest)', price: '₱500/day' },
      { label: 'Personal Training (1hr)', price: '₱1,500' },
      { label: 'Monthly Membership', price: '₱3,500/month' },
    ],
    images: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=80',
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=900&q=80',
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=900&q=80',
    ],
  },
  'bar-lounge': {
    title: 'Bar / Lounge',
    icon: '🍸',
    subtitle: 'Sip. Unwind. Connect.',
    description: 'Our sophisticated bar and lounge offers a curated selection of premium spirits, craft cocktails, and fine wines. The ambiance is perfect for every occasion.',
    longDesc: 'With live music on weekends, a talented mixologist team, and an extensive menu of bar bites, every visit promises a memorable experience. Private booth reservations are available.',
    hours: 'Daily: 4:00 PM – 2:00 AM',
    location: 'Ground Floor, Lobby Level',
    rates: [
      { label: 'Cocktails', price: '₱350 – ₱650' },
      { label: 'Premium Spirits', price: '₱500 – ₱1,200' },
      { label: 'Wine (per glass)', price: '₱450 – ₱900' },
      { label: 'Private Booth (min. spend)', price: '₱3,000' },
    ],
    images: [
      'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=900&q=80',
      'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=900&q=80',
      'https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?w=900&q=80',
    ],
  },
  'conference-room': {
    title: 'Conference Room',
    icon: '💼',
    subtitle: 'Meet. Collaborate. Succeed.',
    description: 'Our modern conference rooms are fully equipped with high-speed internet, audio-visual systems, whiteboards, and ergonomic seating — ideal for corporate meetings and seminars.',
    longDesc: 'With flexible room configurations and dedicated technical support, our facilities can accommodate small boardroom meetings to large seminars. Catering services available upon request.',
    hours: 'Daily: 7:00 AM – 10:00 PM',
    location: '4th Floor, Business Center',
    rates: [
      { label: 'Half Day (4 hrs)', price: '₱5,000' },
      { label: 'Full Day (8 hrs)', price: '₱8,500' },
      { label: 'With Catering (per pax)', price: '₱1,200' },
      { label: 'AV Equipment Package', price: '₱2,000' },
    ],
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80',
      'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=900&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=900&q=80',
    ],
  },
  'function-hall': {
    title: 'Function Hall',
    icon: '🎉',
    subtitle: 'Celebrate Every Moment.',
    description: 'Our grand function hall is the perfect venue for weddings, debuts, birthdays, and corporate events. With elegant interiors, customizable layouts, and a dedicated events team.',
    longDesc: 'The Grand Velour Function Hall accommodates up to 500 guests and features a state-of-the-art sound system, professional lighting rig, bridal suite, and full catering coordination.',
    hours: 'By Appointment',
    location: '5th Floor, Grand Ballroom',
    rates: [
      { label: 'Half Day (up to 200 pax)', price: '₱25,000' },
      { label: 'Full Day (up to 500 pax)', price: '₱45,000' },
      { label: 'Wedding Package', price: 'From ₱80,000' },
      { label: 'Corporate Event Package', price: 'From ₱35,000' },
    ],
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=900&q=80',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=900&q=80',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900&q=80',
    ],
  },
};

export default function AmenityScreen() {
  const { slug } = useLocalSearchParams();
  const router = useRouter();
  const data = amenityData[slug] || amenityData['fine-dining'];
  const [activeImg, setActiveImg] = useState(0);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <View style={styles.hero}>
        <Image source={{ uri: data.images[activeImg] }} style={styles.heroImage} />
        <LinearGradient
          colors={['rgba(13,13,13,0.1)', 'rgba(13,13,13,0.9)', '#0d0d0d']}
          style={styles.heroOverlay}
        />
        {/* Back button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.heroContent}>
          <Text style={styles.heroIcon}>{data.icon}</Text>
          <Text style={styles.heroSub}>{data.subtitle}</Text>
          <Text style={styles.heroTitle}>{data.title}</Text>
        </View>
      </View>

      {/* Thumbnail strip */}
      <View style={styles.thumbRow}>
        {data.images.map((img, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.thumb, activeImg === i && styles.thumbActive]}
            onPress={() => setActiveImg(i)}
            activeOpacity={0.8}
          >
            <Image source={{ uri: img }} style={styles.thumbImg} />
          </TouchableOpacity>
        ))}
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>ABOUT</Text>
        <Text style={styles.desc}>{data.description}</Text>
        <Text style={styles.descLong}>{data.longDesc}</Text>

        {/* Hours & Location */}
        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>HOURS</Text>
            <Text style={styles.infoValue}>{data.hours}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>LOCATION</Text>
            <Text style={styles.infoValue}>{data.location}</Text>
          </View>
        </View>
      </View>

      {/* Rates */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>RATES</Text>
        <View style={styles.ratesBox}>
          {data.rates.map((r, i) => (
            <View key={i} style={[styles.rateRow, i < data.rates.length - 1 && styles.rateRowBorder]}>
              <Text style={styles.rateLabel}>{r.label}</Text>
              <Text style={styles.ratePrice}>{r.price}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* CTA */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.bookBtn} onPress={() => router.push('/(tabs)/rooms')}>
          <Text style={styles.bookBtnText}>RESERVE A ROOM</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 48 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: Colors.background },
  hero:          { height: 420, position: 'relative' },
  heroImage:     { position: 'absolute', width: '100%', height: '100%' },
  heroOverlay:   { position: 'absolute', inset: 0, width: '100%', height: '100%' },
  backBtn:       { position: 'absolute', top: 52, left: 20, zIndex: 10, paddingVertical: 6, paddingHorizontal: 12, backgroundColor: 'rgba(13,13,13,0.6)' },
  backText:      { fontFamily: 'Jost_300Light', fontSize: 12, color: Colors.textSecondary, letterSpacing: 1 },
  heroContent:   { position: 'absolute', bottom: 36, left: 24 },
  heroIcon:      { fontSize: 32, marginBottom: 8 },
  heroSub:       { fontFamily: 'Jost_300Light', fontSize: 10, letterSpacing: 5, color: Colors.gold, marginBottom: 6 },
  heroTitle:     { fontFamily: 'CormorantGaramond_300Light', fontSize: 40, color: Colors.textPrimary, letterSpacing: 2 },
  thumbRow:      { flexDirection: 'row', backgroundColor: '#0a0a0a' },
  thumb:         { flex: 1, height: 70, opacity: 0.45 },
  thumbActive:   { opacity: 1, borderBottomWidth: 2, borderBottomColor: Colors.gold },
  thumbImg:      { width: '100%', height: '100%' },
  section:       { paddingHorizontal: 24, paddingTop: 32 },
  sectionLabel:  { fontFamily: 'Jost_300Light', fontSize: 9, letterSpacing: 4, color: Colors.gold, marginBottom: 16 },
  desc:          { fontFamily: 'CormorantGaramond_400Regular', fontSize: 17, color: Colors.textPrimary, lineHeight: 28, marginBottom: 16 },
  descLong:      { fontFamily: 'Jost_300Light', fontSize: 12, color: Colors.textMuted, lineHeight: 20, marginBottom: 24 },
  infoRow:       { flexDirection: 'row', gap: 12 },
  infoBox:       { flex: 1, backgroundColor: Colors.card, padding: 16, borderWidth: 1, borderColor: Colors.border },
  infoLabel:     { fontFamily: 'Jost_300Light', fontSize: 9, letterSpacing: 3, color: Colors.gold, marginBottom: 6 },
  infoValue:     { fontFamily: 'Jost_400Regular', fontSize: 12, color: Colors.textPrimary, lineHeight: 18 },
  ratesBox:      { borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.card },
  rateRow:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20 },
  rateRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  rateLabel:     { fontFamily: 'Jost_300Light', fontSize: 12, color: Colors.textMuted },
  ratePrice:     { fontFamily: 'CormorantGaramond_400Regular', fontSize: 18, color: Colors.gold },
  bookBtn:       { backgroundColor: Colors.gold, paddingVertical: 16, alignItems: 'center' },
  bookBtnText:   { fontFamily: 'Jost_500Medium', fontSize: 11, letterSpacing: 3, color: Colors.background },
});