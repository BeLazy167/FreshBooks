import { Feather } from '@expo/vector-icons';
import React, { useState, useEffect, useCallback, memo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Modal,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Platform,
} from 'react-native';

import { useProviderStore } from '~/app/store/providers';
import { Container } from '~/components/Container';
import type { Provider } from '~/types';

type ProviderDetailsProps = {
  visible: boolean;
  id: string;
  onClose: () => void;
  onDelete?: () => void;
};

const LoadingState = memo(({ size = 24, color = '#007AFF' }: { size?: number; color?: string }) => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size={size} color={color} />
  </View>
));

const ErrorState = memo(({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <View style={styles.errorContainer}>
    <Feather name="alert-circle" size={24} color="#F56565" />
    <Text style={styles.errorText}>{message}</Text>
    <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
      <Text style={styles.retryText}>Try Again</Text>
    </TouchableOpacity>
  </View>
));

export function ProviderDetails({ id, onClose, visible }: ProviderDetailsProps) {
  const [state, setState] = useState<{
    loading: boolean;
    error: string | null;
    provider: Provider | null;
  }>({
    loading: true,
    error: null,
    provider: null,
  });

  const getProviderById = useProviderStore((state) => state.getProviderById);

  const loadProvider = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const data = await getProviderById(id);

      if (!data) {
        throw new Error('Provider not found');
      }

      setState((prev) => ({ ...prev, provider: data, loading: false }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to load provider details',
        loading: false,
      }));
    }
  }, [id, getProviderById]);

  useEffect(() => {
    if (visible) {
      loadProvider();
    } else {
      setState({
        loading: true,
        error: null,
        provider: null,
      });
    }
  }, [visible, loadProvider]);

  const renderContent = () => {
    if (state.loading) {
      return <LoadingState />;
    }
    if (state.error) {
      return <ErrorState message={state.error} onRetry={loadProvider} />;
    }
    if (state.provider) {
      return (
        <View style={styles.detailsContainer}>
          <View style={styles.iconContainer}>
            <Feather name="shopping-bag" size={24} color="#4299E1" />
          </View>
          <Text style={styles.providerName}>{state.provider.name}</Text>

          {state.provider.mobile && (
            <View style={styles.infoRow}>
              <Feather name="phone" size={20} color="#718096" />
              <Text style={styles.infoText}>{state.provider.mobile}</Text>
            </View>
          )}

          {state.provider.address && (
            <View style={styles.infoRow}>
              <Feather name="map-pin" size={20} color="#718096" />
              <Text style={styles.infoText}>{state.provider.address}</Text>
            </View>
          )}
          <Text style={styles.idText}>Id: {state.provider.id}</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Feather name="x" size={24} color="#4A5568" />
          </TouchableOpacity>
          <Container>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.container}
              contentContainerStyle={styles.contentContainer}>
              {renderContent()}
            </ScrollView>
          </Container>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '70%',
    paddingTop: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    flexGrow: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  detailsContainer: {
    alignItems: 'center',
    alignContent: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EBF8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  providerName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 12,
    paddingVertical: 8,
    width: '100%',
  },
  infoText: {
    fontSize: 16,
    color: '#4A5568',
    flex: 1,
  },
  idText: {
    fontSize: 12,
    color: '#718096',
    marginTop: 20,
    alignSelf: 'flex-start',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
    padding: 20,
  },
  errorText: {
    color: '#F56565',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
