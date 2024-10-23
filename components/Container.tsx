// components/ui/Container.tsx
import type { PropsWithChildren } from 'react';
import { View, StyleSheet } from 'react-native';

export function Container({ children }: PropsWithChildren) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
});
