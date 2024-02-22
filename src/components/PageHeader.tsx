import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { resetGrid, toggleKeyboard } from '../redux/actions';
import { Player } from '../db/models';
import AddPlayerModal from './AddPlayerModal';
import { addPlayer, getPlayers } from '../db/players';
import { useDatabase } from '../context/DatabaseContext';

interface PageHeaderProps {
  navigation: any;
  setPlayers: (players: Player[]) => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ navigation, setPlayers }) => {
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
    setPlayers(await getPlayers(db));
  };

  return (
    <View style={styles.header}>
      <AddPlayerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddPlayer}
      />
      <TouchableOpacity style={styles.headerButton} onPress={handleReturn}>
        <Text style={styles.buttonText}>←</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.headerButton} onPress={() => setModalVisible(true)}>
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
