import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  ScrollView
} from 'react-native';
import { colors } from '@/constants/colors';
import { Header } from '@/components/Header';

export default function PrivacyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Privacy & Terms" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Privacy Policy</Text>
          
          <View style={styles.policySection}>
            <Text style={styles.policyTitle}>1. Information We Collect</Text>
            <Text style={styles.policyText}>
              We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, items requested, delivery notes, and other information you choose to provide.
            </Text>
          </View>
          
          <View style={styles.policySection}>
            <Text style={styles.policyTitle}>2. How We Use Your Information</Text>
            <Text style={styles.policyText}>
              We may use the information we collect about you to:
            </Text>
            <Text style={styles.policyBullet}>• Provide, maintain, and improve our services</Text>
            <Text style={styles.policyBullet}>• Process and complete transactions, and send related information</Text>
            <Text style={styles.policyBullet}>• Send technical notices, updates, security alerts, and support messages</Text>
            <Text style={styles.policyBullet}>• Respond to your comments, questions, and requests</Text>
            <Text style={styles.policyBullet}>• Communicate with you about products, services, offers, promotions, and events</Text>
            <Text style={styles.policyBullet}>• Monitor and analyze trends, usage, and activities in connection with our services</Text>
            <Text style={styles.policyBullet}>• Detect, investigate, and prevent fraudulent transactions and other illegal activities</Text>
            <Text style={styles.policyBullet}>• Personalize and improve the services</Text>
          </View>
          
          <View style={styles.policySection}>
            <Text style={styles.policyTitle}>3. Sharing of Information</Text>
            <Text style={styles.policyText}>
              We may share the information we collect about you as described in this policy or as disclosed at the time of collection or sharing, including as follows:
            </Text>
            <Text style={styles.policySubtitle}>With Service Providers:</Text>
            <Text style={styles.policyText}>
              We may share your information with third-party vendors, consultants, and other service providers who perform services on our behalf.
            </Text>
            <Text style={styles.policySubtitle}>For Legal Reasons:</Text>
            <Text style={styles.policyText}>
              We may share your information if we believe that disclosure is reasonably necessary to comply with any applicable law, regulation, legal process, or governmental request.
            </Text>
          </View>
          
          <Text style={styles.sectionTitle}>Terms of Service</Text>
          
          <View style={styles.policySection}>
            <Text style={styles.policyTitle}>1. Acceptance of Terms</Text>
            <Text style={styles.policyText}>
              By creating an account and using our services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing our services.
            </Text>
          </View>
          
          <View style={styles.policySection}>
            <Text style={styles.policyTitle}>2. Use of Services</Text>
            <Text style={styles.policyText}>
              Our services are available only for individuals who are at least 18 years old. You may not use our services for any illegal or unauthorized purpose nor may you, in the use of the service, violate any laws in your jurisdiction.
            </Text>
          </View>
          
          <View style={styles.policySection}>
            <Text style={styles.policyTitle}>3. Account Responsibility</Text>
            <Text style={styles.policyText}>
              You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password. We encourage you to use "strong" passwords (passwords that use a combination of upper and lower case letters, numbers, and symbols) with your account.
            </Text>
          </View>
          
          <View style={styles.policySection}>
            <Text style={styles.policyTitle}>4. Termination</Text>
            <Text style={styles.policyText}>
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the service will immediately cease.
            </Text>
          </View>
          
          <View style={styles.policySection}>
            <Text style={styles.policyTitle}>5. Changes to Terms</Text>
            <Text style={styles.policyText}>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect.
            </Text>
          </View>
          
          <View style={styles.policySection}>
            <Text style={styles.policyTitle}>6. Contact Us</Text>
            <Text style={styles.policyText}>
              If you have any questions about these Terms, please contact us at legal@saarthi.com.
            </Text>
          </View>
          
          <Text style={styles.lastUpdated}>Last Updated: June 1, 2023</Text>
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
    fontSize: 20,
    fontWeight: '700',
    color: colors.dark,
    marginTop: 16,
    marginBottom: 16,
  },
  policySection: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  policyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 8,
  },
  policySubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
    marginTop: 12,
    marginBottom: 4,
  },
  policyText: {
    fontSize: 14,
    color: colors.dark,
    lineHeight: 20,
    marginBottom: 8,
  },
  policyBullet: {
    fontSize: 14,
    color: colors.dark,
    lineHeight: 20,
    marginLeft: 8,
    marginBottom: 4,
  },
  lastUpdated: {
    fontSize: 12,
    color: colors.gray,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
});