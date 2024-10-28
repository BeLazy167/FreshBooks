// components/providers/ProviderCard.tsx
import { Feather } from '@expo/vector-icons';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';

import type { Provider } from '~/types';

interface ProviderCardProps {
  provider: Provider;
  onPress?: () => void;
}

export function ProviderCard({ provider, onPress }: ProviderCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardContent}>
        <View style={styles.providerInfo}>
          <View style={styles.iconContainer}>
            <Feather name="shopping-bag" size={20} color="#4299E1" />
          </View>
          <View>
            <Text style={styles.providerName}>{provider.name}</Text>
            {provider.mobile && (
              <View style={styles.phoneContainer}>
                <Feather name="phone" size={14} color="#718096" />
                <Text style={styles.providerPhone}>{provider.mobile}</Text>
              </View>
            )}
          </View>
        </View>
        <Feather name="chevron-right" size={20} color="#A0AEC0" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 16,
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
    marginBottom: 4,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  providerPhone: {
    fontSize: 14,
    color: '#718096',
  },
});
