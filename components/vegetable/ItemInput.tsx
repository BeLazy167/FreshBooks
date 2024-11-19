import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useVegetableSuggestions } from '~/hooks/useVegetableSuggestions';
import { Vegetables } from '~/types';

interface ItemInputProps {
  currentItem: {
    name: string;
    quantity: number;
    price: number;
  };
  onItemChange: (item: { name: string; quantity: number; price: number }) => void;
  onAddItem: () => void;
}

export const ItemInput = ({ currentItem, onItemChange, onAddItem }: ItemInputProps) => {
  const [priceInput, setPriceInput] = useState('');
  const { suggestions, loadSuggestions, clearSuggestions } = useVegetableSuggestions();
  const isDisabled = !currentItem.name || !currentItem.quantity || !currentItem.price;
  const [isFocus, setIsFocus] = useState(false);

  const handlePriceChange = (text: string) => {
    const cleanedText = text.replace(/[^0-9.]/g, '');
    const parts = cleanedText.split('.');
    const formattedText = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : cleanedText;

    setPriceInput(formattedText);
    onItemChange({ ...currentItem, price: parseFloat(formattedText) || 0 });
  };

  const handleAddItem = () => {
    Keyboard.dismiss();
    onAddItem();
    setPriceInput('');
    clearSuggestions();
  };

  useEffect(() => {
    if (currentItem.price === 0) {
      setPriceInput('');
    }
  }, [currentItem.price]);

  const dropdownData = suggestions.map((item: Vegetables) => ({
    label: item.name,
    value: item.name,
  }));

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
        style={{ flex: 1 }}>
        <View style={styles.nameInputWrapper}>
          <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: '#4299E1' }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            data={dropdownData}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={`${currentItem.name || 'Item name'}`}
            searchPlaceholder="Type to search..."
            value={currentItem.name}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              onItemChange({ ...currentItem, name: item.value });
              setIsFocus(false);
            }}
            onChangeText={(text) => {
              loadSuggestions(text);
              if (text) {
                onItemChange({ ...currentItem, name: text });
              }
            }}
          />
        </View>

        <View style={styles.itemInputsRow}>
          <View style={[styles.inputContainer, styles.smallInputContainer]}>
            <Text style={styles.inputLabel}>Qty</Text>
            <TextInput
              style={[styles.input, styles.smallInput]}
              value={currentItem.quantity.toString()}
              onChangeText={(text) => onItemChange({ ...currentItem, quantity: Number(text) || 0 })}
              placeholder="Qty"
              keyboardType="numeric"
              placeholderTextColor="#A0AEC0"
            />
          </View>

          <View style={[styles.inputContainer, styles.smallInputContainer]}>
            <Text style={styles.inputLabel}>Price</Text>
            <TextInput
              style={[styles.input, styles.smallInput]}
              value={priceInput}
              onChangeText={handlePriceChange}
              placeholder="Price"
              keyboardType="decimal-pad"
              placeholderTextColor="#A0AEC0"
            />
          </View>

          <TouchableOpacity
            style={[styles.addButton, isDisabled && styles.addButtonDisabled]}
            onPress={handleAddItem}
            disabled={isDisabled}
            activeOpacity={0.7}>
            <Feather name="plus" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
    flex: 1,
  },
  nameInputWrapper: {
    marginBottom: 20,
  },
  dropdown: {
    height: 50,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  inputContainer: {
    backgroundColor: 'transparent',
    borderRadius: 16,
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
  inputLabel: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#2D3748',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  itemInputsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  smallInputContainer: {
    flex: 1,
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
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  addButtonDisabled: {
    backgroundColor: '#CBD5E0',
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#A0AEC0',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#2D3748',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

export default ItemInput;
