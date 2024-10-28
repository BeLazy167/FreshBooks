// This file is intentionally left empty
import { Redirect } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Index() {
  return (
    <SafeAreaProvider>
      <Redirect href="/(tabs)/bills" />
    </SafeAreaProvider>
  );
}
