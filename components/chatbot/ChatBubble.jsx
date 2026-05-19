import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';

export default function ChatBubble({ message }) {
  const isBot = message.role === 'bot';

  return (
    <View style={[styles.row, isBot ? styles.rowLeft : styles.rowRight]}>
      {isBot && (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>GV</Text>
        </View>
      )}
      <View style={[styles.bubble, isBot ? styles.bubbleBot : styles.bubbleUser]}>
        <Text style={[styles.text, isBot ? styles.textBot : styles.textUser]}>
          {message.text}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row:        { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: 4 },
  rowLeft:    { justifyContent: 'flex-start' },
  rowRight:   { justifyContent: 'flex-end' },
  avatar:     { width: 32, height: 32, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.gold, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontFamily: 'CormorantGaramond_400Regular', fontSize: 10, color: Colors.gold },
  bubble:     { maxWidth: '75%', paddingVertical: 12, paddingHorizontal: 16 },
  bubbleBot:  { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border },
  bubbleUser: { backgroundColor: Colors.goldLight, borderWidth: 1, borderColor: Colors.borderGold },
  text:       { fontFamily: 'Jost_300Light', fontSize: 13, lineHeight: 20 },
  textBot:    { color: Colors.textPrimary },
  textUser:   { color: Colors.textPrimary },
});