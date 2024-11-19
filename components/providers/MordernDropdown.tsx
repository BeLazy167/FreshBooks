import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  TextInput,
  Animated,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

interface DropdownProps {
  data: Array<{ label: string; value: string | number }>;
  value?: string | number;
  onSelect: (item: { label: string; value: string | number }) => void;
  placeholder?: string;
  searchable?: boolean;
  containerStyle?: object;
}

export const ModernDropdown = ({
  data,
  value,
  onSelect,
  placeholder = 'Select an option',
  searchable = true,
  containerStyle = {},
}: DropdownProps) => {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [animation] = useState(new Animated.Value(0));

  const selectedItem = data.find((item) => item.value === value);

  const filteredData = data.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = useCallback(
    (item: { label: string; value: string | number }) => {
      onSelect(item);
      setVisible(false);
      setSearch('');
    },
    [onSelect]
  );

  const toggleDropdown = useCallback(() => {
    if (visible) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setVisible(false));
    } else {
      setVisible(true);
      Animated.timing(animation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, animation]);

  return (
    <>
      <TouchableOpacity onPress={toggleDropdown} style={[styles.container, containerStyle]}>
        <Text style={[styles.selectedText, !selectedItem && styles.placeholderText]}>
          {selectedItem ? selectedItem.label : placeholder}
        </Text>
        <Feather name={visible ? 'chevron-up' : 'chevron-down'} size={20} color="#718096" />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="none" onRequestClose={toggleDropdown}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={toggleDropdown}>
          <Animated.View
            style={[
              styles.dropdown,
              {
                opacity: animation,
                transform: [
                  {
                    translateY: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              },
            ]}>
            {searchable && (
              <View style={styles.searchContainer}>
                <Feather name="search" size={16} color="#718096" />
                <TextInput
                  style={styles.searchInput}
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Search..."
                  placeholderTextColor="#A0AEC0"
                  autoCorrect={false}
                />
              </View>
            )}

            <FlatList
              data={filteredData}
              keyExtractor={(item) => item.value.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.item, item.value === value && styles.selectedItem]}
                  onPress={() => handleSelect(item)}>
                  <Text style={[styles.itemText, item.value === value && styles.selectedItemText]}>
                    {item.label}
                  </Text>
                  {item.value === value && <Feather name="check" size={16} color="#4299E1" />}
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
              bounces={false}
              style={styles.list}
            />
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  selectedText: {
    fontSize: 14,
    color: '#2D3748',
  },
  placeholderText: {
    color: '#A0AEC0',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    padding: 16,
  },
  dropdown: {
    backgroundColor: 'white',
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#2D3748',
  },
  list: {
    maxHeight: 300,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  selectedItem: {
    backgroundColor: '#EBF8FF',
  },
  itemText: {
    fontSize: 14,
    color: '#2D3748',
  },
  selectedItemText: {
    color: '#4299E1',
    fontWeight: '500',
  },
});
