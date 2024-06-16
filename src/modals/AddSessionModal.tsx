import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Modal, Button, Text, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Player, Session } from '../db/models';
import { useDatabase } from '../context/DatabaseContext';
import { getPlayers } from '../db/players';

interface AddSessionModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (newSession: Session) => void;
}

const AddSessionModal: React.FC<AddSessionModalProps> = ({ visible, onClose, onAdd }) => {
  const db = useDatabase();
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [session, setSession] = useState<Session>({
    date: new Date().toISOString().split('T')[0],
    stakes: '¢5/¢10',
    host: 1,
    gameType: 'Cash',
  });

  useEffect(() => {
    const fetchDefaultHost = async () => {
      try {
        const fetchedPlayers = await getPlayers(db);
        setPlayers(fetchedPlayers);
        if (fetchedPlayers.length > 0) {
          setSession(prev => ({ ...prev, host: fetchedPlayers[0]?.id || 1 }));
        }
      } catch (error) {
        console.error('Failed to fetch host:', error);
      }
    };
    if (visible) { // Only fetch players if the modal is visible
      fetchDefaultHost();
    }
  }, [visible, db]);

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    setSession(prev => ({ ...prev, date: currentDate.toISOString().split('T')[0] }));
  };

  const handleAddSession = () => {
    onAdd(session);
    onClose();
    setSession({ ...session, date: new Date().toISOString().split('T')[0], host: players[0]?.id || 0 });
  };

  const handleClose = () => {
    onClose();
    setSession({ ...session, date: new Date().toISOString().split('T')[0], host: players[0]?.id || 0 }); // Reset the state
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
          <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
            <MaterialIcons name="close" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Add New Session</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerTrigger}>
            <Text>Select Date: {date.toISOString().split('T')[0]}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
          <Picker
            selectedValue={session.stakes}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => {
              setSession({ ...session, stakes: itemValue })
            }}>
            <Picker.Item label="¢1/¢2" value="¢1/¢2" />
            <Picker.Item label="¢2/¢5" value="¢2/¢5" />
            <Picker.Item label="¢5/¢10" value="¢5/¢10" />
            <Picker.Item label="¢10/¢25" value="¢10/¢25" />
            <Picker.Item label="¢25/¢25" value="¢25/¢25" />
            <Picker.Item label="¢25/¢50" value="¢25/¢50" />
            <Picker.Item label="¢50/$1" value="¢50/$1" />
          </Picker>
          <Picker
            selectedValue={session.gameType}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => {
              setSession({ ...session, gameType: itemValue })
            }}>
            <Picker.Item label="Cash" value="Cash" />
            <Picker.Item label="Tournament" value="Tournament" />
          </Picker>
          <Picker
            selectedValue={session.host}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => {
              setSession({ ...session, host: itemValue })
            }}>
            {players.map((player) => (
              <Picker.Item key={player.id} label={player.name} value={player.id} />
            ))}
          </Picker>
          <View style={styles.buttonRow}>
            <Button title="Cancel" color="#F44336" onPress={handleClose} />
            <Button title="Add Session" color="#4CAF50" onPress={handleAddSession} />
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
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  picker: {
    height: 50,
    width: 200,
  },
  closeIcon: {
    alignSelf: 'flex-end',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  datePickerTrigger: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#E0E0E0',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 20,
    width: '80%',
  },
});

export default AddSessionModal;
