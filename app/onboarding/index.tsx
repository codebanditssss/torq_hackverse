import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  FlatList, 
  Dimensions, 
  TouchableOpacity,
  Animated
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { useAuthStore } from '@/store/auth-store';
import { Car, Shield, Clock, MapPin, Zap } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    id: '1',
    title: 'Emergency Vehicle Care',
    description: 'Get immediate assistance for your vehicle emergencies, anytime, anywhere.',
    icon: <Car size={80} color={colors.primary} />
  },
  {
    id: '2',
    title: 'Verified Providers',
    description: 'All our service providers are verified professionals with proper certifications.',
    icon: <Shield size={80} color={colors.primary} />
  },
  {
    id: '3',
    title: 'Real-time Tracking',
    description: 'Track your service provider in real-time and get accurate ETAs.',
    icon: <Clock size={80} color={colors.primary} />
  },
  {
    id: '4',
    title: 'Location-based Services',
    description: 'Find the nearest service providers based on your current location.',
    icon: <MapPin size={80} color={colors.primary} />
  },
  {
    id: '5',
    title: 'Quick Response',
    description: 'Get help within minutes with our quick response emergency services.',
    icon: <Zap size={80} color={colors.primary} />
  }
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { setHasCompletedOnboarding } = useAuthStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true
      });
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    handleGetStarted();
  };

  const handleGetStarted = () => {
    setHasCompletedOnboarding(true);
    router.replace('/auth/login');
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleViewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  };

  const renderItem = ({ item }: { item: typeof onboardingData[0] }) => {
    return (
      <View style={styles.slide}>
        <View style={styles.iconContainer}>
          {item.icon}
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    );
  };

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {onboardingData.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 16, 8],
            extrapolate: 'clamp'
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp'
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                { width: dotWidth, opacity }
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />

      {renderDots()}

      <View style={styles.footer}>
        <Button
          title={currentIndex === onboardingData.length - 1 ? "Get Started" : "Next"}
          onPress={handleNext}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
  },
  skipText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
  slide: {
    width,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.dark,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginHorizontal: 4,
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
  },
  button: {
    width: '100%',
  },
});