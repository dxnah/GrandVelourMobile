import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';

export default function VelourInput({ label, error, ...props }) {
  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label.toUpperCase()}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor={Colors.textMuted}
        selectionColor={Colors.gold}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper:    { marginBottom: 20 },
  label:      { fontFamily: 'Jost_400Regular', fontSize: 10, letterSpacing: 2, color: Colors.textMuted, marginBottom: 8 },
  input:      { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, color: Colors.textPrimary, fontFamily: 'Jost_400Regular', fontSize: 14, paddingHorizontal: 16, paddingVertical: 14 },
  inputError: { borderColor: Colors.error },
  errorText:  { fontFamily: 'Jost_300Light', fontSize: 11, color: Colors.error, marginTop: 4 },
});