// app/_layout.tsx
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import * as Updates from 'expo-updates';

// Prevent auto-hiding splash screen
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Check for updates
        if (!__DEV__) {
          // Only check updates in production
          const update = await Updates.checkForUpdateAsync();
          if (update.isAvailable) {
            await Updates.fetchUpdateAsync();
            await Updates.reloadAsync();
          }
        }

        // Add any additional initialization here
        // await Font.loadAsync({...})
        // await Asset.loadAsync([...])
      } catch (error) {
        console.warn('Error during app initialization:', error);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!isReady) {
    return <View style={{ flex: 1, backgroundColor: '#fff' }} />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: 'Kesar Grocery',
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerShadowVisible: false,
        headerTintColor: '#000',
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
        headerTitleAlign: 'left',
        headerBackTitleVisible: false, // Hide back button text on iOS
        animation: 'slide_from_right', // Consistent animation
        contentStyle: {
          backgroundColor: '#fff', // Consistent background
        },
        // Add safe area handling
        // Add gesture handling
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}>
      <Stack.Screen
        name="index" // Your home screen
        options={{
          headerShown: false,
        }}
      />
      {/* Add other specific screen configurations if needed */}
    </Stack>
  );
}

// Add type safety for navigation
declare global {
  namespace ReactNavigation {
    interface RootParamList {
      index: undefined;
      // Add other screen params here
    }
  }
}
