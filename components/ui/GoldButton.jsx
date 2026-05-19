import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';

export default function GoldButton({ title, onPress, disabled = false }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.btn, disabled && styles.disabled]}
      activeOpacity={0.8}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn:      { backgroundColor: Colors.gold, paddingVertical: 16, alignItems: 'center', marginTop: 16 },
  disabled: { opacity: 0.5 },
  text:     { fontFamily: 'Jost_500Medium', fontSize: 12, letterSpacing: 3, color: Colors.background, textTransform: 'uppercase' },
});