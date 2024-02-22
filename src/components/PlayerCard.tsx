import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TouchableWithoutFeedback } from 'react-native';
import CardField from './CardField';
import PlayerDetailsModal from './PlayerDetailsModal';
import { deletePlayer, getPlayers } from '../db/players';
import { useDatabase } from '../context/DatabaseContext';
import { Player } from '../db/models';
import { useDispatch } from 'react-redux';
import { toggleKeyboard } from '../redux/actions';

interface PlayerCardProps {
  id: number;
  name: string;
  profit: number;
  favHandRank1: string;
  favHandSuit1: string;
  favHandRank2: string;
  favHandSuit2: string;
  playerNotes: string;
  setPlayers: (players: Player[]) => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ id, name, profit, favHandRank1, favHandSuit1, favHandRank2, favHandSuit2, playerNotes, setPlayers }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const db = useDatabase();
  const dispatch = useDispatch();
  const player = { id, name, profit, favHandRank1, favHandSuit1, favHandRank2, favHandSuit2, playerNotes };

  const handleDeletePlayer = async (playerId: number) => {
    console.log("Delete player with ID:", playerId);
    await deletePlayer(db, playerId);
    setPlayers(await getPlayers(db));
    dispatch(toggleKeyboard(false, '?', 'suits')); // Close the keyboard after deletion
    setModalVisible(false); // Close the modal after deletion
  };
  
  const addDollarSign = (amount: number) => {
    if (amount < 0) {
      return '-$' + Math.abs(amount).toFixed(2);
    }
    else if (amount === undefined || amount === null) {
      return '$0.00';
    }
    else {
      return '+$' + amount.toFixed(2);
    }
  };

  return (
    <View style={styles.gridItem}>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.gridTextField} >
        <Text style={styles.gridItemName}>{name}</Text>
        <Text>{addDollarSign(profit)}</Text>
      </TouchableOpacity>
      <PlayerDetailsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        player={player}
        onDelete={handleDeletePlayer}
      />
      <View style={styles.favHandField}>
        <CardField
          id={id}
          favHandIndex={0}
          favHandRank={favHandRank1}
          favHandSuit={favHandSuit1}
        />
        <CardField
          id={id}
          favHandIndex={1}
          favHandRank={favHandRank2}
          favHandSuit={favHandSuit2}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gridItem: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ddd',
    borderRadius: 10,
    paddingBottom: 10,
    margin: 5,
    width: 120, // Set your desired width
    height: 120, // Set your desired height
  },
  gridTextField: {
    width: '100%',
    flex: 1,
    backgroundColor: '#eee',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  gridItemName: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  suitsImage: {
    width: 20, // Set your desired image width
    height: 20, // Set your desired image height
  },
  favHandField: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 7,
  },
  favHandCard: {
    width: 50,
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eee',
    padding: 3,
    borderRadius: 5,
    // borderColor: 'black',
    // borderWidth: 1,
  },
  favHandRank: {
    fontSize: 15,
    paddingRight: 5,
    fontWeight: 'bold',
  },
});

export default PlayerCard;
