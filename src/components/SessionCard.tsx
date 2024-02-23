import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Session } from '../db/models';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getPlayerName, getPlayers } from '../db/players';
import { useDatabase } from '../context/DatabaseContext';

interface SessionCardProps {
  item: Session;
}

const SessionCard: React.FC<SessionCardProps> = ({ item }) => {
  const db = useDatabase();
  const [hostName, setHostName] = useState('');

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

    fetchHostName();
  }, [db]);

  return (
    <TouchableOpacity onPress={() => console.log('go to session page')}>
      <View style={styles.sessionItem}>
        <View style={styles.sessionDetails}>
          <Text style={styles.sessionDate}>{item.date}</Text>
          <Text style={styles.sessionCashIn}>Cash In: ${item.cashIn.toFixed(2)}</Text>
          <Text style={styles.sessionCashOut}>Cash Out: ${item.cashOut.toFixed(2)}</Text>
          <Text style={styles.sessionLocation}>Location: {item.location}</Text>
          <Text style={styles.sessionLocation}>Host: {hostName}</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <MaterialIcons name="edit" size={24} color="black" />
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
