// app/(tabs)/bills/[id].tsx
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';
import { Container } from '~/components/Container';
import { BillDetail } from '~/components/bills/BillDetail';
import { mockBills } from '~/utils/data';

export default function BillDetailsScreen() {
  const { id } = useLocalSearchParams();
  const bill = mockBills.find((b) => b.id === id);

  if (!bill) return null;

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Bill Details',
          headerStyle: { backgroundColor: '#fff' },
          headerShadowVisible: false,
        }}
      />
      <Container>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
          <BillDetail bill={bill} />
        </ScrollView>
      </Container>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
});
