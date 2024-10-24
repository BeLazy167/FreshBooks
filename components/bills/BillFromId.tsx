// components/bills/BillFromId.tsx
import React, { useState, useEffect } from 'react';
import { 
  ScrollView, 
  StyleSheet, 
  Modal, 
  View, 
  TouchableOpacity, 
  Text,
  ActivityIndicator 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Container } from '~/components/Container';
import { BillDetail } from '~/components/bills/BillDetail';
import { useBillStore, BillStore } from '~/app/store/bills';
import type { Bill } from '~/types';

interface BillFromIdProps {
  id: string;
  onClose: () => void;
  visible: boolean;
}

export default function BillFromId({ id, onClose, visible }: BillFromIdProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [billData, setBillData] = useState<Bill | null>(null);
  const fetchBillById = useBillStore((state: BillStore) => state.getBillById);

  useEffect(() => {
    if (visible) {
      loadBill();
    }
  }, [id, visible]);

  const loadBill = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchBillById(id);
      if (data) {
        setBillData(data);
      } else {
        setError('Bill not found');
      }
    } catch (err) {
      setError('Failed to load bill details');
      console.error('Error loading bill:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="x" size={24} color="#4A5568" />
          </TouchableOpacity>

          <Container>
            <ScrollView 
              showsVerticalScrollIndicator={false} 
              style={styles.container}
              contentContainerStyle={styles.contentContainer}
            >
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#007AFF" />
                </View>
              ) : error ? (
                <View style={styles.errorContainer}>
                  <Feather name="alert-circle" size={24} color="#F56565" />
                  <Text style={styles.errorText}>{error}</Text>
                  <TouchableOpacity 
                    style={styles.retryButton}
                    onPress={loadBill}
                  >
                    <Text style={styles.retryText}>Try Again</Text>
                  </TouchableOpacity>
                </View>
              ) : billData ? (
                <BillDetail bill={billData} />
              ) : null}
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
    height: '90%',
    paddingTop: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  contentContainer: {
    padding: 16,
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
