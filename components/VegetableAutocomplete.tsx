import { Feather } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native';

import { useVegetableStore } from '~/app/store/vegetables';
import { useVegetableSuggestions } from '~/hooks/useVegetableSuggestions';
import type { Vegetables } from '~/types';

type VegetableAutocompleteProps = {
  value: Vegetables;
  onChange: (value: Vegetables) => void;
  onSubmit: () => void;
};

export function VegetableAutocomplete({ value, onChange, onSubmit }: VegetableAutocompleteProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { suggestions, loading, error, loadSuggestions, clearSuggestions, searchQuery } =
    useVegetableSuggestions();
  const createVegetable = useVegetableStore((state) => state.createVegetable);

  const handleNameChange = useCallback(
    async (text: string) => {
      onChange({ ...value, name: text });
      loadSuggestions(text);
      setShowSuggestions(true);
    },
    [value, onChange, loadSuggestions]
  );

  const handleSuggestionSelect = useCallback(
    (suggestion: Vegetables) => {
      onChange({
        ...value,
        name: suggestion.name,
      });
      setShowSuggestions(false);
      clearSuggestions();
    },
    [value, onChange, clearSuggestions]
  );

  const handleAddItem = useCallback(async () => {
    if (!value.name) return;

    // If the vegetable doesn't exist in suggestions, create it
    const vegetableExists = suggestions.some(
      (s) => s.name.toLowerCase() === value.name.toLowerCase()
    );

    if (!vegetableExists && searchQuery) {
      await createVegetable({
        name: value.name,
        isAvailable: true,
      });
    }

    onSubmit();
    clearSuggestions();
    setShowSuggestions(false);
  }, [value, suggestions, searchQuery, createVegetable, onSubmit, clearSuggestions]);

  const isDisabled = !value.name;

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, styles.itemNameInput]}
          value={value.name}
          onChangeText={handleNameChange}
          placeholder="Item name"
          placeholderTextColor="#A0AEC0"
        />
      </View>

      <View style={styles.itemInputsRow}>
        <View style={[styles.inputContainer, styles.smallInputContainer]}>
          <TextInput placeholder="Qty" keyboardType="numeric" placeholderTextColor="#A0AEC0" />
        </View>

        <View style={[styles.inputContainer, styles.smallInputContainer]}>
          <TextInput
            style={[styles.input, styles.smallInput]}
            placeholder="Price"
            keyboardType="numeric"
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

      {showSuggestions && (
        <View style={styles.suggestionsContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#4299E1" />
              <Text style={styles.loadingText}>Loading suggestions...</Text>
            </View>
          ) : (
            <>
              <FlatList
                data={suggestions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.suggestionItem}
                    onPress={() => handleSuggestionSelect(item)}>
                    <Text style={styles.suggestionText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
                style={styles.suggestionsList}
                keyboardShouldPersistTaps="always"
                keyboardDismissMode="on-drag"
                ListEmptyComponent={
                  searchQuery.length >= 2 ? (
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>
                        No matches found. This item will be added as new.
                      </Text>
                    </View>
                  ) : null
                }
              />
              {error && <Text style={styles.errorText}>{error.message}</Text>}
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
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
  emptyContainer: {
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
  },
  emptyText: {
    color: '#718096',
    fontSize: 14,
    textAlign: 'center',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    marginTop: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  suggestionsList: {
    maxHeight: 200,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  suggestionText: {
    fontSize: 16,
    color: '#2D3748',
  },
  suggestionPrice: {
    fontSize: 14,
    color: '#718096',
  },
  loadingContainer: {
    padding: 12,
    alignItems: 'center',
  },
  loadingText: {
    color: '#718096',
  },
  errorText: {
    color: '#E53E3E',
    fontSize: 14,
    marginTop: 4,
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
});
