import React, { useState, useEffect } from 'react';
import { View, Modal, StyleSheet, Button, Text, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDatabase } from '../context/DatabaseContext';
import { getPlayers } from '../db/players';
import { Player } from '../db/models';

interface AddPlayerModalProps {
  visible: boolean;
  onAddExistingPlayer: (playerId: number) => void;
  onClose: () => void;
}

const AddPlayerModal: React.FC<AddPlayerModalProps> = ({
  visible,
  onAddExistingPlayer,
  onClose,
}) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number>(1);
  const db = useDatabase();

  const handleAddExistingPlayerToSession = () => {
    onAddExistingPlayer(selectedPlayerId);
    onClose();
    setSelectedPlayerId(1);
  };

  const handleClose = () => {
    onClose();
    setSelectedPlayerId(1);
  }

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const fetchedPlayers = await getPlayers(db);
        setPlayers(fetchedPlayers);
      } catch (error) {
        console.error('Failed to fetch players:', error);
      }
    };

    if (visible) {
      fetchPlayers();
    }
  }, [visible, db]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
            <MaterialIcons name="close" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Select an existing player:</Text>
          <Picker
            selectedValue={selectedPlayerId}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedPlayerId(itemValue)}
          >
            {players.map((player) => (
              <Picker.Item key={player.id} label={player.name} value={player.id} />
            ))}
          </Picker>
          <View style={styles.buttonRow}>
            <Button title="Cancel" onPress={handleClose} color="#F44336" />
            <Button
              title="Add Player"
              onPress={handleAddExistingPlayerToSession}
              color="#4CAF50"
            />
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
    width: '80%', // Adjust width as needed
  },
  picker: {
    height: 50,
    width: 150,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%', // Ensure buttons are full width
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  title: {
    marginBottom: 15,
    fontWeight: 'bold',
  },
});

export default AddPlayerModal;
