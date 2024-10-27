// app/(tabs)/bills/create.tsx
import { Stack, router } from 'expo-router';

import { Container } from '~/components/Container';
import { BillForm } from '~/components/bills/BillForm';
import type { Bill, CreateBillDTO } from '~/types';
import { useBillStore } from '~/app/store/bills';
export default function CreateBillScreen() {
  const { createBill, refetchAndReset } = useBillStore();
  const handleCreateBill = (billData: CreateBillDTO) => {
    const newBill: Bill = {
      ...billData,
      id: '',
      date: new Date(),
      created_at: new Date(),
    };

    console.log('Created bill:', newBill);

    createBill(newBill);

    //reset zustand store
    refetchAndReset();
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
