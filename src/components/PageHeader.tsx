import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { resetGrid, toggleKeyboard } from '../redux/actions';
import { Player, Session } from '../db/models';
import AddPlayerModal from '../modals/AddPlayerModal';
import { addPlayer, getPlayers } from '../db/players';
import { useDatabase } from '../context/DatabaseContext';
import AddSessionModal from '../modals/AddSessionModal';
import { addSession, getSessions } from '../db/sessions';

interface PageHeaderProps {
  navigation: any;
  pageName: string;
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
      <AddPlayerModal
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
        <Text style={styles.buttonText}>←</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.headerButton} onPress={handleAddForm}>
        <Text style={styles.buttonText}>+</Text>
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
    marginTop: 35,
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
