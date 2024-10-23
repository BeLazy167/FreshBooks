// app/_layout.tsx
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: 'Kesar Grocery',
        headerStyle: { backgroundColor: '#fff' },
        headerShadowVisible: false,
        headerTintColor: '#000',
        headerTitleStyle: {
          fontWeight: '700',
        },
        headerTitleAlign: 'left',
      }}
    />
  );
}
