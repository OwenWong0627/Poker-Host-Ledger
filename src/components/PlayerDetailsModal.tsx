// PlayerDetailsModal.js

import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';
import { Player } from '../db/models';

interface PlayerDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  player: Player;
  onDelete: (id: number) => void;
}

const PlayerDetailsModal: React.FC<PlayerDetailsModalProps> = ({ visible, onClose, player, onDelete }) => {
  const addDollarSign = (amount: number) => {
    if (amount < 0) {
      return '-$' + Math.abs(amount).toFixed(2);
    }
    else if (amount === undefined || amount === null) {
      return '$0.00';
    }
    else {
      return '+$' + amount.toFixed(2);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Name: {player.name}</Text>
          <Text style={styles.modalText}>Profit: {addDollarSign(player.profit)}</Text>
          <Text style={styles.modalText}>Player Notes: {player.playerNotes}</Text>
          <Button onPress={() => onDelete(player.id!)} title="Delete Player" color="#FF0000" />
          <Button onPress={onClose} title="Close" color="#000000" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default PlayerDetailsModal;
