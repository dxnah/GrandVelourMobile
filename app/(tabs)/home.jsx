import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../hooks/useAuth';
import SectionHeader from '../../components/ui/SectionHeader';

const features = [
  { icon: '🍽️', title: 'Fine Dining',    desc: 'Award-winning restaurant' },
  { icon: '💆', title: 'Spa & Wellness', desc: 'Rejuvenate your body' },
  { icon: '🏊', title: 'Infinity Pool',  desc: 'Rooftop with panoramic views' },
  { icon: '🏋️', title: 'Fitness Center', desc: 'State-of-the-art equipment' },
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

      {/* Features */}
      <View style={styles.section}>
        <SectionHeader title="Hotel Amenities" />
        <View style={styles.featuresGrid}>
          {features.map((f, i) => (
            <View key={i} style={styles.featureCard}>
              <Text style={styles.featureIcon}>{f.icon}</Text>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <SectionHeader title="Quick Actions" />
        <TouchableOpacity style={styles.actionRow} onPress={() => router.push('/(tabs)/bookings')}>
          <Text style={styles.actionText}>View My Bookings</Text>
          <Text style={styles.actionArrow}>→</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionRow} onPress={() => router.push('/(tabs)/chatbot')}>
          <Text style={styles.actionText}>Chat with Concierge</Text>
          <Text style={styles.actionArrow}>→</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionRow} onPress={() => router.push('/(tabs)/profile')}>
          <Text style={styles.actionText}>Manage Profile</Text>
          <Text style={styles.actionArrow}>→</Text>
        </TouchableOpacity>
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
  featureDesc:  { fontFamily: 'Jost_300Light', fontSize: 11, color: Colors.textMuted, lineHeight: 16 },
  actionRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: Colors.border },
  actionText:   { fontFamily: 'Jost_400Regular', fontSize: 13, color: Colors.textPrimary, letterSpacing: 1 },
  actionArrow:  { color: Colors.gold, fontSize: 18 },
});