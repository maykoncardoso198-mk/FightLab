import { useEffect } from 'react';
import { View } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SystemUI from 'expo-system-ui';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { useFonts } from '../hooks/useFonts';
import { Colors } from '../constants';
import { AuthProvider, useAuth } from '../context/AuthContext';

ExpoSplashScreen.preventAutoHideAsync().catch(() => {});

// ─── Route protection ─────────────────────────────────────────────

const PROTECTED = ['(tabs)', '(admin)', 'dashboard', 'booking', 'trainer', 'chat', 'payment', 'confirmation'];
const AUTH_ONLY  = ['(auth)'];

function RouteGuard() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const seg = segments[0] as string | undefined;
    const isProtected = PROTECTED.some((s) => seg === s);
    const isAuthRoute  = AUTH_ONLY.some((s) => seg === s);

    if (!user && isProtected) {
      router.replace('/(auth)/login');
    } else if (user && isAuthRoute) {
      if (user.role === 'admin') router.replace('/(admin)');
      else if (user.role === 'trainer') router.replace('/dashboard');
      else router.replace('/(tabs)');
    }
  }, [user, loading, segments]);

  return null;
}

// ─── Root layout ──────────────────────────────────────────────────

export default function RootLayout() {
  const fontsLoaded = useFonts();

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(Colors.background).catch(() => {});
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      ExpoSplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: Colors.background }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors.background }}>
      <SafeAreaProvider>
        <AuthProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: Colors.background },
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="trainer/[id]" />
            <Stack.Screen
              name="booking/[id]"
              options={{ animation: 'slide_from_bottom' }}
            />
            <Stack.Screen
              name="payment"
              options={{ animation: 'slide_from_bottom' }}
            />
            <Stack.Screen
              name="confirmation"
              options={{ animation: 'fade', gestureEnabled: false }}
            />
            <Stack.Screen name="dashboard" />
            <Stack.Screen name="(admin)" />
            <Stack.Screen name="chat/[id]" />
          </Stack>
          <RouteGuard />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
