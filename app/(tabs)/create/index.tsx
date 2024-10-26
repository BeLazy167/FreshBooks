// app/(tabs)/bills/create.tsx
import { Stack, router } from 'expo-router';

import { Container } from '~/components/Container';
import { BillForm } from '~/components/bills/BillForm';
import type { Bill, CreateBillDTO } from '~/types';
import { useBillStore } from '~/app/store/bills';
export default function CreateBillScreen() {
  const { createBill } = useBillStore();
  const handleCreateBill = (billData: CreateBillDTO) => {
    const newBill: Omit<Bill, 'id' | 'created_at' | 'date'> = {
      ...billData,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      created_at: new Date(),
      date: new Date(),
    };

    console.log('Created bill:', newBill);
    createBill(newBill);
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
