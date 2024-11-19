// app/(tabs)/bills/index.tsx
import { Stack, router } from 'expo-router';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet, View, ActivityIndicator, RefreshControl } from 'react-native';
import { startOfDay, endOfDay, isWithinInterval } from 'date-fns';

import { useBillStore } from '~/app/store/bills';
import { Container } from '~/components/Container';
import { BillFilter } from '~/components/bills/BillFilter';
import { BillFromId } from '~/components/bills/BillFromId';
import { BillHeader } from '~/components/bills/BillHeader';
import { BillList } from '~/components/bills/BillList';
import { BillSearch } from '~/components/bills/BillSearch';
import { EmptyState } from '~/components/bills/EmptyState';
import { BillFilters } from '~/components/bills/BillFilters';
import type { Bill } from '~/types';
import { useFiltersStore } from '~/app/store/filters';

export default function BillsScreen() {
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const { bills, loading, error, fetchBills } = useBillStore();
  const { providerId, signerId, startDate, endDate } = useFiltersStore();

  // Initial data fetch
  useEffect(() => {
    fetchBills().catch(console.error);
  }, []);

  // Pull to refresh handler
  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await fetchBills();
    } catch (err) {
      console.error('Error refreshing bills:', err);
    } finally {
      setRefreshing(false);
    }
  }, [fetchBills]);

  // Memoized filtered and sorted bills
  const filteredBills = useMemo(() => {
    return bills.filter(bill => {
      // Provider filter
      if (providerId && bill.providerId !== providerId) {
        return false;
      }

      // Signer filter
      if (signerId && bill.signer !== signerId) {
        return false;
      }

      // Date range filter
      if (startDate || endDate) {
        const billDate = new Date(bill.date);
        const startDateObj = startDate ? new Date(startDate) : null;
        const endDateObj = endDate ? new Date(endDate) : null;
        
        if (startDateObj && endDateObj) {
          return isWithinInterval(billDate, {
            start: startOfDay(startDateObj),
            end: endOfDay(endDateObj)
          });
        }
        
        if (startDateObj && billDate < startOfDay(startDateObj)) {
          return false;
        }
        
        if (endDateObj && billDate > endOfDay(endDateObj)) {
          return false;
        }
      }

      // Search query filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        return (
          bill.providerName.toLowerCase().includes(searchLower) ||
          bill.items.some(item => item.name.toLowerCase().includes(searchLower))
        );
      }

      return true;
    });
  }, [bills, providerId, signerId, startDate, endDate, searchQuery]);

  // Event handlers
  const handleBillPress = useCallback((bill: Bill) => {
    setSelectedBillId(bill.id);
  }, []);

  const handleAddBill = useCallback(() => {
    router.push('/create');
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedBillId(null);
  }, []);

  // Loading state
  if (loading && !refreshing) {
    return (
      <Container>
        <Stack.Screen options={{ title: 'Bills' }} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </Container>
    );
  }

  // Error state
  if (error && !refreshing) {
    return (
      <Container>
        <Stack.Screen options={{ title: 'Bills' }} />
        <View style={styles.centered}>
          <EmptyState
            isFiltered={false}
            onAddPress={handleAddBill}
            error={error}
            onRetry={fetchBills}
          />
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <Stack.Screen options={{ title: 'Bills' }} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.container}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#007AFF']} />
        }>
        <BillHeader count={filteredBills.length} onAddPress={handleAddBill} />
        
        <View style={styles.searchFilters}>
          <BillSearch
            value={searchQuery}
            onChangeText={setSearchQuery}
            onClear={() => setSearchQuery('')}
          />
          <BillFilters />
        </View>

        {filteredBills.length > 0 ? (
          <BillList bills={filteredBills} onBillPress={handleBillPress} refreshing={refreshing} />
        ) : (
          <EmptyState
            isFiltered={searchQuery.length > 0}
            onAddPress={handleAddBill}
            onClearFilter={() => setSearchQuery('')}
          />
        )}
      </ScrollView>

      {selectedBillId && <BillFromId id={selectedBillId} onClose={handleCloseModal} visible />}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchFilters: {
    marginBottom: 24,
    gap: 12,
    paddingHorizontal: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
});
