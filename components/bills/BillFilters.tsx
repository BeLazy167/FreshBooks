import { Feather } from '@expo/vector-icons';
import { format } from 'date-fns';
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

import { SearchableDropdown as ProviderDropdown } from '../providers/SearchableDropdown';
import { SearchableDropdown as SignerDropdown } from '../signers/SearchableDropdown';

import { useProviderStore } from '~/app/store/providers';
import { useSignerStore } from '~/app/store/signers';
import { useFiltersStore } from '~/app/store/filters';

export function BillFilters() {
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);

  const { providers } = useProviderStore();
  const { signers } = useSignerStore();
  const { providerId, signerId, startDate, endDate, setFilter, clearFilters } = useFiltersStore();

  const selectedProvider = providers.find((p) => p.id === providerId)?.name || '';
  const selectedSigner = signers.find((s) => s.name === signerId)?.name || '';

  const handleStartDateChange = (event: DateTimePickerEvent, date?: Date) => {
    setShowStartDate(false);
    if (date) {
      setFilter({ startDate: date.toISOString() });
    }
  };

  const handleEndDateChange = (event: DateTimePickerEvent, date?: Date) => {
    setShowEndDate(false);
    if (date) {
      setFilter({ endDate: date.toISOString() });
    }
  };

  const hasActiveFilters = providerId || signerId || startDate || endDate;

  const startDateObj = startDate ? new Date(startDate) : null;
  const endDateObj = endDate ? new Date(endDate) : null;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.filterItem}>
          <ProviderDropdown
            data={providers}
            value={selectedProvider}
            onSelect={(provider) => setFilter({ providerId: provider.id })}
            placeholder="Filter by provider"
          />
        </View>

        <View style={styles.filterItem}>
          <SignerDropdown
            value={selectedSigner}
            onSelect={(signer) => setFilter({ signerId: signer.name })}
            placeholder="Filter by signer"
          />
        </View>
      </View>

      <View style={styles.row}>
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowStartDate(true)}>
          <Feather name="calendar" size={20} color="#4A5568" />
          <Text style={styles.dateButtonText}>
            {startDateObj ? format(startDateObj, 'MMM dd, yyyy') : 'Start Date'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dateButton} onPress={() => setShowEndDate(true)}>
          <Feather name="calendar" size={20} color="#4A5568" />
          <Text style={styles.dateButtonText}>
            {endDateObj ? format(endDateObj, 'MMM dd, yyyy') : 'End Date'}
          </Text>
        </TouchableOpacity>
      </View>

      {hasActiveFilters && (
        <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
          <Feather name="x" size={20} color="#FC8181" />
          <Text style={styles.clearButtonText}>Clear Filters</Text>
        </TouchableOpacity>
      )}

      {showStartDate && (
        <DateTimePicker
          value={startDateObj || new Date()}
          mode="date"
          onChange={handleStartDateChange}
        />
      )}

      {showEndDate && (
        <DateTimePicker
          value={endDateObj || new Date()}
          mode="date"
          onChange={handleEndDateChange}
          minimumDate={startDateObj || undefined}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  filterItem: {
    flex: 1,
  },
  dateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dateButtonText: {
    color: '#4A5568',
    fontSize: 16,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
  },
  clearButtonText: {
    color: '#FC8181',
    fontSize: 16,
    fontWeight: '500',
  },
});
