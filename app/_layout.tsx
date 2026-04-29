import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SystemUI from 'expo-system-ui';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { View } from 'react-native';
import { useFonts } from '../hooks/useFonts';
import { Colors } from '../constants';

ExpoSplashScreen.preventAutoHideAsync().catch(() => {});

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
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
