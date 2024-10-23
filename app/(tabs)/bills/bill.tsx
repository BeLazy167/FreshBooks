// app/(tabs)/bills/index.tsx
import { useState } from 'react';
import { Stack, router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Container } from '~/components/Container';
import { BillHeader } from '~/components/bills/BillHeader';
import { BillSearch } from '~/components/bills/BillSearch';
import { BillFilter } from '~/components/bills/BillFilter';
import { BillList } from '~/components/bills/BillList';
import { EmptyState as BillsEmptyState, EmptyState } from '~/components/bills/EmptyState';
import type { Bill } from '~/types';
import { mockBills } from '~/utils/data';

export default function BillsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  const handleBillPress = (bill: Bill) => {
    router.push(`/bills/${bill.id}`);
  };

  const handleAddBill = () => {
    router.push('/bills/create');
  };

  const filteredBills = mockBills
    .filter((bill) => bill.providerName.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return b.total - a.total;
    });

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
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#F7FAFC',
  },
  searchFilters: {
    marginBottom: 24,
    gap: 12,
  },
});
