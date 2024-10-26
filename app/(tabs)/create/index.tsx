// app/(tabs)/bills/create.tsx
import { Stack, router } from 'expo-router';

import { Container } from '~/components/Container';
import { BillForm } from '~/components/bills/BillForm';
import type { Bill, CreateBillDTO } from '~/types';
import { generateId } from '~/utils';

export default function CreateBillScreen() {
  const handleCreateBill = (billData: CreateBillDTO) => {
    // In a real app, this would save to a database
    const newBill: CreateBillDTO = {
      ...billData,
    };

    console.log('Created bill:', newBill);

    // Navigate back to bills list
    router.push('/bills');
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
