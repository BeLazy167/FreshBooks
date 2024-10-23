import React from 'react';
import { ScrollView, StyleSheet, Modal, View, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Container } from '~/components/Container';
import { BillDetail } from '~/components/bills/BillDetail';
import { mockBills } from '~/utils/data';

export default function BillFromId({ id, onClose, visible }: { id: string; onClose: () => void; visible: boolean }) {
  const bill = mockBills.find((b) => b.id === id);

  if (!bill) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Feather name="x" size={24} color="#4A5568" />
          </TouchableOpacity>
          <Container>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
              <BillDetail bill={bill} />
            </ScrollView>
          </Container>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '90%',
    paddingTop: 20,
  },
  container: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    padding: 10,
  },
});
