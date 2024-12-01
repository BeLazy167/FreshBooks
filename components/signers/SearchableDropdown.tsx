import { Feather } from '@expo/vector-icons';
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
  StyleProp,
  ViewStyle,
} from 'react-native';

import { useSignerStore } from '~/app/store/signers';
import type { Signer } from '~/types';
interface SearchableDropdownProps {
  value?: string;
  onSelect: (item: { name: string }) => void;
  placeholder?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export function SearchableDropdown({
  value,
  onSelect,
  placeholder = 'Select a signer',
  containerStyle,
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState<Signer[]>([]);
  const animation = useRef(new Animated.Value(0)).current;

  const { signers, fetchSigners, loading } = useSignerStore();

  useEffect(() => {
    if (signers.length === 0) {
      fetchSigners();
    }

    if (search) {
      const filtered = signers.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(signers);
    }
  }, [search, signers]);

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
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.dropdownButton, value ? styles.dropdownButtonActive : null, containerStyle]}
        onPress={openModal}>
        <Text style={[styles.dropdownButtonText, !value ? styles.placeholderText : null]}>
          {value || placeholder}
        </Text>
        <Feather name="chevron-down" size={18} color={value ? '#64748B' : '#94A3B8'} />
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
              <Text style={styles.modalTitle}>Select Signer</Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Feather name="x" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Feather name="search" size={16} color="#94A3B8" />
              <TextInput
                style={styles.searchInput}
                value={search}
                onChangeText={setSearch}
                placeholder="Search signers..."
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
                  {value === item.name && <Feather name="check" size={16} color="#3B82F6" />}
                </TouchableOpacity>
              )}
              style={styles.optionsList}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No signers found</Text>
                </View>
              }
              keyboardShouldPersistTaps="always"
              keyboardDismissMode="on-drag"
            />
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    height: 40,
  },
  dropdownButtonActive: {
    borderColor: '#E2E8F0',
  },
  dropdownButtonText: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '400',
  },
  placeholderText: {
    color: '#94A3B8',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
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
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 16,
    maxHeight: SCREEN_HEIGHT * 0.7,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    marginHorizontal: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
    paddingLeft: 8,
  },
  optionsList: {
    paddingHorizontal: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  selectedOption: {
    backgroundColor: '#F8FAFC',
  },
  optionText: {
    fontSize: 14,
    color: '#1E293B',
  },
  selectedOptionText: {
    color: '#3B82F6',
    fontWeight: '500',
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
