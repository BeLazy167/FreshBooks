// components/bills/BillSearch.tsx
import { View, TextInput, StyleSheet, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface BillSearchProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function BillSearch({ value, onChangeText }: BillSearchProps) {
  return (
    <View style={styles.searchBar}>
      <Feather name="search" size={20} color="#718096" />
      <TextInput
        style={styles.searchInput}
        placeholder="Search bills..."
        placeholderTextColor="#718096"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
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
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 12,
    fontSize: 16,
    color: '#2D3748',
  },
});
