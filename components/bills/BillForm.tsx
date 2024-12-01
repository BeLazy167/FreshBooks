import { Feather } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { ItemInput } from '../vegetable/ItemInput';
import { ModernDropdown } from '../providers/MordernDropdown';

import { useProviderStore } from '~/app/store/providers';
import { useSignerStore } from '~/app/store/signers';
import type { CreateBillDTO, VegetableItem } from '~/types';
import { formatCurrency } from '~/utils';

interface BillFormProps {
  onSubmit: (bill: CreateBillDTO) => void;
}

interface ItemsListProps {
  items: Omit<VegetableItem, 'id'>[];
  onRemoveItem: (index: number) => void;
  total: number;
}

const ItemsList = ({ items, onRemoveItem, total }: ItemsListProps) => {
  return (
    <View style={[styles.itemsCard, { gap: 8 }]}>
      {items.map((item, index) => {
        const price = Number(item.price || 0);
        const quantity = Number(item.quantity || 0);
        const itemTotal = price * quantity;

        return (
          <View
            key={index}
            style={[styles.itemRow, index === items.length - 1 && { borderBottomWidth: 0 }]}>
            <View style={styles.flex}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDetails}>
                {quantity} × {formatCurrency(price.toFixed(2))}
              </Text>
            </View>
            <View style={styles.itemActions}>
              <Text style={styles.itemTotal}>{formatCurrency(itemTotal.toFixed(2))}</Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => onRemoveItem(index)}
                activeOpacity={0.7}>
                <Feather name="x" size={18} color="#E53E3E" />
              </TouchableOpacity>
            </View>
          </View>
        );
      })}

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total Amount</Text>
        <Text style={styles.totalAmount}>{formatCurrency(total.toFixed(2))}</Text>
      </View>
    </View>
  );
};

export function BillForm({ onSubmit }: BillFormProps) {
  const { providers, fetchProviders } = useProviderStore();
  const { signers, fetchSigners } = useSignerStore();
  const [providerData, setProviderData] = useState({ id: '', name: '' });
  const [signer, setSigner] = useState({ id: '', name: '' });
  const [items, setItems] = useState<Omit<VegetableItem, 'id'>[]>([]);
  const [currentItem, setCurrentItem] = useState({
    name: '',
    quantity: 0,
    price: 0,
  });

  useEffect(() => {
    if (providers.length === 0) {
      fetchProviders();
    }
    if (signers.length === 0) {
      fetchSigners();
    }
  }, [providers.length, signers.length, fetchProviders, fetchSigners]);

  const addItem = useCallback(() => {
    if (currentItem.name && currentItem.quantity && currentItem.price) {
      try {
        // Ensure we have valid numbers
        const price = Number(currentItem.price) || 0;
        const quantity = Number(currentItem.quantity) || 0;

        // Format the price to 2 decimal places
        const formattedPrice = Number(price.toFixed(2));
        const itemTotal = Number((quantity * formattedPrice).toFixed(2));

        setItems((prevItems) => [
          ...prevItems,
          {
            name: currentItem.name,
            quantity: quantity,
            price: formattedPrice,
            item_total: itemTotal,
          },
        ]);

        // Reset current item
        setCurrentItem({ name: '', quantity: 0, price: 0 });
      } catch (error) {
        console.error('Error adding item:', error);
      }
    }
  }, [currentItem]);

  const removeItem = useCallback((index: number) => {
    setItems((prevItems: Omit<VegetableItem, 'id'>[]) => prevItems.filter((_, i) => i !== index));
  }, []);

  const total = useMemo(() => {
    try {
      return Number(
        items
          .reduce((sum, item) => {
            const itemTotal = Number(item.quantity || 0) * Number(item.price || 0);
            return sum + itemTotal;
          }, 0)
          .toFixed(2)
      );
    } catch (error) {
      console.error('Error calculating total:', error);
      return 0;
    }
  }, [items]);

  const handleSubmit = useCallback(() => {
    if (providerData.id && items.length > 0) {
      onSubmit({
        items: items.map((item: Omit<VegetableItem, 'id'>, index: number) => ({
          ...item,
          id: index.toString(),
        })),
        total,
        providerId: providerData.id,
        providerName: providerData.name,
        date: new Date(),
        signer: signer.name,
      });
      setProviderData({ id: '', name: '' });
      setItems([]);
      setSigner({ id: '', name: '' });
    }
  }, [items, providerData, total, onSubmit, signer]);

  const isSubmitDisabled = !providerData.id || items.length === 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          paddingBottom: 32,
          paddingTop: Platform.OS === 'android' ? 8 : 0,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag">
        <Text style={styles.title}>Create Bill</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add Item</Text>
          <ItemInput currentItem={currentItem} onItemChange={setCurrentItem} onAddItem={addItem} />
        </View>

        {items.length > 0 && <ItemsList items={items} onRemoveItem={removeItem} total={total} />}

        <View style={styles.bottomSection}>
          <View style={styles.row}>
            <View style={styles.dropdownContainer}>
              <Text style={styles.sectionTitle}>Provider</Text>
              <ModernDropdown
                data={providers.map((p) => ({ label: p.name, value: p.id }))}
                value={providerData.id}
                onSelect={(selected) =>
                  setProviderData({
                    id: selected.value.toString(),
                    name: selected.label,
                  })
                }
                placeholder="Select a provider"
                containerStyle={styles.dropdown}
              />
            </View>
            <View style={styles.dropdownContainer}>
              <Text style={styles.sectionTitle}>Signer</Text>
              <ModernDropdown
                data={signers.map((s) => ({ label: s.name, value: s.id }))}
                value={signer.id}
                onSelect={(selected) =>
                  setSigner({
                    id: selected.value.toString(),
                    name: selected.label,
                  })
                }
                placeholder="Select a signer"
                containerStyle={styles.dropdown}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, isSubmitDisabled && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitDisabled}>
            <Text style={styles.submitButtonText}>Create Bill</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F8FAFC',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 24,
  },
  section: {
    marginBottom: 16,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  itemsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
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
    marginBottom: 4,
  },
  itemDetails: {
    fontSize: 14,
    color: '#718096',
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
    backgroundColor: '#FEB2B2',
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
    letterSpacing: 0.5,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4299E1',
  },
  bottomSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  dropdownContainer: {
    flex: 1,
  },
  dropdown: {
    height: 40,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  submitButton: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#CBD5E0',
    elevation: 0,
    shadowOpacity: 0,
  },
  submitButtonText: {
    color: '#64748B',
    fontSize: 15,
    fontWeight: '500',
  },
});
