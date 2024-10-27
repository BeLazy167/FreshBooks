/**
 * Custom SearchableDropdown component for React Native
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Dimensions,
  Animated,
  Keyboard,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

interface SearchableDropdownProps {
  data: Array<{ id: string; name: string }>;
  value: string;
  onSelect: (value: { id: string; name: string }) => void;
  placeholder?: string;
}

export function SearchableDropdown({
  data,
  value,
  onSelect,
  placeholder = 'Select a provider',
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (search) {
      const filtered = data.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [search, data]);

  const openModal = () => {
    setIsOpen(true);
    setSearch('');
    Animated.spring(animation, {
      toValue: 1,
      useNativeDriver: true,
      tension: 40,
      friction: 8,
    }).start();
  };

  const closeModal = () => {
    Keyboard.dismiss();
    Animated.timing(animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setIsOpen(false));
  };

  const handleSelect = (selectedData: { id: string; name: string }) => {
    onSelect(selectedData);
    closeModal();
  };

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  return (
    <>
      <TouchableOpacity
        style={[styles.dropdownButton, value ? styles.dropdownButtonActive : null]}
        onPress={openModal}>
        <Text style={[styles.dropdownButtonText, !value ? styles.placeholderText : null]}>
          {value || placeholder}
        </Text>
        <Feather name="chevron-down" size={20} color={value ? '#2D3748' : '#A0AEC0'} />
      </TouchableOpacity>

      <Modal visible={isOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={closeModal} />
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [{ translateY }],
              },
            ]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Provider</Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Feather name="x" size={24} color="#2D3748" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Feather name="search" size={20} color="#A0AEC0" />
              <TextInput
                style={styles.searchInput}
                value={search}
                onChangeText={setSearch}
                placeholder="Search providers..."
                placeholderTextColor="#A0AEC0"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <FlatList
              data={filteredData}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.optionItem, value === item.name && styles.selectedOption]}
                  onPress={() => handleSelect({ id: item.id, name: item.name })}>
                  <Text
                    style={[styles.optionText, value === item.name && styles.selectedOptionText]}>
                    {item.name}
                  </Text>
                  {value === item.name && <Feather name="check" size={20} color="#4299E1" />}
                </TouchableOpacity>
              )}
              style={styles.optionsList}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No providers found</Text>
                </View>
              }
            />
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const styles = StyleSheet.create({
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    padding: 16,
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
  dropdownButtonActive: {
    borderColor: '#4299E1',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#2D3748',
  },
  placeholderText: {
    color: '#A0AEC0',
  },
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
    maxHeight: SCREEN_HEIGHT * 0.7,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D3748',
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2D3748',
    paddingVertical: 12,
    paddingLeft: 12,
  },
  optionsList: {
    paddingHorizontal: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
  },
  selectedOption: {
    backgroundColor: '#EBF8FF',
  },
  optionText: {
    fontSize: 16,
    color: '#2D3748',
  },
  selectedOptionText: {
    fontWeight: '500',
    color: '#4299E1',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#A0AEC0',
  },
});
