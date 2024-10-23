// This file is intentionally left empty

// components/bills/BillForm.tsx
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';

import type { Bill, VegetableItem } from '~/types';
import { formatCurrency } from '~/utils';
interface BillFormProps {
  onSubmit: (bill: Omit<Bill, 'id' | 'date'>) => void;
}

export function BillForm({ onSubmit }: BillFormProps) {
  const [providerName, setProviderName] = useState('');
  const [items, setItems] = useState<Omit<VegetableItem, 'id'>[]>([]);
  const [currentItem, setCurrentItem] = useState({
    name: '',
    quantity: '',
    price: '',
    signer: 'DK',
  });

  const addItem = () => {
    if (currentItem.name && currentItem.quantity && currentItem.price) {
      setItems([
        ...items,
        {
          name: currentItem.name,
          quantity: Number(currentItem.quantity),
          price: Number(currentItem.price),
        },
      ]);
      setCurrentItem({ name: '', quantity: '', price: '', signer: 'DK' });
    }
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  };

  const handleSubmit = () => {
    if (providerName && items.length > 0) {
      onSubmit({
        providerName,
        items: items.map((item, index) => ({ ...item, id: index.toString() })),
        total: calculateTotal(),
        signer: currentItem.signer,
        providerId: '',
      });
      setProviderName('');
      setItems([]);
    }
  };
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Create Bill</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Provider Name</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={providerName}
            onChangeText={setProviderName}
            placeholder="Enter provider name"
            placeholderTextColor="#A0AEC0"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add Item</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, styles.itemNameInput]}
            value={currentItem.name}
            onChangeText={(text) => setCurrentItem((prev) => ({ ...prev, name: text }))}
            placeholder="Item name"
            placeholderTextColor="#A0AEC0"
          />
        </View>

        <View style={styles.itemInputsRow}>
          <View style={[styles.inputContainer, styles.smallInputContainer]}>
            <TextInput
              style={[styles.input, styles.smallInput]}
              value={currentItem.quantity}
              onChangeText={(text) => setCurrentItem((prev) => ({ ...prev, quantity: text }))}
              placeholder="Qty"
              keyboardType="numeric"
              placeholderTextColor="#A0AEC0"
            />
          </View>

          <View style={[styles.inputContainer, styles.smallInputContainer]}>
            <TextInput
              style={[styles.input, styles.smallInput]}
              value={currentItem.price}
              onChangeText={(text) => setCurrentItem((prev) => ({ ...prev, price: text }))}
              placeholder="Price"
              keyboardType="numeric"
              placeholderTextColor="#A0AEC0"
            />
          </View>

          <TouchableOpacity
            style={[
              styles.addButton,
              (!currentItem.name || !currentItem.quantity || !currentItem.price) &&
                styles.addButtonDisabled,
            ]}
            onPress={addItem}
            disabled={!currentItem.name || !currentItem.quantity || !currentItem.price}>
            <Feather name="plus" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {items.length > 0 && (
        <View style={styles.itemsCard}>
          {items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.flex}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDetails}>
                  {item.quantity} × {formatCurrency(item.price)}
                </Text>
              </View>
              <View style={styles.itemActions}>
                <Text style={styles.itemTotal}>{formatCurrency(item.quantity * item.price)}</Text>
                <TouchableOpacity style={styles.removeButton} onPress={() => removeItem(index)}>
                  <Feather name="x" size={16} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>{formatCurrency(calculateTotal())}</Text>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.submitButton,
          (!providerName || items.length === 0) && styles.submitButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={!providerName || items.length === 0}>
        <Text style={styles.submitButtonText}>Create Bill</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#F7FAFC',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 12,
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  input: {
    padding: 16,
    fontSize: 16,
    color: '#2D3748',
  },
  itemNameInput: {
    marginBottom: 12,
  },
  itemInputsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  smallInputContainer: {
    flex: 1,
    marginBottom: 0,
    marginTop: 12,
  },
  smallInput: {
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#4299E1',
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
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
  addButtonDisabled: {
    backgroundColor: '#CBD5E0',
  },
  itemsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
  },
  flex: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3748',
  },
  itemDetails: {
    fontSize: 14,
    color: '#718096',
    marginTop: 4,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
  },
  removeButton: {
    backgroundColor: '#FC8181',
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EDF2F7',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3748',
  },
  submitButton: {
    backgroundColor: '#4299E1',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginBottom: 32,
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
    fontSize: 18,
    fontWeight: '600',
  },
});
