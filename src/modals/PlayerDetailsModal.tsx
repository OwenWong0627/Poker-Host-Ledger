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
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            {!editMode && (
              <MaterialIcons
                name="edit"
                size={24}
                color="black"
                onPress={() => setEditMode(true)}
                style={styles.editIcon}
              />
            )}
          </View>
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
            </>
          ) : (
            <>
              <Text style={styles.modalText}>Name: {name}</Text>
              <Text style={styles.modalText}>Player Notes: {playerNotes}</Text>
            </>
          )}
          {editMode && player.id === 1 && <Button disabled={true} title="Host can not be deleted" color="#808080" />}
          {editMode && player.id !== 1 && <Button onPress={() => onDelete(player.id!)} title="Delete Player" color="#FF0000" />}
          {editMode && <Button onPress={handleUpdate} title="Save" color="#0000FF" />}
          {!editMode && <Button onPress={handleClose} title="Close" color="#000000" />}
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
    alignItems: 'flex-start',
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
  modalText: {
    marginBottom: 15,
    textAlign: 'left',
  },
  input: {
    width: '100%',
    marginBottom: 10,
    borderWidth: 1,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: 10,
  },
  editIcon: {
    position: 'absolute', // Position the edit icon absolutely
    right: 0, // Distance from the right edge of the modal view
    top: 0, // Distance from the top edge of the modal view
  },
});

export default PlayerDetailsModal;
