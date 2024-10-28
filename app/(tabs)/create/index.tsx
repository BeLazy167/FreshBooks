// app/(tabs)/bills/create.tsx
import { router } from 'expo-router';

import { useBillStore } from '~/app/store/bills';
import { Container } from '~/components/Container';
import { BillForm } from '~/components/bills/BillForm';
import type { Bill, CreateBillDTO } from '~/types';
export default function CreateBillScreen() {
  const { createBill } = useBillStore();
  const handleCreateBill = (billData: CreateBillDTO) => {
    const newBill: Bill = {
      ...billData,
      id: '',
      date: new Date(),
      created_at: new Date(),
    };

    console.log('Created bill:', newBill);

    createBill(newBill);

    // Navigate back to bills list
    router.navigate('/bills');
  };

  return (
    <>
      <Container>
        <BillForm onSubmit={handleCreateBill} />
      </Container>
    </>
  );
}
