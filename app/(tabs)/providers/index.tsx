// app/(tabs)/providers/index.tsx
import { Stack } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import { ScrollView, View, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';

import { useProviderStore } from '~/app/store/providers';
import { Container } from '~/components/Container';
import { EmptyState } from '~/components/providers/EmptyState';
import { ProviderCard } from '~/components/providers/ProviderCard';
import { ProviderDetails } from '~/components/providers/ProviderDetails';
import { ProviderForm } from '~/components/providers/ProviderForm';
import { ProviderHeader } from '~/components/providers/ProviderHeader';
import type { Provider } from '~/types';

export default function ProvidersScreen() {
  // State
  const { providers, loading, error, fetchProviders } = useProviderStore();
  const [showProviderForm, setShowProviderForm] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Initial fetch
  useEffect(() => {
    fetchProviders().catch(console.error);
  }, []);

  // Handlers
  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await fetchProviders();
    } catch (err) {
      console.error('Error refreshing providers:', err);
    } finally {
      setRefreshing(false);
    }
  }, [fetchProviders]);

  const handleAddProvider = useCallback(() => {
    setShowProviderForm(true);
  }, []);

  const handleProviderPress = useCallback((provider: Provider) => {
    setSelectedProvider(provider.id);
  }, []);

  const handleCloseForm = useCallback(() => {
    setShowProviderForm(false);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setSelectedProvider(null);
  }, []);

  // Loading state
  if (loading && !refreshing) {
    return (
      <Container>
        <Stack.Screen options={{ title: 'Providers' }} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </Container>
    );
  }

  // Error state
  if (error && !refreshing) {
    return (
      <Container>
        <Stack.Screen />
        <View style={styles.centered}>
          <EmptyState onAddPress={handleAddProvider} error={error} onRetry={fetchProviders} />
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#007AFF']} />
        }>
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
          <EmptyState onAddPress={handleAddProvider} isLoading={loading} />
        )}
      </ScrollView>

      <ProviderForm
        visible={showProviderForm}
        onClose={handleCloseForm}
        onSuccess={() => {
          handleCloseForm();
          fetchProviders();
        }}
      />

      {selectedProvider && (
        <ProviderDetails
          visible
          id={selectedProvider}
          onClose={handleCloseDetails}
          onDelete={() => {
            handleCloseDetails();
            fetchProviders();
          }}
        />
      )}
    </Container>
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
