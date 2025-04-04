import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { 
  CreditCard, 
  Smartphone, 
  Building, 
  Wallet, 
  Plus, 
  Check, 
  ChevronRight, 
  Trash2,
  Droplet,
  Battery
} from 'lucide-react-native';
import { PaymentMethod } from '@/types';

// Mock payment methods
const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'card',
    name: 'HDFC Credit Card',
    last4: '4242',
    expiryDate: '12/25',
    isDefault: true
  },
  {
    id: '2',
    type: 'upi',
    name: 'Google Pay',
    upiId: 'user@okicici',
    isDefault: false
  },
  {
    id: '3',
    type: 'netbanking',
    name: 'ICICI Bank',
    isDefault: false
  },
  {
    id: '4',
    type: 'wallet',
    name: 'Paytm Wallet',
    isDefault: false
  }
];

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleAddPaymentMethod = () => {
    Alert.alert('Add Payment Method', 'This feature will be implemented soon');
  };
  
  const handleSetDefault = (id: string) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setPaymentMethods(prevMethods => 
        prevMethods.map(method => ({
          ...method,
          isDefault: method.id === id
        }))
      );
      setIsLoading(false);
      
      Alert.alert('Success', 'Default payment method updated successfully');
    }, 800);
  };
  
  const handleDeletePaymentMethod = (id: string) => {
    Alert.alert(
      'Delete Payment Method',
      'Are you sure you want to delete this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setIsLoading(true);
            
            // Simulate API call
            setTimeout(() => {
              const isDefault = paymentMethods.find(method => method.id === id)?.isDefault;
              
              // Remove the payment method
              const updatedMethods = paymentMethods.filter(method => method.id !== id);
              
              // If we deleted the default method, set a new default
              if (isDefault && updatedMethods.length > 0) {
                updatedMethods[0].isDefault = true;
              }
              
              setPaymentMethods(updatedMethods);
              setIsLoading(false);
              
              Alert.alert('Success', 'Payment method deleted successfully');
            }, 800);
          }
        }
      ]
    );
  };
  
  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'card':
        return <CreditCard size={24} color={colors.primary} />;
      case 'upi':
        return <Smartphone size={24} color={colors.primary} />;
      case 'netbanking':
        return <Building size={24} color={colors.primary} />;
      case 'wallet':
        return <Wallet size={24} color={colors.primary} />;
      default:
        return <CreditCard size={24} color={colors.primary} />;
    }
  };
  
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Payment Methods" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Payment Methods" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Your Payment Methods</Text>
          
          {paymentMethods.length === 0 ? (
            <View style={styles.emptyState}>
              <CreditCard size={48} color={colors.gray} />
              <Text style={styles.emptyStateText}>No payment methods added yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Add a payment method to quickly pay for services
              </Text>
            </View>
          ) : (
            paymentMethods.map((method) => (
              <View key={method.id} style={styles.paymentMethodCard}>
                <View style={styles.paymentMethodHeader}>
                  <View style={styles.paymentMethodInfo}>
                    {getPaymentMethodIcon(method.type)}
                    <View style={styles.paymentMethodDetails}>
                      <Text style={styles.paymentMethodName}>{method.name}</Text>
                      {method.type === 'card' && (
                        <Text style={styles.paymentMethodSubtext}>
                          •••• {method.last4} | Expires {method.expiryDate}
                        </Text>
                      )}
                      {method.type === 'upi' && (
                        <Text style={styles.paymentMethodSubtext}>
                          UPI ID: {method.upiId}
                        </Text>
                      )}
                    </View>
                  </View>
                  
                  {method.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Check size={12} color={colors.white} />
                      <Text style={styles.defaultText}>Default</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.paymentMethodActions}>
                  {!method.isDefault && (
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleSetDefault(method.id)}
                    >
                      <Text style={styles.actionText}>Set as Default</Text>
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeletePaymentMethod(method.id)}
                  >
                    <Trash2 size={16} color={colors.danger} />
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
          
          <Button
            title="Add Payment Method"
            onPress={handleAddPaymentMethod}
            leftIcon={<Plus size={18} color={colors.white} />}
            style={styles.addButton}
          />
          
          <Text style={styles.sectionTitle}>Payment History</Text>
          
          <TouchableOpacity style={styles.historyItem}>
            <View style={styles.historyItemLeft}>
              <View style={styles.historyIconContainer}>
                <Droplet size={20} color={colors.secondary} />
              </View>
              <View>
                <Text style={styles.historyTitle}>Fuel Delivery</Text>
                <Text style={styles.historyDate}>May 15, 2023 • ₹577</Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.gray} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.historyItem}>
            <View style={styles.historyItemLeft}>
              <View style={styles.historyIconContainer}>
                <Battery size={20} color={colors.secondary} />
              </View>
              <View>
                <Text style={styles.historyTitle}>Battery Jump Start</Text>
                <Text style={styles.historyDate}>April 28, 2023 • ₹499</Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.gray} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All Transactions</Text>
          </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginTop: 8,
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 32,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
  },
  paymentMethodCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  paymentMethodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodDetails: {
    marginLeft: 12,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 4,
  },
  paymentMethodSubtext: {
    fontSize: 14,
    color: colors.gray,
  },
  defaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  defaultText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '500',
    marginLeft: 4,
  },
  paymentMethodActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginLeft: 8,
  },
  actionText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 14,
    color: colors.danger,
    fontWeight: '500',
    marginLeft: 4,
  },
  addButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  historyItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.dark,
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 14,
    color: colors.gray,
  },
  viewAllButton: {
    alignItems: 'center',
    padding: 16,
    marginBottom: 24,
  },
  viewAllText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
});