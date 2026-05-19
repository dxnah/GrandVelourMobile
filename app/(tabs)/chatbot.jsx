import { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Colors } from '../../constants/Colors';
import api from '../../services/api';
import ChatBubble from '../../components/chatbot/ChatBubble';

const SYSTEM_PROMPT = `You are a luxury hotel concierge for Grand Velour Hotel. 
You help guests with room inquiries, bookings, hotel amenities, local recommendations, 
and any hotel-related questions. Keep responses elegant, concise, and helpful. 
Always maintain a refined, professional tone.`;

export default function ChatbotScreen() {
  const [messages, setMessages] = useState([
    { id: '0', role: 'bot', text: 'Good evening. I am your Grand Velour concierge. How may I assist you today?' }
  ]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { id: Date.now().toString(), role: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input.trim();
    setInput('');
    setLoading(true);

    try {
      // Send to your Django chatbot endpoint
      const res = await api.post('/api/v1/chat/', { message: currentInput, system: SYSTEM_PROMPT });
      const botMsg = { id: (Date.now() + 1).toString(), role: 'bot', text: res.data.reply };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      const errMsg = { id: (Date.now() + 1).toString(), role: 'bot', text: 'I apologize, I am currently unavailable. Please try again shortly.' };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Concierge</Text>
          <Text style={styles.subtitle}>AI-POWERED ASSISTANCE</Text>
        </View>

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChatBubble message={item} />}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        />

        {loading && (
          <View style={styles.typingRow}>
            <ActivityIndicator color={Colors.gold} size="small" />
            <Text style={styles.typingText}>Concierge is typing...</Text>
          </View>
        )}

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Ask anything..."
            placeholderTextColor={Colors.textMuted}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage} disabled={loading}>
            <Text style={styles.sendIcon}>↑</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: Colors.background },
  header:      { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: Colors.border },
  title:       { fontFamily: 'CormorantGaramond_300Light', fontSize: 32, color: Colors.textPrimary, letterSpacing: 4 },
  subtitle:    { fontFamily: 'Jost_300Light', fontSize: 10, letterSpacing: 4, color: Colors.gold, marginTop: 2 },
  messageList: { padding: 20, gap: 12 },
  typingRow:   { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 8, gap: 8 },
  typingText:  { fontFamily: 'Jost_300Light', fontSize: 12, color: Colors.textMuted, fontStyle: 'italic' },
  inputRow:    { flexDirection: 'row', padding: 16, borderTopWidth: 1, borderTopColor: Colors.border, gap: 12 },
  input:       { flex: 1, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, color: Colors.textPrimary, fontFamily: 'Jost_400Regular', fontSize: 14, paddingHorizontal: 16, paddingVertical: 12 },
  sendBtn:     { backgroundColor: Colors.gold, width: 48, alignItems: 'center', justifyContent: 'center' },
  sendIcon:    { color: Colors.background, fontSize: 20, fontWeight: '600' },
});