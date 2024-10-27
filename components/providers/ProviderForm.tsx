import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useProviderStore } from '~/app/store/providers';
import type { CreateProviderDTO } from '~/types';

interface ProviderFormProps {
  visible: boolean;
  onClose: () => void;
}

export function ProviderForm({ visible, onClose }: ProviderFormProps) {
  const [providerData, setProviderData] = useState({
    name: '',
    mobile: '',
    address: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const createProvider = useProviderStore((state) => state.createProvider);

  const handleSubmit = async () => {
    if (!providerData.name.trim()) {
      Alert.alert('Error', 'Provider name is required');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Creating provider:', providerData);
      await createProvider(providerData as CreateProviderDTO);

      setProviderData({ name: '', mobile: '', address: '' });
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to create provider. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitDisabled = !providerData.name.trim() || isLoading;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={onClose} />
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create Provider</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color="#2D3748" />
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={providerData.name}
                onChangeText={(text) => setProviderData({ ...providerData, name: text })}
                placeholder="Enter provider name"
                placeholderTextColor="#A0AEC0"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Contact Number</Text>
              <TextInput
                style={styles.input}
                value={providerData.mobile}
                onChangeText={(text) => {
                  // Remove all non-numeric characters
                  const cleaned = text.replace(/\D/g, '');
                  // Format the number as (XXX) XXX-XXXX
                  let formatted = cleaned;
                  if (cleaned.length > 0) {
                    const matches = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
                    formatted = !matches
                      ? cleaned
                      : !matches[2]
                        ? `(${matches[1]}`
                        : !matches[3]
                          ? `(${matches[1]}) ${matches[2]}`
                          : `(${matches[1]}) ${matches[2]}-${matches[3]}`;
                  }
                  // Only update if the input is empty or contains numbers
                  if (!text || cleaned) {
                    setProviderData({ ...providerData, mobile: formatted });
                  }
                }}
                placeholder="Enter contact number"
                keyboardType="phone-pad"
                placeholderTextColor="#A0AEC0"
                maxLength={14} // (XXX) XXX-XXXX = 14 characters
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={[styles.input, styles.addressInput]}
                value={providerData.address}
                onChangeText={(text) => setProviderData({ ...providerData, address: text })}
                placeholder="Enter address"
                multiline
                numberOfLines={3}
                placeholderTextColor="#A0AEC0"
              />
            </View>

            <TouchableOpacity
              style={[styles.submitButton, isSubmitDisabled && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitDisabled}>
              <Text style={styles.submitButtonText}>
                {isLoading ? 'Creating...' : 'Create Provider'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D3748',
  },
  closeButton: {
    padding: 4,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3748',
  },
  input: {
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#2D3748',
  },
  addressInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#4299E1',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#4299E1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  submitButtonDisabled: {
    backgroundColor: '#CBD5E0',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
