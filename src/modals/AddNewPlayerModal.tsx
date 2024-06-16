import React, { useState } from 'react';
import { View, StyleSheet, Modal, Button, TextInput, TouchableOpacity, Text } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
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
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <MaterialIcons name="close" size={24} color="black" />
          </TouchableOpacity>
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
            multiline
          />
          <View style={styles.buttonGroup}>
            <View style={styles.buttonContainer}>
              <Button title="Cancel" onPress={handleClose} color="#d32f2f" />
            </View>
            <View style={styles.buttonContainer}>
              <Button title="Add Player" onPress={handleAddPlayer} color="#4caf50" />
            </View>
          </View>
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
    width: '80%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10, // Adjust based on your modal's design
    marginRight: -10, // Adjust based on your modal's design
  },
  input: {
    width: '100%',
    marginBottom: 10,
    borderWidth: 1,
    padding: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  buttonContainer: {
    flex: 0,  // Remove flex to let button wrap content
    marginHorizontal: 10,  // Add some spacing between buttons
  },
});

export default AddNewPlayerModal;
