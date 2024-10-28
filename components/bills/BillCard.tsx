// components/bills/BillCard.tsx
import { Feather } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

import type { Bill } from '~/types';
import { formatCurrency } from '~/utils';

interface BillCardProps {
  bill: Bill;
  onPress?: () => void;
}

export function BillCard({ bill, onPress }: BillCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardContent}>
        <View style={styles.headerRow}>
          <View style={styles.providerInfo}>
            <View style={styles.iconContainer}>
              <Feather name="file-text" size={20} color="#4299E1" />
            </View>
            <Text style={styles.providerName}>{bill.providerName}</Text>
          </View>
          <Text style={styles.date}>{new Date(bill.date).toLocaleDateString()}</Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.itemsInfo}>
            <Feather name="shopping-bag" size={16} color="#718096" />
            <Text style={styles.itemsText}>{bill.items.length} items</Text>
          </View>

          <Text style={styles.signerText}>{bill.signer}</Text>
          <Text style={styles.total}>{formatCurrency(bill.total.toString())}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardContent: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#EBF8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
  },
  date: {
    fontSize: 14,
    color: '#718096',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itemsText: {
    fontSize: 14,
    color: '#718096',
  },
  total: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
  },
  signerText: {
    fontSize: 14,
    color: '#718096',
  },
});
