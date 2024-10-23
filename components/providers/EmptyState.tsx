// components/providers/EmptyState.tsx
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface EmptyStateProps {
  onAddPress: () => void;
}

export function EmptyState({ onAddPress }: EmptyStateProps) {
  return (
    <View style={styles.empty}>
      <View style={styles.iconContainer}>
        <Feather name="users" size={32} color="#A0AEC0" />
      </View>
      <Text style={styles.title}>No providers yet</Text>
      <Text style={styles.subtitle}>Add your first provider to get started</Text>
      <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
        <Feather name="plus" size={20} color="white" />
        <Text style={styles.addButtonText}>Add Provider</Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 24,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#4299E1',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#4299E1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
