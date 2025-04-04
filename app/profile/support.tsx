import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Linking
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  HelpCircle, 
  FileText, 
  ChevronRight, 
  ExternalLink 
} from 'lucide-react-native';

export default function SupportScreen() {
  const router = useRouter();
  
  const handleChatWithSupport = () => {
    router.push('/support/chat');
  };
  
  const handleCall = () => {
    Linking.openURL('tel:1800-123-4567');
  };
  
  const handleEmail = () => {
    Linking.openURL('mailto:support@saarthi.com');
  };
  
  const faqCategories = [
    {
      title: 'Account & Profile',
      questions: [
        'How do I update my profile information?',
        'How do I change my password?',
        'How do I delete my account?'
      ]
    },
    {
      title: 'Services & Requests',
      questions: [
        'How do I request emergency fuel delivery?',
        'What happens if no service provider is available?',
        'How do I track my service request?'
      ]
    },
    {
      title: 'Payments & Billing',
      questions: [
        'What payment methods are accepted?',
        'How do I add a new payment method?',
        'How do I get a receipt for my service?'
      ]
    },
    {
      title: 'Technical Issues',
      questions: [
        'The app is not working properly, what should I do?',
        'Why is my location not being detected?',
        'How do I update the app?'
      ]
    }
  ];
  
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Help & Support" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          
          <View style={styles.contactOptionsContainer}>
            <TouchableOpacity 
              style={styles.contactOption}
              onPress={handleChatWithSupport}
            >
              <View style={[styles.contactIconContainer, styles.chatIcon]}>
                <MessageSquare size={24} color={colors.white} />
              </View>
              <Text style={styles.contactOptionTitle}>Chat with Support</Text>
              <Text style={styles.contactOptionDescription}>
                Get instant help from our support team
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.contactOption}
              onPress={handleCall}
            >
              <View style={[styles.contactIconContainer, styles.callIcon]}>
                <Phone size={24} color={colors.white} />
              </View>
              <Text style={styles.contactOptionTitle}>Call Us</Text>
              <Text style={styles.contactOptionDescription}>
                1800-123-4567 (Toll Free)
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.contactOption}
              onPress={handleEmail}
            >
              <View style={[styles.contactIconContainer, styles.emailIcon]}>
                <Mail size={24} color={colors.white} />
              </View>
              <Text style={styles.contactOptionTitle}>Email Us</Text>
              <Text style={styles.contactOptionDescription}>
                support@saarthi.com
              </Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          
          {faqCategories.map((category, index) => (
            <View key={index} style={styles.faqCategory}>
              <Text style={styles.faqCategoryTitle}>{category.title}</Text>
              
              {category.questions.map((question, qIndex) => (
                <TouchableOpacity 
                  key={qIndex}
                  style={styles.faqQuestion}
                >
                  <View style={styles.faqQuestionContent}>
                    <HelpCircle size={16} color={colors.primary} />
                    <Text style={styles.faqQuestionText}>{question}</Text>
                  </View>
                  <ChevronRight size={16} color={colors.gray} />
                </TouchableOpacity>
              ))}
            </View>
          ))}
          
          <Text style={styles.sectionTitle}>Resources</Text>
          
          <TouchableOpacity style={styles.resourceItem}>
            <View style={styles.resourceItemLeft}>
              <FileText size={20} color={colors.primary} />
              <Text style={styles.resourceTitle}>User Guide</Text>
            </View>
            <ExternalLink size={16} color={colors.gray} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.resourceItem}>
            <View style={styles.resourceItemLeft}>
              <FileText size={20} color={colors.primary} />
              <Text style={styles.resourceTitle}>Service Provider Guidelines</Text>
            </View>
            <ExternalLink size={16} color={colors.gray} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.resourceItem}>
            <View style={styles.resourceItemLeft}>
              <FileText size={20} color={colors.primary} />
              <Text style={styles.resourceTitle}>Emergency Response Tips</Text>
            </View>
            <ExternalLink size={16} color={colors.gray} />
          </TouchableOpacity>
          
          <Button
            title="Chat with Support"
            onPress={handleChatWithSupport}
            leftIcon={<MessageSquare size={18} color={colors.white} />}
            style={styles.chatButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
    marginTop: 16,
    marginBottom: 16,
  },
  contactOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  contactOption: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contactIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  chatIcon: {
    backgroundColor: colors.primary,
  },
  callIcon: {
    backgroundColor: colors.success,
  },
  emailIcon: {
    backgroundColor: colors.info,
  },
  contactOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 4,
    textAlign: 'center',
  },
  contactOptionDescription: {
    fontSize: 12,
    color: colors.gray,
    textAlign: 'center',
  },
  faqCategory: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  faqCategoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 12,
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  faqQuestionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  faqQuestionText: {
    fontSize: 14,
    color: colors.dark,
    marginLeft: 8,
    flex: 1,
  },
  resourceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resourceItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resourceTitle: {
    fontSize: 16,
    color: colors.dark,
    marginLeft: 12,
  },
  chatButton: {
    marginTop: 16,
    marginBottom: 32,
  },
});