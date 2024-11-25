import { Feather } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
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
    <View style={styles.itemsCard}>
      {items.map((item, index) => {
        const price = Number(item.price || 0);
        const quantity = Number(item.quantity || 0);
        const itemTotal = price * quantity;

        return (
          <View key={index} style={styles.itemRow}>
            <View style={styles.flex}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDetails}>
                {quantity} × {formatCurrency(price.toFixed(2))}
              </Text>
            </View>
            <View style={styles.itemActions}>
              <Text style={styles.itemTotal}>{formatCurrency(itemTotal.toFixed(2))}</Text>
              <TouchableOpacity style={styles.removeButton} onPress={() => onRemoveItem(index)}>
                <Feather name="x" size={16} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        );
      })}

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalAmount}>{formatCurrency(total.toFixed(2))}</Text>
      </View>
    </View>
  );
};

export function BillForm({ onSubmit }: BillFormProps) {
  const { providers, fetchProviders } = useProviderStore();
  const { signers, fetchSigners } = useSignerStore();
  const [providerData, setProviderData] = useState({ id: '', name: '' });
  const [signerData, setSignerData] = useState({ id: '', name: '' });
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
        signer: signerData.name,
      });
      setProviderData({ id: '', name: '' });
      setSignerData({ id: '', name: '' });
      setItems([]);
    }
  }, [items, providerData, total, onSubmit, signerData]);

  const isSubmitDisabled = !providerData.id || items.length === 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 80}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Create Bill</Text>

        <View style={styles.row}>
          <View style={styles.column}>
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
              placeholder="Select provider"
            />
          </View>

          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Signer</Text>
            <ModernDropdown
              data={signers.map((s) => ({ label: s.name, value: s.id }))}
              value={signerData.id}
              onSelect={(selected) =>
                setSignerData({
                  id: selected.value.toString(),
                  name: selected.label,
                })
              }
              placeholder="Select signer"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add Item</Text>
          <ItemInput currentItem={currentItem} onItemChange={setCurrentItem} onAddItem={addItem} />
        </View>

        {items.length > 0 && <ItemsList items={items} onRemoveItem={removeItem} total={total} />}

        <TouchableOpacity
          style={[styles.submitButton, isSubmitDisabled && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitDisabled}>
          <Text style={styles.submitButtonText}>Create Bill</Text>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === 'android' ? 120 : 20,
  },
  bottomPadding: {
    height: Platform.OS === 'android' ? 100 : 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 20,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 6,
  },
  itemsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    elevation: 2,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
  },
  flex: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2D3748',
  },
  itemDetails: {
    fontSize: 12,
    color: '#718096',
    marginTop: 2,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
  },
  removeButton: {
    backgroundColor: '#FC8181',
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EDF2F7',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
  },
  submitButton: {
    backgroundColor: '#4299E1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginVertical: 16,
    elevation: 2,
  },
  submitButtonDisabled: {
    backgroundColor: '#CBD5E0',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  column: {
    flex: 1,
  },
});
