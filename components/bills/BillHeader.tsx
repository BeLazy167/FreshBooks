// components/bills/BillHeader.tsx
import { View, Text, StyleSheet } from 'react-native';

interface BillHeaderProps {
  count: number;
}

export function BillHeader({ count }: BillHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Recent Bills</Text>
      <Text style={styles.subtitle}>{count} total bills</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#718096',
  },
});


