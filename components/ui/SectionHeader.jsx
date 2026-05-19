import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';

export default function SectionHeader({ title }) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 8 },
  title:   { fontFamily: 'CormorantGaramond_400Regular', fontSize: 26, color: Colors.textPrimary, marginBottom: 8 },
  line:    { height: 1, width: 40, backgroundColor: Colors.gold },
});