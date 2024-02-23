import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Modal, Button, TextInput, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { Player, Session } from '../db/models';
import { useDatabase } from '../context/DatabaseContext';
import { getPlayers } from '../db/players';

interface AddSessionModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (newSession: Session) => void;
}

const AddSessionModal: React.FC<AddSessionModalProps> = ({ visible, onClose, onAdd }) => {
  const baseNewSession = {
    date: '',
    stakes: '',
    cashIn: 0,
    cashOut: 0,
    location: '',
    host: 0,
    gameType: '',
  };
  const [newSession, setNewSession] = useState<Session>(baseNewSession);
  const [players, setPlayers] = useState<Player[]>([]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const db = useDatabase();
  useEffect(() => {
    const fetchDefaultHost = async () => {
      try {
        const fetchedPlayers = await getPlayers(db);
        setPlayers(fetchedPlayers);
        if (fetchedPlayers.length > 0) {
          setNewSession(prev => ({ ...prev, host: fetchedPlayers[0]?.id || 0 }));
        }
      } catch (error) {
        console.error('Failed to fetch host:', error);
      }
    };

    if (visible) { // Only fetch players if the modal is visible
      fetchDefaultHost();
    }
  }, [visible, db]);

  const handleAddSession = () => {
    const formattedDate = date.toISOString().split('T')[0];

    const sessionToAdd = {
      ...newSession,
      date: formattedDate,
    };
    onAdd(sessionToAdd);
    onClose();
    setNewSession({ ...newSession, date: '', cashIn: 0, cashOut: 0, host: players[0]?.id || 0 });
  };

  const handleClose = () => {
    onClose();
    setNewSession({ ...newSession, date: '', cashIn: 0, cashOut: 0, host: players[0]?.id || 0 }); // Reset the state
  };


  const onDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    setNewSession({ ...newSession, date: currentDate.toDateString() });
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };
  
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View>
            <Button onPress={showDatepicker} title="Show date picker!" />
          </View>
          <Text>{date.toDateString()}</Text>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onDateChange}
              style={styles.datePicker}
            />
          )}
          <TextInput
            style={styles.input}
            onChangeText={(text) => setNewSession({ ...newSession, stakes: text })}
            value={newSession.stakes}
            placeholder="Stakes"
          />
          <TextInput
            style={styles.input}
            onChangeText={(text) => setNewSession({ ...newSession, cashIn: parseFloat(text) })}
            value={newSession.cashIn.toString()}
            placeholder="Cash In"
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            onChangeText={(text) => setNewSession({ ...newSession, cashOut: parseFloat(text) })}
            value={newSession.cashOut.toString()}
            placeholder="Cash Out"
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            onChangeText={(text) => setNewSession({ ...newSession, location: text })}
            value={newSession.location}
            placeholder="Location"
          />
          <Picker
            selectedValue={newSession.gameType}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => {
              setNewSession({ ...newSession, gameType: itemValue })
            }}>
            <Picker.Item label="Cash" value="Cash" />
            <Picker.Item label="Tournament" value="Tournament" />
          </Picker>
          <Picker
            selectedValue={newSession.host}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => {
              setNewSession({ ...newSession, host: itemValue })
            }}>
            {players.map((player) => (
              <Picker.Item key={player.id} label={player.name} value={player.id} />
            ))}
          </Picker>
          <Button title="Add Session" onPress={handleAddSession} />
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
  picker: {
    height: 50,
    width: 200,
  },
  datePicker: {
    width: 320,
    height: 260,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AddSessionModal;
