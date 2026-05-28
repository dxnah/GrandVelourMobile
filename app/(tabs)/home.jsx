import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../hooks/useAuth';
import SectionHeader from '../../components/ui/SectionHeader';

const features = [
  { icon: '🍽️', title: 'Fine Dining',          desc: 'Award-winning restaurant on-site',      slug: 'fine-dining' },
  { icon: '💆', title: 'Spa & Wellness',        desc: 'Rejuvenate your mind and body',         slug: 'spa-wellness' },
  { icon: '🏊', title: 'Infinity Pool',         desc: 'Rooftop pool with panoramic views',     slug: 'infinity-pool' },
  { icon: '🚗', title: 'Valet Parking',         desc: 'Complimentary for all guests',          slug: 'valet-parking' },
  { icon: '🏋️', title: 'Gym / Fitness Center', desc: 'State-of-the-art exercise facilities',  slug: 'gym' },
  { icon: '🍸', title: 'Bar / Lounge',          desc: 'Premium drinks and social area',        slug: 'bar-lounge' },
  { icon: '💼', title: 'Conference Room',       desc: 'For meetings and seminars',             slug: 'conference-room' },
  { icon: '🎉', title: 'Function Hall',         desc: 'For weddings, birthdays, and events',  slug: 'function-hall' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <View style={styles.hero}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80' }}
          style={styles.heroImage}
        />
        <LinearGradient
          colors={['rgba(13,13,13,0.3)', 'rgba(13,13,13,0.85)', '#0d0d0d']}
          style={styles.heroOverlay}
        />
        <View style={styles.heroContent}>
          <Text style={styles.heroSub}>WELCOME BACK</Text>
          <Text style={styles.heroName}>{user?.first_name || 'Guest'}</Text>
          <Text style={styles.heroTagline}>Your luxury experience awaits</Text>
          <TouchableOpacity style={styles.heroBtn} onPress={() => router.push('/(tabs)/rooms')}>
            <Text style={styles.heroBtnText}>BOOK A ROOM</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Amenities */}
      <View style={styles.section}>
        <SectionHeader title="Hotel Amenities" />
        <View style={styles.featuresGrid}>
          {features.map((f, i) => (
            <TouchableOpacity
              key={i}
              style={styles.featureCard}
              onPress={() => router.push(`/(tabs)/amenity/${f.slug}`)}
              activeOpacity={0.75}
            >
              <Text style={styles.featureIcon}>{f.icon}</Text>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
              <Text style={styles.featureLearn}>LEARN MORE →</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: Colors.background },
  hero:         { height: 420, position: 'relative' },
  heroImage:    { position: 'absolute', width: '100%', height: '100%' },
  heroOverlay:  { position: 'absolute', inset: 0, width: '100%', height: '100%' },
  heroContent:  { position: 'absolute', bottom: 40, left: 28, right: 28 },
  heroSub:      { fontFamily: 'Jost_300Light', fontSize: 10, letterSpacing: 4, color: Colors.gold, marginBottom: 4 },
  heroName:     { fontFamily: 'CormorantGaramond_300Light', fontSize: 42, color: Colors.textPrimary, letterSpacing: 4 },
  heroTagline:  { fontFamily: 'Jost_300Light', fontSize: 13, color: Colors.textSecondary, marginBottom: 24 },
  heroBtn:      { backgroundColor: Colors.gold, paddingVertical: 14, paddingHorizontal: 32, alignSelf: 'flex-start' },
  heroBtnText:  { fontFamily: 'Jost_500Medium', fontSize: 11, letterSpacing: 3, color: Colors.background },
  section:      { paddingHorizontal: 24, paddingTop: 36 },
  featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 16 },
  featureCard:  { width: '47%', backgroundColor: Colors.card, padding: 20, borderWidth: 1, borderColor: Colors.border },
  featureIcon:  { fontSize: 28, marginBottom: 10 },
  featureTitle: { fontFamily: 'CormorantGaramond_400Regular', fontSize: 18, color: Colors.textPrimary, marginBottom: 4 },
  featureDesc:  { fontFamily: 'Jost_300Light', fontSize: 11, color: Colors.textMuted, lineHeight: 16, marginBottom: 12 },
  featureLearn: { fontFamily: 'Jost_400Regular', fontSize: 9, letterSpacing: 2, color: Colors.gold },
});