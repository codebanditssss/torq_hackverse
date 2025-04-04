import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Header } from '@/components/Header';
import { ChatBot } from '@/components/ChatBot';
import { colors } from '@/constants/colors';

export default function ChatScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Support Chat" />
      <ChatBot />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});