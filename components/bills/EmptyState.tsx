// components/bills/BillEmptyState.tsx
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export function BillEmptyState() {
  return (
    <View style={styles.empty}>
      <View style={styles.iconContainer}>
        <Feather name="file-text" size={32} color="#A0AEC0" />
      </View>
      <Text style={styles.emptyText}>No bills yet</Text>
      <Text style={styles.emptySubtext}>Create a new bill by tapping the + button</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EDF2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
  },
});
