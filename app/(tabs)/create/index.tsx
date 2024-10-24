// app/(tabs)/bills/create.tsx
import { Stack, router } from 'expo-router';

import { Container } from '~/components/Container';
import { BillForm } from '~/components/bills/BillForm';
import type { Bill } from '~/types';
import { generateId } from '~/utils';

export default function CreateBillScreen() {
  const handleCreateBill = (billData: Omit<Bill, 'id' | 'date'>) => {
    // In a real app, this would save to a database
    const newBill: Bill = {
      ...billData,
      id: generateId(),
      date: new Date().toISOString(),
    };

    console.log('Created bill:', newBill);

    // Navigate back to bills list
    router.push('/bills/bill');
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Create Bill',
          headerStyle: { backgroundColor: '#fff' },
          headerShadowVisible: false,
        }}
      />
      <Container>
        <BillForm onSubmit={handleCreateBill} />
      </Container>
    </>
  );
}
