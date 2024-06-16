import React, { useState } from 'react';
import { Modal, View, Text, Button, TextInput, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Player } from '../db/models';

interface PlayerDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  player: Player;
  onDelete: (id: number) => void;
  onUpdate: (player: Player) => void;
}

const PlayerDetailsModal: React.FC<PlayerDetailsModalProps> = ({
  visible,
  onClose,
  player,
  onDelete,
  onUpdate
}) => {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(player.name);
  const [playerNotes, setPlayerNotes] = useState(player.playerNotes);

  const handleUpdate = () => {
    const updatedPlayer = { ...player, name, playerNotes };
    onUpdate(updatedPlayer);
    setEditMode(false);
  };

  const handleClose = () => {
    setEditMode(false);
    onClose();
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
          <MaterialIcons
            name="close"
            size={24}
            color="black"
            onPress={handleClose}
            style={styles.closeIcon}
          />
          {editMode ? (
            <>
              <TextInput
                style={styles.input}
                onChangeText={setName}
                value={name}
                placeholder="Name"
              />
              <TextInput
                style={styles.input}
                onChangeText={setPlayerNotes}
                value={playerNotes}
                placeholder="Player Notes"
                multiline
              />
              <View style={styles.buttonGroup}>
                {!editMode && <View style={styles.buttonContainer}>
                  <Button onPress={() => setEditMode(false)} title="Cancel" color="#757575" />
                </View> }
                {player.id !== 1 && (
                  <View style={styles.buttonContainer}>
                    <Button onPress={() => onDelete(player.id!)} title="Delete Player" color="#FF1744" />
                  </View>
                )}
                <View style={styles.buttonContainer}>
                  <Button onPress={handleUpdate} title="Save" color="#00C853" />
                </View>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.modalName}>{name? name : 'No Name'}</Text>
              <Text style={styles.modalText}>Notes: {playerNotes}</Text>
              <View style={styles.buttonGroup}>
                <View style={styles.buttonContainer}>
                  <Button onPress={handleClose} title="Close" color="#757575" />
                </View>
                <View style={styles.buttonContainer}>
                  <Button onPress={() => setEditMode(true)} title="Edit" color="#1E88E5" />
                </View>
              </View>
            </>
          )}
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
    width: '80%',
  },
  modalName: {
    fontSize: 20,
    textAlign: 'left',
    width: '100%',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'left',
    width: '100%',
  },
  input: {
    width: '100%',
    marginBottom: 10,
    borderWidth: 1,
    padding: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    marginTop: 5,
    marginRight: -20,
  },
  buttonContainer: {
    marginHorizontal: 5,
  },
  closeIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
});

export default PlayerDetailsModal;
