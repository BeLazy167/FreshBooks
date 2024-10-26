import { Feather } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { useProviderStore } from '~/app/store/providers';
import type { CreateBillDTO, VegetableItem } from '~/types';
import { formatCurrency } from '~/utils';
import { SearchableDropdown } from '../providers/SearchableDropdown';

interface BillFormProps {
  onSubmit: (bill: CreateBillDTO) => void;
}

// Separate the item input form into its own component for better organization
interface ItemInputProps {
  currentItem: {
    name: string;
    quantity: number;
    price: number;
  };
  onItemChange: (item: {
    name: string;
    quantity: number;
    price: number;
  }) => void;
  onAddItem: () => void;
}

const ItemInput = ({ currentItem, onItemChange, onAddItem }: ItemInputProps) => {
  const isDisabled = !currentItem.name || !currentItem.quantity || !currentItem.price;

  return (
    <>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Item Name</Text>
        <TextInput
          style={[styles.input, styles.itemNameInput]}
          value={currentItem.name}
          onChangeText={(text) => onItemChange({ ...currentItem, name: text })}
          placeholder="Item name"
          placeholderTextColor="#A0AEC0"
        />
      </View>

      <View style={styles.itemInputsRow}>
        <View style={[styles.inputContainer, styles.smallInputContainer]}>
          <Text style={styles.inputLabel}>Qty</Text>

          <TextInput
            style={[styles.input, styles.smallInput]}
            value={currentItem.quantity.toString()}
            onChangeText={(text) => 
              onItemChange({ ...currentItem, quantity: Number(text) || 0 })
            }
            placeholder="Qty"
            keyboardType="numeric"
            placeholderTextColor="#A0AEC0"
          />
        </View>

        <View style={[styles.inputContainer, styles.smallInputContainer]}>
          <Text style={styles.inputLabel}>Price</Text>

          <TextInput
            style={[styles.input, styles.smallInput]}
            value={currentItem.price.toString()}
            onChangeText={(text) => 
              onItemChange({ ...currentItem, price: Number(text) || 0 })
            }
            placeholder="Price"
            keyboardType="numeric"
            placeholderTextColor="#A0AEC0"
          />
        </View>

        <TouchableOpacity
          style={[styles.addButton, isDisabled && styles.addButtonDisabled]}
          onPress={onAddItem}
          disabled={isDisabled}>
          <Feather name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </>
  );
};

// Separate the items list into its own component
interface ItemsListProps {
  items: Omit<VegetableItem, 'id'>[];
  onRemoveItem: (index: number) => void;
  total: number;
}

const ItemsList = ({ items, onRemoveItem, total }: ItemsListProps) => {
  return (
    <View style={styles.itemsCard}>
      {items.map((item, index) => (
        <View key={index} style={styles.itemRow}>
          <View style={styles.flex}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDetails}>
              {item.quantity} × {formatCurrency(item.price.toString())}
            </Text>
          </View>
          <View style={styles.itemActions}>
            <Text style={styles.itemTotal}>
              {formatCurrency((item.quantity * item.price).toString())}
            </Text>
            <TouchableOpacity 
              style={styles.removeButton} 
              onPress={() => onRemoveItem(index)}
            >
              <Feather name="x" size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalAmount}>{formatCurrency(total.toString())}</Text>
      </View>
    </View>
  );
};

export function BillForm({ onSubmit }: BillFormProps) {
  const { providers, fetchProviders } = useProviderStore();
  const [providerData, setProviderData] = useState({ id: '', name: '' });
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
  }, [providers.length, fetchProviders]);

  const addItem = useCallback(() => {
    if (currentItem.name && currentItem.quantity && currentItem.price) {
      setItems((prevItems) => [
        ...prevItems,
        {
          ...currentItem,
          item_total: Number(currentItem.quantity * currentItem.price),
        },
      ]);
      setCurrentItem({ name: '', quantity: 0, price: 0 });
    }
  }, [currentItem]);

  const removeItem = useCallback((index: number) => {
    setItems((prevItems: Omit<VegetableItem, 'id'>[]) => prevItems.filter((_, i) => i !== index));
  }, []);

  const total = useMemo(() => {
    return items.reduce((sum: number, item: Omit<VegetableItem, 'id'>) => sum + item.quantity * item.price, 0);
  }, [items]);

  const handleSubmit = useCallback(() => {
    if (providerData.id && items.length > 0) {
      onSubmit({
        items: items.map((item: Omit<VegetableItem, 'id'>, index: number) => ({ ...item, id: index.toString() })),
        total,
        providerId: providerData.id,
        providerName: providerData.name,
        signer: 'DK',
        date: new Date(),
      });
      setProviderData({ id: '', name: '' });
      setItems([]);
    }
  }, [items, providerData, total, onSubmit]);

  const isSubmitDisabled = !providerData.id || items.length === 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Create Bill</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Provider Name</Text>
        <SearchableDropdown
          data={providers}
          value={providerData.name}
          onSelect={(selectedData) => setProviderData(selectedData)}
          placeholder="Select a provider"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add Item</Text>
        <ItemInput
          currentItem={currentItem}
          onItemChange={setCurrentItem}
          onAddItem={addItem}
        />
      </View>

      {items.length > 0 && (
        <ItemsList
          items={items}
          onRemoveItem={removeItem}
          total={total}
        />
      )}

      <TouchableOpacity
        style={[styles.submitButton, isSubmitDisabled && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={isSubmitDisabled}>
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
    marginBottom: 20,
    marginTop: 12,
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
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  inputLabel: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'white',
    zIndex: 1000,
    position: 'absolute',
    top: -10,
    left: 0,
    right: 0,
    opacity: 0.3,
    
  },
  inputLabelFocus: {
    opacity: 0,
  },
  
  input: {
    padding: 16,
    fontSize: 16,
    color: '#2D3748',
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
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
