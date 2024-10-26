// app/(tabs)/bills/index.tsx
import { useState, useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { ScrollView, StyleSheet, View, ActivityIndicator } from 'react-native';
import { Container } from '~/components/Container';
import { BillHeader } from '~/components/bills/BillHeader';
import { BillSearch } from '~/components/bills/BillSearch';
import { BillFilter } from '~/components/bills/BillFilter';
import { BillList } from '~/components/bills/BillList';
import { EmptyState } from '~/components/bills/EmptyState';
import BillFromId from '~/components/bills/BillFromId';
import { useBillStore } from '~/app/store/bills';
import type { Bill } from '~/types';

export default function BillsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null);

  const { bills, loading, error, fetchBills } = useBillStore();

  useEffect(() => {
    fetchBills();
  }, []);

  const handleBillPress = (bill: Bill) => {
    setSelectedBillId(bill.id);
  };

  const handleAddBill = () => {
    router.push('/create');
  };

  const handleCloseModal = () => {
    setSelectedBillId(null);
  };

  const filteredBills = bills
    .filter((bill) => bill.providerName.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return Number(b.total) - Number(a.total);
    });

  if (loading) {
    return (
      <Container>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <View style={styles.centered}>
          <EmptyState isFiltered={searchQuery.length > 0} onAddPress={handleAddBill} />
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <BillHeader count={filteredBills.length} onAddPress={handleAddBill} />

        <View style={styles.searchFilters}>
          <BillSearch value={searchQuery} onChangeText={setSearchQuery} />
          <BillFilter sortBy={sortBy} onSortChange={setSortBy} />
        </View>

        {filteredBills.length > 0 ? (
          <BillList bills={filteredBills} onBillPress={handleBillPress} />
        ) : (
          <EmptyState isFiltered={searchQuery.length > 0} onAddPress={handleAddBill} />
        )}
      </ScrollView>

      {selectedBillId && (
        <BillFromId id={selectedBillId} onClose={handleCloseModal} visible={true} />
      )}
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
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
