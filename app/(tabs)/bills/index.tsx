// app/(tabs)/bills/index.tsx
import { Stack } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';
import { Container } from '~/components/Container';
import { BillHeader } from '~/components/bills/BillHeader';
import { BillList } from '~/components/bills/BillList';
import { BillEmptyState } from '~/components/bills/EmptyState';
import type { Bill } from '~/types';
import { mockBills } from '~/utils/data';

export default function BillsScreen() {
  const handleBillPress = (bill: Bill) => {
    // Handle bill press - navigate to details view
    console.log('Bill pressed:', bill.id);
  };

  return (
    <Container>
      <Stack.Screen
        options={{
          title: 'Bills',
          headerStyle: { backgroundColor: '#fff' },
          headerShadowVisible: false,
          headerShown: false,
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <BillHeader count={mockBills.length} />

        {mockBills.length > 0 ? (
          <BillList bills={mockBills} onBillPress={handleBillPress} />
        ) : (
          <BillEmptyState />
        )}
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#F7FAFC',
    padding: 20,
  },
});
