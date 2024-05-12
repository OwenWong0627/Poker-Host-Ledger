import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Session } from '../db/models';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getPlayerName } from '../db/players';
import { useDatabase } from '../context/DatabaseContext';
import { useNavigation } from '@react-navigation/native';
import { getPlayersForSession } from '../db/sessionPlayer';
// import SessionDetailsModal from '../modals/SessionDetailsModal';

interface SessionCardProps {
  item: Session;
  onDelete: (id: number) => void;
}

const SessionCard: React.FC<SessionCardProps> = ({ item, onDelete }) => {
  const navigation = useNavigation();
  const db = useDatabase();
  const [hostName, setHostName] = useState('');
  const [cashIn, setCashIn] = useState(0);
  const [cashOut, setCashOut] = useState(0);

  useEffect(() => {
    const fetchHostName = async () => {
      try {
        if (item.host) {
          setHostName(await getPlayerName(db, item.host))
        }
      } catch (error) {
        console.error('Failed to fetch host:', error);
      }
    };

    const fetchCashInOut = async () => {
      try {
        if (item.id) {
          const players = await getPlayersForSession(db, item.id);
          console.log('players:', players)
          const cashIn = players.reduce((acc, player) => acc + player.cash_in, 0);
          const cashOut = players.reduce((acc, player) => acc + player.cash_out, 0);
          setCashIn(cashIn);
          setCashOut(cashOut);
        }
      } catch (error) {
        console.error('Failed to fetch players:', error);
      }
    }

    fetchHostName();
    fetchCashInOut();
  }, [db]);

  const handleDeleteSession = async (sessionId: number) => {
    await onDelete(sessionId);
  };

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('SessionDetailsScreen', { sessionId: item.id })}
    >
      {/* <SessionDetailsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        player={player}
        onDelete={handleDeletePlayer}
      /> */}
      <View style={styles.sessionItem}>
        <View style={styles.sessionDetails}>
          <Text style={styles.sessionDate}>{item.date}</Text>
          <Text>Stakes: {item.stakes}</Text>
          {/* <Text style={styles.sessionCashIn}>Cash In: ${cashIn.toFixed(2)}</Text>
          <Text style={styles.sessionCashOut}>Cash Out: ${cashOut.toFixed(2)}</Text> */}
          <Text style={styles.sessionLocation}>Location: {item.location}</Text>
          <Text style={styles.sessionLocation}>Host: {hostName}</Text>
        </View>
        <TouchableOpacity onPress={() => onDelete(item.id!)} style={styles.addButton}>
          <MaterialIcons name="delete" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  sessionItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sessionDetails: {
    flex: 1,
  },
  sessionDate: {
    fontWeight: 'bold',
  },
  sessionCashIn: {
    color: 'green',
  },
  sessionCashOut: {
    color: 'red',
  },
  sessionLocation: {
    fontStyle: 'italic',
  },
  addButton: {
    marginLeft: 10,
    padding: 10,
  },
  addButtonText: {
    fontSize: 24,
  },
});

export default SessionCard;
