import { Feather } from '@expo/vector-icons';
import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  FlatList,
  Pressable,
} from 'react-native';
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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchText, setSearchText] = useState('');
  const { suggestions, loadSuggestions, clearSuggestions } = useVegetableSuggestions();
  const isDisabled = !currentItem.name || !currentItem.quantity || !currentItem.price;

  const handlePriceChange = useCallback(
    (text: string) => {
      const cleanedText = text.replace(/[^0-9.]/g, '');
      const parts = cleanedText.split('.');
      const formattedText =
        parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : cleanedText;

      setPriceInput(formattedText);
      onItemChange({ ...currentItem, price: parseFloat(formattedText) || 0 });
    },
    [currentItem, onItemChange]
  );

  const handleAddItem = useCallback(() => {
    onAddItem();
    setPriceInput('');
    setSearchText('');
    clearSuggestions();
  }, [onAddItem, clearSuggestions]);

  const handleSelectSuggestion = useCallback(
    (name: string) => {
      onItemChange({ ...currentItem, name });
      setShowSuggestions(false);
      setSearchText(name);
    },
    [currentItem, onItemChange]
  );

  const handleSearchInput = useCallback(
    (text: string) => {
      setSearchText(text);
      loadSuggestions(text);
      setShowSuggestions(true);
      if (text) {
        onItemChange({ ...currentItem, name: text });
      }
    },
    [currentItem, loadSuggestions, onItemChange]
  );

  useEffect(() => {
    if (currentItem.price === 0) {
      setPriceInput('');
    }
  }, [currentItem.price]);

  const renderSuggestion = useCallback(
    ({ item }: { item: Vegetables }) => (
      <Pressable style={styles.suggestionItem} onPress={() => handleSelectSuggestion(item.name)}>
        <Text style={styles.suggestionText}>{item.name}</Text>
      </Pressable>
    ),
    [handleSelectSuggestion]
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.content}>
        <View style={styles.nameInputWrapper}>
          <Text style={styles.inputLabel}>Item Name</Text>
          <TextInput
            style={styles.input}
            value={searchText}
            onChangeText={handleSearchInput}
            placeholder="Search items..."
            placeholderTextColor="#A0AEC0"
          />
          {showSuggestions && suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <View style={styles.suggestionsList}>
                {suggestions.map((item) => (
                  <Pressable
                    key={item.name}
                    style={styles.suggestionItem}
                    onPress={() => handleSelectSuggestion(item.name)}>
                    <Text style={styles.suggestionText}>{item.name}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}
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
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  nameInputWrapper: {
    marginBottom: 20,
    zIndex: 1000, // Ensure dropdown shows above other elements
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 12,
    maxHeight: 200,
    zIndex: 1000,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  suggestionsList: {
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    backgroundColor: 'white',
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  suggestionText: {
    fontSize: 16,
    color: '#2D3748',
  },
  inputContainer: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    borderColor: '#E8E8E8',
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
});

export default ItemInput;
