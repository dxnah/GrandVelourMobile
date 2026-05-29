import { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform,
  ScrollView,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import ChatBubble from '../../components/chatbot/ChatBubble';

// ── Rule-based engine (mirrors the web) ──────────────────────────────────────
const RULES = [
  { patterns: ["hello","hi","hey","good morning","good afternoon","good evening","greetings"],
    response: "Welcome to Grand Velour! I'm Velour, your personal concierge. How may I assist you today — rooms, bookings, or hotel services?" },
  { patterns: ["room","rooms","accommodation","stay","available room"],
    response: "Grand Velour offers four room types:\n• Single — ₱1,500/night (1 guest)\n• Double — ₱2,500/night (2 guests)\n• Deluxe — ₱8,000/night (up to 3 guests)\n• Suite — ₱5,000/night (up to 4 guests)\n\nWould you like to know more about a specific room type?" },
  { patterns: ["single","single room"],
    response: "Our Single Room is ₱1,500 per night, ideal for solo travelers. It includes a comfortable bed, private bathroom, and all essential amenities. Shall I help you reserve one?" },
  { patterns: ["double","double room"],
    response: "Our Double Room is ₱2,500 per night, perfect for couples or two guests. It features a spacious layout and premium furnishings. Would you like to book one?" },
  { patterns: ["suite","suite room"],
    response: "Our Suite is ₱5,000 per night, offering a luxurious stay for up to 4 guests with a separate living area and premium amenities. Shall I assist you with a reservation?" },
  { patterns: ["deluxe","deluxe room"],
    response: "Our Deluxe Room is ₱8,000 per night — our finest offering, with elevated interiors, premium bedding, and exclusive services for up to 3 guests. Would you like to reserve this room?" },
  { patterns: ["price","cost","rate","how much","rates","pricing"],
    response: "Our nightly rates are:\n• Single — ₱1,500\n• Double — ₱2,500\n• Suite — ₱5,000\n• Deluxe — ₱8,000\n\nAll rates are per night. Is there a room type you're interested in?" },
  { patterns: ["book","booking","reserve","reservation","make a booking","how to book"],
    response: "To make a reservation, go to the Rooms tab and tap 'Book Now' on your preferred room. Select your dates and confirm your details. May I help with anything else?" },
  { patterns: ["check booking","my booking","find booking","look up","booking reference","booking status"],
    response: "You can view your bookings in the Bookings tab. All your reservations are listed there with their current status. Would you like help with anything else?" },
  { patterns: ["cancel","cancellation","cancel booking"],
    response: "To cancel a booking, go to the Bookings tab, tap on your reservation, and select 'Cancel'. Please note this action cannot be undone. Need more help?" },
  { patterns: ["reschedule","change date","change dates","move booking","new dates"],
    response: "To reschedule, open your booking in the Bookings tab and select 'Reschedule'. You can then pick new check-in and check-out dates. Is there anything else I can help with?" },
  { patterns: ["check in","check-in","checkin","arrival"],
    response: "Standard check-in time is 2:00 PM. Early check-in may be available upon request — please let our front desk know in advance." },
  { patterns: ["check out","check-out","checkout","departure"],
    response: "Standard check-out time is 12:00 PM (noon). Late check-out may be arranged depending on availability. We hope your stay will be wonderful!" },
  { patterns: ["amenities","facilities","services","what is included","inclusions"],
    response: "Grand Velour amenities include:\n• Free Wi-Fi in all rooms\n• 24-hour room service\n• Daily housekeeping\n• In-house restaurant & bar\n• Concierge assistance\n• Secure parking\n• Laundry service\n\nIs there a specific service you'd like to know more about?" },
  { patterns: ["wifi","wi-fi","internet","connection"],
    response: "Complimentary high-speed Wi-Fi is available throughout all rooms and public areas. Just connect to the 'GrandVelour_Guest' network — no password needed." },
  { patterns: ["parking","park","car","vehicle"],
    response: "Grand Velour offers secure on-site parking for all registered guests. Please inform the front desk upon check-in if you'll be bringing a vehicle." },
  { patterns: ["restaurant","food","dining","eat","breakfast","lunch","dinner","meal","room service"],
    response: "Our in-house restaurant serves Filipino and international cuisine. Room service is available 24 hours. Breakfast is served from 6:00 AM to 10:00 AM." },
  { patterns: ["contact","front desk","reception","call","phone","email","reach"],
    response: "Our front desk staff is available 24/7. You can reach them through the contact details on the hotel detail page, or ask me any question here." },
  { patterns: ["thank you","thanks","thank","salamat"],
    response: "You're most welcome! It's our pleasure to assist. Is there anything else I may help you with at Grand Velour?" },
  { patterns: ["bye","goodbye","see you","take care","that's all","thats all","nothing else"],
    response: "Thank you for reaching out to Grand Velour. We look forward to welcoming you. Have a wonderful day!" },
  { patterns: ["great","awesome","excellent","wonderful","amazing","good job","nice"],
    response: "Thank you for your kind words! Grand Velour strives to deliver excellence in every detail. Is there anything else I may assist you with?" },
];

const DEFAULT_RESPONSE = "I'm not quite sure I understand. You may ask me about our rooms, rates, bookings, check-in/check-out, or amenities. How may I assist you?";

const SUGGESTIONS = ["Room rates", "How to book", "Check-in time", "Amenities", "Cancel booking"];

function getRuleBasedReply(input) {
  const lower = input.toLowerCase().trim();
  for (const rule of RULES) {
    if (rule.patterns.some(p => lower.includes(p))) return rule.response;
  }
  return DEFAULT_RESPONSE;
}

export default function ChatbotScreen() {
  const [messages, setMessages] = useState([
    { id: '0', role: 'bot', text: "Welcome to Grand Velour. I'm Velour, your personal concierge. How may I assist you today?" }
  ]);
  const [input, setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const listRef = useRef(null);

  const sendMessage = (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || loading) return;

    const userMsg = { id: Date.now().toString(), role: 'user', text: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setShowSuggestions(false);

    setTimeout(() => {
      const reply = getRuleBasedReply(trimmed);
      const botMsg = { id: (Date.now() + 1).toString(), role: 'bot', text: reply };
      setMessages(prev => [...prev, botMsg]);
      setLoading(false);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }, 600);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>V</Text>
            </View>
            <View>
              <Text style={styles.title}>VELOUR</Text>
              <Text style={styles.subtitle}>Grand Velour Concierge · Online</Text>
            </View>
          </View>
          <View style={styles.onlineDot} />
        </View>

        {/* Messages */}
        <FlatList
          ref={listRef}
          data={loading
            ? [...messages, { id: 'typing', role: 'bot', text: '...', isTyping: true }]
            : messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) =>
            item.isTyping ? (
              <View style={styles.typingRow}>
                <View style={styles.typingBubble}>
                  <Text style={styles.typingDots}>• • •</Text>
                </View>
              </View>
            ) : (
              <ChatBubble message={item} />
            )
          }
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
        />

        {/* Suggestions */}
        {showSuggestions && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.suggestionsScroll}
            contentContainerStyle={styles.suggestionsContent}
          >
            {SUGGESTIONS.map(s => (
              <TouchableOpacity key={s} style={styles.chip} onPress={() => sendMessage(s)}>
                <Text style={styles.chipText}>{s.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Input */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Ask about rooms, bookings..."
            placeholderTextColor={Colors.textMuted}
            onSubmitEditing={() => sendMessage()}
            returnKeyType="send"
            editable={!loading}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
            onPress={() => sendMessage()}
            disabled={!input.trim() || loading}
          >
            <Text style={styles.sendIcon}>↑</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Grand Velour Concierge · Rule-based Assistant</Text>
        </View>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: Colors.background },

  header:           { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                      paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16,
                      borderBottomWidth: 1, borderBottomColor: Colors.border,
                      backgroundColor: Colors.background },
  headerLeft:       { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar:           { width: 36, height: 36, backgroundColor: Colors.gold,
                      justifyContent: 'center', alignItems: 'center' },
  avatarText:       { fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 18, color: Colors.background },
  title:            { fontFamily: 'Jost_500Medium', fontSize: 11, letterSpacing: 3, color: Colors.gold },
  subtitle:         { fontFamily: 'Jost_300Light', fontSize: 10, color: Colors.textMuted, marginTop: 2 },
  onlineDot:        { width: 8, height: 8, borderRadius: 4, backgroundColor: '#7eb87e' },

  messageList:      { padding: 20, gap: 12, paddingBottom: 8 },

  typingRow:        { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: 4 },
  typingBubble:     { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border,
                      paddingVertical: 12, paddingHorizontal: 16 },
  typingDots:       { fontFamily: 'Jost_300Light', fontSize: 16, color: Colors.gold, letterSpacing: 4 },

  suggestionsScroll:   { maxHeight: 44, borderTopWidth: 1, borderTopColor: Colors.border },
  suggestionsContent:  { paddingHorizontal: 16, paddingVertical: 8, gap: 8, flexDirection: 'row' },
  chip:             { borderWidth: 1, borderColor: 'rgba(201,169,110,0.3)',
                      backgroundColor: 'rgba(201,169,110,0.07)',
                      paddingVertical: 5, paddingHorizontal: 12 },
  chipText:         { fontFamily: 'Jost_400Regular', fontSize: 9, letterSpacing: 1.5, color: Colors.gold },

  inputRow:         { flexDirection: 'row', padding: 16, paddingTop: 12,
                      borderTopWidth: 1, borderTopColor: Colors.border, gap: 12 },
  input:            { flex: 1, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border,
                      color: Colors.textPrimary, fontFamily: 'Jost_400Regular', fontSize: 14,
                      paddingHorizontal: 16, paddingVertical: 12 },
  sendBtn:          { backgroundColor: Colors.gold, width: 48, alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled:  { backgroundColor: Colors.border },
  sendIcon:         { color: Colors.background, fontSize: 20, fontWeight: '600' },

  footer:           { paddingBottom: 8, alignItems: 'center' },
  footerText:       { fontFamily: 'Jost_300Light', fontSize: 9, letterSpacing: 1.5,
                      color: Colors.textMuted, textTransform: 'uppercase' },
});