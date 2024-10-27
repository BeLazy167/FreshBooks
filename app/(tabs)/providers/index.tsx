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
import { useState } from 'react';
import { ProviderForm } from '~/components/providers/ProviderForm';
import { ProviderDetails } from '~/components/providers/ProviderDetails';

export default function ProvidersScreen() {
  const { providers, loading, error, fetchProviders } = useProviderStore();
  const [showProviderForm, setShowProviderForm] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleAddProvider = () => {
    // open modal to create provider
    setShowProviderForm(true);
  };

  const handleProviderPress = (provider: Provider) => {
    setSelectedProvider(provider.id);
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
          <ProviderForm visible={showProviderForm} onClose={() => setShowProviderForm(false)} />
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
          <ProviderDetails
            visible={!!selectedProvider}
            id={selectedProvider || ''}
            onClose={() => setSelectedProvider(null)}
          />
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
