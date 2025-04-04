import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform } from "react-native";
import { ErrorBoundary } from "./error-boundary";
import { useAuthStore } from "@/store/auth-store";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <RootLayoutNav />
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  const { isAuthenticated, hasCompletedOnboarding } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  
  useEffect(() => {
    // Check if the user is authenticated
    const inAuthGroup = segments[0] === 'auth';
    const inOnboardingGroup = segments[0] === 'onboarding';
    
    if (!isAuthenticated && !inAuthGroup && !inOnboardingGroup) {
      // Redirect to the onboarding page if not authenticated and not already on auth/onboarding
      if (!hasCompletedOnboarding) {
        router.replace('/onboarding');
      } else {
        router.replace('/auth/login');
      }
    } else if (isAuthenticated && (inAuthGroup || inOnboardingGroup)) {
      // Redirect to the home page if authenticated and trying to access auth/onboarding pages
      router.replace('/');
    }
  }, [isAuthenticated, hasCompletedOnboarding, segments]);
  
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="notifications" options={{ headerShown: false }} />
      <Stack.Screen name="vehicles/add" options={{ headerShown: false }} />
      <Stack.Screen name="vehicles/edit/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="services/fuel" options={{ headerShown: false }} />
      <Stack.Screen name="services/battery" options={{ headerShown: false }} />
      <Stack.Screen name="services/tire" options={{ headerShown: false }} />
      <Stack.Screen name="services/tow" options={{ headerShown: false }} />
      <Stack.Screen name="services/lockout" options={{ headerShown: false }} />
      <Stack.Screen name="services/dashcam" options={{ headerShown: false }} />
      <Stack.Screen name="services/multimedia" options={{ headerShown: false }} />
      <Stack.Screen name="services/fitment" options={{ headerShown: false }} />
      <Stack.Screen name="services/inspection" options={{ headerShown: false }} />
      <Stack.Screen name="services/bike_service" options={{ headerShown: false }} />
      <Stack.Screen name="services/tracking" options={{ headerShown: false }} />
      <Stack.Screen name="services/details/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="services/category/[category]" options={{ headerShown: false }} />
      <Stack.Screen name="profile/edit" options={{ headerShown: false }} />
      <Stack.Screen name="profile/personal-info" options={{ headerShown: false }} />
      <Stack.Screen name="profile/payment-methods" options={{ headerShown: false }} />
      <Stack.Screen name="profile/reviews" options={{ headerShown: false }} />
      <Stack.Screen name="profile/settings" options={{ headerShown: false }} />
      <Stack.Screen name="profile/support" options={{ headerShown: false }} />
      <Stack.Screen name="profile/privacy" options={{ headerShown: false }} />
      <Stack.Screen name="support/chat" options={{ headerShown: false }} />
    </Stack>
  );
}