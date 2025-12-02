import { UserProvider } from '@/app/context/UserContext';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import 'react-native-reanimated';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

function RootLayoutNav() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="quiz/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="quiz/success" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
      <Stack.Screen name="game-over" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
      
      {/* NEW ROUTES */}
      <Stack.Screen name="review" options={{ headerShown: false }} />
      <Stack.Screen name="playground" options={{ headerShown: false }} />
      
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <UserProvider>
      <ThemeProvider value={DefaultTheme}>
        <RootLayoutNav />
        <StatusBar style="auto" />
      </ThemeProvider>
    </UserProvider>
  );
}