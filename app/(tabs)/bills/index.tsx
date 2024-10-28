// app/(tabs)/bills/index.tsx
import { Stack, router } from 'expo-router';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet, View, ActivityIndicator, RefreshControl } from 'react-native';

import { useBillStore } from '~/app/store/bills';
import { Container } from '~/components/Container';
import { BillFilter } from '~/components/bills/BillFilter';
import { BillFromId } from '~/components/bills/BillFromId';
import { BillHeader } from '~/components/bills/BillHeader';
import { BillList } from '~/components/bills/BillList';
import { BillSearch } from '~/components/bills/BillSearch';
import { EmptyState } from '~/components/bills/EmptyState';
import type { Bill } from '~/types';

export default function BillsScreen() {
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [refreshing, setRefreshing] = useState(false);

  const { bills, loading, error, fetchBills } = useBillStore();

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
    return bills
      .filter((bill) => bill.providerName.toLowerCase().includes(searchQuery.toLowerCase().trim()))
      .sort((a, b) => {
        const multiplier = sortDirection === 'desc' ? 1 : -1;
        if (sortBy === 'date') {
          return multiplier * (new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        }
        return multiplier * (Number(b.total) - Number(a.total));
      });
  }, [bills, searchQuery, sortBy, sortDirection]);

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

  const handleSortChange = useCallback(
    (newSort: { option: 'date' | 'amount'; direction: 'asc' | 'desc' }) => {
      setSortBy(newSort.option);
      setSortDirection(newSort.direction);
    },
    []
  );

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
          <BillFilter
            sortState={{ option: sortBy, direction: sortDirection }}
            onSortChange={handleSortChange}
          />
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
