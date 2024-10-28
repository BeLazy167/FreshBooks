// components/providers/ProviderHeader.tsx
import { Feather } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

interface ProviderHeaderProps {
  count: number;
  onAddPress: () => void;
}

export function ProviderHeader({ count, onAddPress }: ProviderHeaderProps) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.title}>Providers</Text>
        <Text style={styles.subtitle}>{count} total providers</Text>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
        <Feather name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  addButton: {
    backgroundColor: '#4299E1',
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
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
});
