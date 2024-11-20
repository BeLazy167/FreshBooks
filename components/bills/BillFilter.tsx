import { MaterialIcons } from '@expo/vector-icons';
import React, { useCallback, memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type FilterOption = 'date' | 'amount';
type SortDirection = 'asc' | 'desc';

interface SortState {
  option: FilterOption;
  direction: SortDirection;
}

interface BillFilterProps {
  sortState?: SortState;
  onSortChange: (newSort: SortState) => void;
}

const DEFAULT_SORT_STATE: SortState = {
  option: 'date',
  direction: 'desc',
};

interface FilterButtonProps {
  option: FilterOption;
  isActive: boolean;
  direction: SortDirection;
  onPress: (option: FilterOption) => void; // Changed to accept option parameter
  label: string;
}

const FilterButton = memo(({ option, isActive, direction, onPress, label }: FilterButtonProps) => {
  const iconName = isActive
    ? direction === 'asc'
      ? 'keyboard-arrow-up'
      : 'keyboard-arrow-down'
    : 'unfold-more';

  const iconColor = isActive ? 'white' : '#718096';

  // Changed to directly call onPress with option
  const handlePress = useCallback(() => {
    onPress(option);
  }, [onPress, option]);

  return (
    <TouchableOpacity
      style={[styles.filterButton, isActive && styles.filterButtonActive]}
      onPress={handlePress}
      activeOpacity={0.7}>
      <View style={styles.filterButtonContent}>
        <Text style={[styles.filterButtonText, isActive && styles.filterButtonTextActive]}>
          {label}
        </Text>
        <MaterialIcons name={iconName} size={18} color={iconColor} />
      </View>
    </TouchableOpacity>
  );
});

FilterButton.displayName = 'FilterButton';

export const BillFilter = memo(
  ({ sortState = DEFAULT_SORT_STATE, onSortChange }: BillFilterProps) => {
    const handleFilterPress = useCallback(
      (option: FilterOption) => {
        const newDirection: SortDirection =
          sortState.option === option ? (sortState.direction === 'asc' ? 'desc' : 'asc') : 'asc';

        const newState = {
          option,
          direction: newDirection,
        };

        onSortChange(newState);
      },
      [sortState, onSortChange]
    );

    return (
      <View style={styles.filterContainer}>
        <FilterButton
          option="date"
          isActive={sortState.option === 'date'}
          direction={sortState.direction}
          onPress={handleFilterPress} // Removed arrow function
          label="Date"
        />
        <FilterButton
          option="amount"
          isActive={sortState.option === 'amount'}
          direction={sortState.direction}
          onPress={handleFilterPress} // Removed arrow function
          label="Amount"
        />
      </View>
    );
  }
);

BillFilter.displayName = 'BillFilter';

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#EDF2F7',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
  filterButtonActive: {
    backgroundColor: '#4299E1',
  },
  filterButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#718096',
  },
  filterButtonTextActive: {
    color: 'white',
  },
});
