import React, { useState, useEffect, useCallback, memo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Modal,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  type LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Container } from '~/components/Container';
import { BillDetail } from '~/components/bills/BillDetail';
import { useBillStore, type BillStore } from '~/app/store/bills';
import type { Bill } from '~/types';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface BillFromIdProps {
  id: string;
  onClose: () => void;
  visible: boolean;
}

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

interface LoadingStateProps {
  size?: number;
  color?: string;
}

const ErrorState = memo(({ message, onRetry }: ErrorStateProps) => (
  <View style={styles.errorContainer}>
    <Feather name="alert-circle" size={24} color={styles.error.color} />
    <Text style={styles.errorText}>{message}</Text>
    <TouchableOpacity
      style={styles.retryButton}
      onPress={onRetry}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
      <Text style={styles.retryText}>Try Again</Text>
    </TouchableOpacity>
  </View>
));

const LoadingState = memo(({ size = 24, color = '#007AFF' }: LoadingStateProps) => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size={size} color={color} />
  </View>
));

const CloseButton = memo(({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity
    style={styles.closeButton}
    onPress={onPress}
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
    <Feather name="x" size={24} color="#4A5568" />
  </TouchableOpacity>
));

ErrorState.displayName = 'ErrorState';
LoadingState.displayName = 'LoadingState';
CloseButton.displayName = 'CloseButton';

export const BillFromId = memo(({ id, onClose, visible }: BillFromIdProps) => {
  const [state, setState] = useState<{
    loading: boolean;
    error: string | null;
    billData: Bill | null;
  }>({
    loading: true,
    error: null,
    billData: null,
  });

  const fetchBillById = useBillStore((state: BillStore) => state.getBillById);

  const loadBill = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const data = await fetchBillById(id);
      if (!data) {
        throw new Error('Bill not found');
      }

      setState((prev) => ({ ...prev, billData: data, loading: false }));
    } catch (err) {
      console.error('Error loading bill:', err);
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to load bill details',
        loading: false,
      }));
    }
  }, [id, fetchBillById]);

  useEffect(() => {
    if (visible) {
      loadBill();
    } else {
      // Reset state when modal closes
      setState({
        loading: true,
        error: null,
        billData: null,
      });
    }
  }, [visible, loadBill]);

  const renderContent = useCallback(() => {
    if (state.loading) {
      return <LoadingState />;
    }
    if (state.error) {
      return <ErrorState message={state.error} onRetry={loadBill} />;
    }
    if (state.billData) {
      return <BillDetail bill={state.billData} />;
    }
    return null;
  }, [state.loading, state.error, state.billData, loadBill]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <CloseButton onPress={onClose} />
          <Container>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.container}
              contentContainerStyle={styles.contentContainer}
              bounces={false}>
              {renderContent()}
            </ScrollView>
          </Container>
        </View>
      </View>
    </Modal>
  );
});

BillFromId.displayName = 'BillFromId';

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
    height: '90%',
    paddingTop: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: -3,
        },
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
    padding: 4,
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
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
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
  error: {
    color: '#F56565',
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
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  retryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
