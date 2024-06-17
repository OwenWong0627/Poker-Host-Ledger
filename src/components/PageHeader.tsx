import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { resetGrid, toggleKeyboard } from '../redux/actions';
import { Player, Session } from '../db/models';
import AddNewPlayerModal from '../modals/AddNewPlayerModal';
import { addPlayer, getPlayers } from '../db/players';
import { useDatabase } from '../context/DatabaseContext';
import AddSessionModal from '../modals/AddSessionModal';
import { addSession, getSessions } from '../db/sessions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface PageHeaderProps {
  navigation?: any;
  pageName?: string;
  setPlayers?: (players: Player[]) => void;
  setSessions?: (sessions: Session[]) => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ navigation, pageName, setPlayers, setSessions }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const db = useDatabase();
  const dispatch = useDispatch();

  const handleReturn = () => {
    dispatch(resetGrid());
    dispatch(toggleKeyboard(false, '?', 'suits'));
    navigation.goBack();
  }

  const handleAddPlayer = async (newPlayer: Player) => {
    console.log('Adding player:', newPlayer);
    await addPlayer(db, newPlayer);
    if (setPlayers) setPlayers(await getPlayers(db));
  };

  const handleAddSession = async (newSession: Session) => {
    console.log('Adding session:', newSession);
    await addSession(db, newSession);
    if (setSessions) setSessions(await getSessions(db));
  };

  const handleAddForm = () => {
    setModalVisible(true);
  }

  return (
    <View style={styles.header}>
      <AddNewPlayerModal
        visible={pageName === 'Players' && modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddPlayer}
      />
      <AddSessionModal
        visible={pageName === 'Sessions' && modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddSession}
      />
      <TouchableOpacity style={styles.headerButton} onPress={handleReturn}>
        <MaterialIcons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.headerButton} onPress={handleAddForm}>
      <MaterialIcons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 5,
    marginBottom: 15,
    height: 50,
    backgroundColor: 'white',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default PageHeader;
