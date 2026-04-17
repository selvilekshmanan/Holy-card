import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
} from 'react-native';

type AIChatProps = {
  onBack: () => void;
  onNavigateToBirthdayCards?: () => void;
};

type Message = {
  role: 'user' | 'assistant';
  text: string;
};

const AIChat: React.FC<AIChatProps> = ({ onBack, onNavigateToBirthdayCards }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const generateResponse = (text: string) => {
    const normalized = text.toLowerCase();

    if (normalized.includes('birthday')) {
      return 'Looking for birthday card ideas? I can help you choose the perfect card and delivery option.';
    }

    if (normalized.includes('gift')) {
      return 'Need a gift? I can recommend popular cards, flowers, and gift bundles for any occasion.';
    }

    if (normalized.includes('flower') || normalized.includes('plant')) {
      return 'Flowers and plants are a great choice. Tell me the occasion and I can suggest something special.';
    }

    if (normalized.includes('order') || normalized.includes('delivery')) {
      return 'I can help you track your order and suggest the best delivery time for your gift.';
    }

    if (normalized.includes('hello') || normalized.includes('hi')) {
      return 'Hi there! How can I help you with cards, gifts, or delivery today?';
    }

    return 'I am here to help with cards, gifts, flowers, and birthday reminders. Ask me anything!';
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: Message = { role: 'user', text: trimmed };
    const assistantMessage: Message = {
      role: 'assistant',
      text: generateResponse(trimmed),
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setInput('');

    // Check for navigation triggers
    const normalized = trimmed.toLowerCase();
    if (normalized.includes('birthday') && normalized.includes('gift') && onNavigateToBirthdayCards) {
      onNavigateToBirthdayCards();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backButton}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>AI Assistant</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
        ref={scrollRef}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Ask me anything about cards, gifts, or delivery.</Text>
          </View>
        ) : (
          messages.map((message, index) => (
            <View
              key={index}
              style={
                message.role === 'user'
                  ? styles.userBubble
                  : styles.assistantBubble
              }
            >
              <Text
                style={
                  message.role === 'user'
                    ? styles.userText
                    : styles.assistantText
                }
              >
                {message.text}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          placeholderTextColor="#999"
          value={input}
          onChangeText={setInput}
          returnKeyType="send"
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    fontSize: 16,
    color: '#20c4b2',
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  spacer: {
    width: 60,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  chatContent: {
    paddingVertical: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#20c4b2',
    padding: 12,
    borderRadius: 18,
    marginBottom: 10,
    maxWidth: '80%',
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#f1f1f1',
    padding: 12,
    borderRadius: 18,
    marginBottom: 10,
    maxWidth: '80%',
  },
  userText: {
    color: '#fff',
    fontSize: 15,
  },
  assistantText: {
    color: '#222',
    fontSize: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 16,
    color: '#111',
    backgroundColor: '#fafafa',
  },
  sendButton: {
    marginLeft: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: '#20c4b2',
    borderRadius: 22,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default AIChat;
