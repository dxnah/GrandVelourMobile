import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';

export default function OutlineButton({ title, onPress, disabled = false }) {
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
  btn:      { borderWidth: 1, borderColor: Colors.gold, paddingVertical: 16, alignItems: 'center', marginTop: 12 },
  disabled: { opacity: 0.5 },
  text:     { fontFamily: 'Jost_400Regular', fontSize: 12, letterSpacing: 3, color: Colors.gold, textTransform: 'uppercase' },
});