// app/(tabs)/bills/index.tsx
import { Stack, router } from 'expo-router';
import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { startOfDay, endOfDay, isWithinInterval } from 'date-fns';
import { Feather } from '@expo/vector-icons';

import { useBillStore } from '~/app/store/bills';
import { Container } from '~/components/Container';
import { BillFromId } from '~/components/bills/BillFromId';
import { BillHeader } from '~/components/bills/BillHeader';
import { BillList } from '~/components/bills/BillList';
import { BillSearch } from '~/components/bills/BillSearch';
import { EmptyState } from '~/components/bills/EmptyState';
import { BillFilters } from '~/components/bills/BillFilters';
import type { Bill } from '~/types';
import { useFiltersStore } from '~/app/store/filters';
import { useProviderStore } from '~/app/store/providers';
export default function BillsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { bills, loading, error, fetchBills } = useBillStore();
  const { providerId, signerId, startDate, endDate } = useFiltersStore();
  const { fetchProviders } = useProviderStore();
  // Initial data fetch
  useEffect(() => {
    fetchBills().catch(console.error);
    fetchProviders().catch(console.error);
  }, []);

  // Pull to refresh handler
  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await fetchBills();
      await fetchProviders();
    } catch (err) {
      console.error('Error refreshing bills:', err);
    } finally {
      setRefreshing(false);
    }
  }, [fetchBills, fetchProviders]);

  // Memoized filtered and sorted bills
  const filteredBills = useMemo(() => {
    return bills.filter((bill) => {
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
            end: endOfDay(endDateObj),
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
          bill.items.some((item) => item.name.toLowerCase().includes(searchLower))
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

  const handleCacheRefresh = useCallback(async () => {
    try {
      const response = await fetch('/api/cache/reset');
      if (response.ok) {
        // Refresh the bills data after cache reset
        await fetchBills();
        await fetchProviders();
      } else {
        console.error('Failed to reset cache');
      }
    } catch (error) {
      console.error('Error refreshing cache:', error);
    }
  }, [fetchBills, fetchProviders]);

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

        <View style={styles.filtersContainer}>
          <View style={styles.searchRow}>
            <View style={styles.searchWrapper}>
              <BillSearch
                value={searchQuery}
                onChangeText={setSearchQuery}
                onClear={() => setSearchQuery('')}
              />
            </View>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={handleCacheRefresh}
              activeOpacity={0.7}>
              <Feather name="refresh-cw" size={20} color="white" />
            </TouchableOpacity>
          </View>
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
    padding: 16,
  },
  filtersContainer: {
    gap: 16,
    marginBottom: 20,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchWrapper: {
    flex: 1,
  },
  refreshButton: {
    backgroundColor: '#4299E1',
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#4299E1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
});
