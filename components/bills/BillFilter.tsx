// components/bills/BillsFilter.tsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type SortOption = 'date' | 'amount';

interface BillFilterProps {
  sortBy: SortOption;
  onSortChange: (option: SortOption) => void;
}

export function BillFilter({ sortBy, onSortChange }: BillFilterProps) {
  return (
    <View style={styles.filterContainer}>
      <TouchableOpacity
        style={[styles.filterButton, sortBy === 'date' && styles.filterButtonActive]}
        onPress={() => onSortChange('date')}>
        <Text style={[styles.filterButtonText, sortBy === 'date' && styles.filterButtonTextActive]}>
          Date
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.filterButton, sortBy === 'amount' && styles.filterButtonActive]}
        onPress={() => onSortChange('amount')}>
        <Text
          style={[styles.filterButtonText, sortBy === 'amount' && styles.filterButtonTextActive]}>
          Amount
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#EDF2F7',
  },
  filterButtonActive: {
    backgroundColor: '#4299E1',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#718096',
  },
  filterButtonTextActive: {
    color: 'white',
  },
});
