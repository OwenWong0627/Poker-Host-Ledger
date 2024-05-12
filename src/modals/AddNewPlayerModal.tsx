import React, { useState } from 'react';
import { View, StyleSheet, Modal, Button, TextInput } from 'react-native';
import { Player } from '../db/models';

interface AddNewPlayerModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (newPlayer: Player) => void;
}

const AddNewPlayerModal: React.FC<AddNewPlayerModalProps> = ({ visible, onClose, onAdd }) => {
  const baseNewPlayer = {
    name: '',
    profit: 0,
    favHandRank1: '?',
    favHandSuit1: 'suits',
    favHandRank2: '?',
    favHandSuit2: 'suits',
    playerNotes: '',
  };
  const [newPlayer, setNewPlayer] = useState(baseNewPlayer);

  const handleAddPlayer = () => {
    onAdd({...newPlayer});
    onClose();
    setNewPlayer(baseNewPlayer);
  };

  const handleClose = () => {
    onClose();
    setNewPlayer(baseNewPlayer);
  }
  
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setNewPlayer({ ...newPlayer, name: text })}
            value={newPlayer.name}
            placeholder="Name"
          />
          <TextInput
            style={styles.input}
            onChangeText={(text) => setNewPlayer({ ...newPlayer, playerNotes: text })}
            value={newPlayer.playerNotes}
            placeholder="Player Notes"
            multiline // Allows for multiline input
          />
          {/* Add more TextInput components for each property of the player */}
          <Button title="Add Player" onPress={handleAddPlayer} />
          <Button title="Cancel" onPress={handleClose} />
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
    paddingTop: 22,
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 200,
  },
});

export default AddNewPlayerModal;
