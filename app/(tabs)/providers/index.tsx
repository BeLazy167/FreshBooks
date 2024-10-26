// app/(tabs)/providers/index.tsx
import { Stack } from 'expo-router';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Container } from '~/components/Container';
import { ProviderCard } from '~/components/providers/ProviderCard';
import { ProviderHeader } from '~/components/providers/ProviderHeader';
import { EmptyState } from '~/components/providers/EmptyState';
import type { Provider } from '~/types';
import { useProviderStore } from '~/app/store/providers';
import { useEffect } from 'react';
export default function ProvidersScreen() {
  const { providers, loading, error, fetchProviders } = useProviderStore();

  useEffect(() => {
    fetchProviders();
  }, []);

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
          <ProviderHeader count={providers.length} onAddPress={handleAddProvider} />

          {providers.length > 0 ? (
            <View style={styles.list}>
              {providers.map((provider) => (
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
