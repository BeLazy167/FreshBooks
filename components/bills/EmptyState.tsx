// components/bills/EmptyState.tsx
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface EmptyStateProps {
  isFiltered: boolean;
  onAddPress?: () => void;
}

export function EmptyState({ isFiltered, onAddPress }: EmptyStateProps) {
  return (
    <View style={styles.emptyState}>
      <View style={styles.iconContainer}>
        <Feather name="file-text" size={32} color="#A0AEC0" />
      </View>
      <Text style={styles.text}>{isFiltered ? 'No bills found' : 'No bills yet'}</Text>
      <Text style={styles.subtext}>
        {isFiltered ? 'Try adjusting your search' : 'Create a new bill by tapping the + button'}
      </Text>
      {!isFiltered && onAddPress && (
        <TouchableOpacity style={styles.button} onPress={onAddPress}>
          <Feather name="plus" size={20} color="white" />
          <Text style={styles.buttonText}>Create Bill</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  emptyState: {
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
  text: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
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
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
