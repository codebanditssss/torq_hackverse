import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { colors } from '@/constants/colors';
import { Send, Mic, MicOff, X, Bot } from 'lucide-react-native';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// Predefined responses for the chatbot
const botResponses: Record<string, string[]> = {
  greeting: [
    "Hello! How can I help you with your vehicle today?",
    "Hi there! I'm Saarthi's assistant. What service do you need?",
    "Welcome to Saarthi! How may I assist you with your vehicle emergency?"
  ],
  fuel: [
    "Our fuel delivery service brings petrol or diesel directly to your location. Would you like to place a request?",
    "We can deliver fuel to your location within 30-60 minutes. What type of fuel do you need?",
    "For fuel delivery, we'll need your location and vehicle details. Would you like to proceed with a request?"
  ],
  battery: [
    "Battery issues can be frustrating. Our technicians can provide a jump start within 30 minutes. Would you like to request this service?",
    "For battery jump start service, we'll send a technician with proper equipment. Would you like to place a request?",
    "Our battery service includes jump start and basic battery health check. Would you like to proceed?"
  ],
  tire: [
    "For flat tire assistance, we can either repair your tire or replace it with your spare. Would you like to request this service?",
    "Our tire service technicians carry basic repair kits and can help mount your spare tire. Would you like to place a request?",
    "Flat tire? We can help! Our technicians can be at your location within 30-45 minutes. Would you like to proceed?"
  ],
  tow: [
    "Our towing service can transport your vehicle to the nearest garage or a location of your choice. Would you like to request this service?",
    "For towing, we'll need your current location and destination. Would you like to place a towing request?",
    "We offer safe and quick towing services for all vehicle types. Would you like to proceed with a request?"
  ],
  lockout: [
    "Locked out of your vehicle? Our technicians can help you regain access safely. Would you like to request this service?",
    "Our lockout assistance is quick and damage-free. Would you like to place a request?",
    "For lockout service, we'll need your vehicle details. Would you like to proceed with a request?"
  ],
  payment: [
    "You can pay for our services using credit/debit cards, UPI, or cash. Would you like to update your payment preferences?",
    "All payments are secure and you'll receive a digital receipt after service completion. Is there anything specific about payments you'd like to know?",
    "We offer transparent pricing with no hidden fees. You can view the estimated cost before confirming any service."
  ],
  cancel: [
    "You can cancel a service request from the tracking screen. If the service hasn't been accepted yet, there's no cancellation fee.",
    "To cancel a request, go to the active request in your home screen or history tab and select 'Cancel Request'.",
    "Cancellation is free if done before a service provider accepts your request. A nominal fee may apply afterward."
  ],
  contact: [
    "You can reach our customer support team at support@saarthi.com or call us at 1800-123-4567.",
    "Our support team is available 24/7. Would you like me to connect you with a support agent?",
    "For urgent matters, you can use the SOS button on the home screen to get immediate assistance."
  ],
  default: [
    "I'm not sure I understand. Could you rephrase your question?",
    "I'm still learning. Could you try asking in a different way?",
    "I don't have information on that yet. Would you like to speak with a customer support agent?"
  ]
};

// Function to get a random response from the appropriate category
const getBotResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  let category = 'default';
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    category = 'greeting';
  } else if (lowerMessage.includes('fuel') || lowerMessage.includes('petrol') || lowerMessage.includes('diesel')) {
    category = 'fuel';
  } else if (lowerMessage.includes('battery') || lowerMessage.includes('jump') || lowerMessage.includes('dead')) {
    category = 'battery';
  } else if (lowerMessage.includes('tire') || lowerMessage.includes('flat') || lowerMessage.includes('puncture')) {
    category = 'tire';
  } else if (lowerMessage.includes('tow') || lowerMessage.includes('breakdown')) {
    category = 'tow';
  } else if (lowerMessage.includes('lock') || lowerMessage.includes('key')) {
    category = 'lockout';
  } else if (lowerMessage.includes('pay') || lowerMessage.includes('card') || lowerMessage.includes('upi')) {
    category = 'payment';
  } else if (lowerMessage.includes('cancel')) {
    category = 'cancel';
  } else if (lowerMessage.includes('contact') || lowerMessage.includes('support') || lowerMessage.includes('help')) {
    category = 'contact';
  }
  
  const responses = botResponses[category];
  return responses[Math.floor(Math.random() * responses.length)];
};

export const ChatBot: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your Saarthi assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Simulate voice recording
  const handleVoiceToggle = () => {
    if (isRecording) {
      // Simulate voice recognition result
      const voiceTexts = [
        "I need fuel delivery",
        "My car battery is dead",
        "I have a flat tire",
        "I'm locked out of my car"
      ];
      const randomText = voiceTexts[Math.floor(Math.random() * voiceTexts.length)];
      setInputText(randomText);
    }
    setIsRecording(!isRecording);
  };

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    
    // Simulate bot thinking and typing
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(userMessage.text),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.botInfo}>
          <View style={styles.botIconContainer}>
            <Bot size={24} color={colors.white} />
          </View>
          <Text style={styles.headerTitle}>Yuvi</Text>
        </View>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={colors.dark} />
          </TouchableOpacity>
        )}
      </View>
      
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((message) => (
          <View 
            key={message.id}
            style={[
              styles.messageBubble,
              message.sender === 'user' ? styles.userBubble : styles.botBubble
            ]}
          >
            <Text style={styles.messageText}>{message.text}</Text>
            <Text style={styles.messageTime}>{formatTime(message.timestamp)}</Text>
          </View>
        ))}
        
        {isTyping && (
          <View style={[styles.messageBubble, styles.botBubble]}>
            <View style={styles.typingIndicator}>
              <View style={styles.typingDot} />
              <View style={[styles.typingDot, styles.typingDotMiddle]} />
              <View style={styles.typingDot} />
            </View>
          </View>
        )}
      </ScrollView>
      
      <View style={styles.inputContainer}>
        <TouchableOpacity 
          style={[
            styles.voiceButton,
            isRecording && styles.recordingButton
          ]}
          onPress={handleVoiceToggle}
        >
          {isRecording ? (
            <MicOff size={20} color={colors.white} />
          ) : (
            <Mic size={20} color={colors.primary} />
          )}
        </TouchableOpacity>
        
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleSendMessage}
          returnKeyType="send"
        />
        
        <TouchableOpacity 
          style={[
            styles.sendButton,
            !inputText.trim() && styles.sendButtonDisabled
          ]}
          onPress={handleSendMessage}
          disabled={!inputText.trim()}
        >
          <Send size={20} color={inputText.trim() ? colors.white : colors.lightGray} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  botInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  botIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
  },
  closeButton: {
    padding: 4,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 24,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  userBubble: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: colors.light,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: colors.dark,
  },
  messageTime: {
    fontSize: 12,
    color: colors.gray,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  typingIndicator: {
    flexDirection: 'row',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gray,
    marginHorizontal: 2,
    opacity: 0.6,
  },
  typingDotMiddle: {
    opacity: 0.8,
    transform: [{ translateY: -4 }],
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  voiceButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  recordingButton: {
    backgroundColor: colors.danger,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: colors.light,
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.dark,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: colors.lightGray,
  },
});