import { View, StyleSheet } from 'react-native';

import { BillCard } from './BillCard';

import type { Bill } from '~/types';

interface BillListProps {
  bills: Bill[];
  onBillPress: (bill: Bill) => void;
  refreshing: boolean;
}

export function BillList({ bills, onBillPress }: BillListProps) {
  return (
    <View style={styles.list}>
      {bills.map((bill) => (
        <BillCard key={bill.id} bill={bill} onPress={() => onBillPress(bill)} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
});
