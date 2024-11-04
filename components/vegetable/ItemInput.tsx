import { Feather } from '@expo/vector-icons';
import { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Modal,
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
  const { suggestions, loadSuggestions, clearSuggestions } = useVegetableSuggestions();
  const isDisabled = !currentItem.name || !currentItem.quantity || !currentItem.price;
  const inputRef = useRef<TextInput>(null);
  const [inputPosition, setInputPosition] = useState(0);

  useEffect(() => {
    if (showSuggestions && inputRef.current) {
      inputRef.current.measureInWindow((x, y, width, height) => {
        setInputPosition(y + height);
      });
    }
  }, [showSuggestions]);

  const availableSuggestions = suggestions.filter(
    (suggestion: Vegetables) => suggestion.isAvailable
  );

  const handlePriceChange = (text: string) => {
    const cleanedText = text.replace(/[^0-9.]/g, '');
    const parts = cleanedText.split('.');
    const formattedText = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : cleanedText;

    setPriceInput(formattedText);
    onItemChange({ ...currentItem, price: parseFloat(formattedText) || 0 });
  };

  const handleNameChange = (text: string) => {
    onItemChange({ ...currentItem, name: text });
    loadSuggestions(text);
    setShowSuggestions(true);
  };

  const handleSelectSuggestion = (name: string) => {
    onItemChange({
      ...currentItem,
      name,
    });
    setShowSuggestions(false);
    clearSuggestions();
    inputRef.current?.blur();
  };

  const handleAddItem = () => {
    onAddItem();
    setPriceInput('');
    clearSuggestions();
  };

  useEffect(() => {
    if (currentItem.price === 0) {
      setPriceInput('');
    }
  }, [currentItem.price]);

  const renderSuggestions = () => {
    if (Platform.OS === 'android') {
      return (
        <Modal
          visible={showSuggestions && availableSuggestions.length > 0}
          transparent
          animationType="fade"
          onRequestClose={() => setShowSuggestions(false)}>
          <Pressable style={styles.modalOverlay} onPress={() => setShowSuggestions(false)}>
            <View
              style={[
                styles.modalContent,
                {
                  position: 'absolute',
                  top: inputPosition,
                  left: 0,
                  right: 0,
                  maxHeight: 200,
                },
              ]}>
              <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                {availableSuggestions.map((suggestion: Vegetables) => (
                  <TouchableOpacity
                    key={suggestion.id}
                    style={styles.suggestionItem}
                    onPress={() => handleSelectSuggestion(suggestion.name)}>
                    <Text style={styles.suggestionText}>{suggestion.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </Pressable>
        </Modal>
      );
    }

    return showSuggestions && availableSuggestions.length > 0 ? (
      <View style={styles.suggestionsWrapper}>
        <ScrollView
          style={styles.suggestionsContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled>
          {availableSuggestions.map((suggestion: Vegetables) => (
            <TouchableOpacity
              key={suggestion.id}
              style={styles.suggestionItem}
              onPress={() => handleSelectSuggestion(suggestion.name)}>
              <Text style={styles.suggestionText}>{suggestion.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    ) : null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.nameInputWrapper}>
        <Text style={styles.inputLabel}>Item Name</Text>
        <TextInput
          ref={inputRef}
          style={[styles.input, styles.itemNameInput]}
          value={currentItem.name}
          onChangeText={handleNameChange}
          onBlur={() => {
            if (Platform.OS !== 'android') {
              setTimeout(() => setShowSuggestions(false), 200);
            }
          }}
          onFocus={() => currentItem.name && loadSuggestions(currentItem.name)}
          placeholder="Item name"
          placeholderTextColor="#A0AEC0"
        />
        {renderSuggestions()}
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
          disabled={isDisabled}>
          <Feather name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
  },
  nameInputWrapper: {
    position: 'relative',
    zIndex: 2,
    marginBottom: 20,
  },
  inputContainer: {
    backgroundColor: 'white',
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
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 16,
    elevation: 5,
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
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  itemNameInput: {
    marginBottom: 0,
  },
  itemInputsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    zIndex: 1,
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
  suggestionsWrapper: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    zIndex: 1000,
    marginTop: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  suggestionsContainer: {
    maxHeight: 200,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  suggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
  },
  suggestionText: {
    fontSize: 16,
    color: '#2D3748',
    fontWeight: '500',
  },
});

export default ItemInput;
