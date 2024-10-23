// app/(tabs)/providers/index.tsx
import { Stack } from 'expo-router';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Container } from '~/components/Container';
import { ProviderCard } from '~/components/providers/ProviderCard';
import { ProviderHeader } from '~/components/providers/ProviderHeader';
import { EmptyState } from '~/components/providers/EmptyState';
import type { Provider } from '~/types';

const mockProviders: Provider[] = [
  { id: '1', name: 'Fresh Farms', phone: '123-456-7890' },
  { id: '2', name: 'Green Gardens', phone: '098-765-4321' },
  { id: '3', name: 'Valley Veggies', phone: '555-123-4567' },
  { id: '4', name: 'Local Harvest', phone: '777-888-9999' },
];

export default function ProvidersScreen() {
  const handleAddProvider = () => {
    // Navigate to add provider screen
    console.log('Add provider');
  };

  const handleProviderPress = (provider: Provider) => {
    // Navigate to provider details
    console.log('Provider pressed:', provider.id);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Providers',
          headerStyle: { backgroundColor: '#fff' },
          headerShadowVisible: false,
        }}
      />
      <Container>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
          <ProviderHeader count={mockProviders.length} onAddPress={handleAddProvider} />

          {mockProviders.length > 0 ? (
            <View style={styles.list}>
              {mockProviders.map((provider) => (
                <ProviderCard
                  key={provider.id}
                  provider={provider}
                  onPress={() => handleProviderPress(provider)}
                />
              ))}
            </View>
          ) : (
            <EmptyState onAddPress={handleAddProvider} />
          )}
        </ScrollView>
      </Container>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  list: {
    gap: 12,
  },
});
