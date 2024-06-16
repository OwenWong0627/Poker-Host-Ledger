import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Session } from '../db/models';
import { getPlayerName } from '../db/players';
import { getPlayersForSession } from '../db/sessionPlayer';
import { useDatabase } from '../context/DatabaseContext';
import { useNavigation } from '@react-navigation/native';

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
  }, [item, db]);

  const formatDateDisplay = (isoDate: string | number | Date) => {
    const date = new Date(isoDate);
    return { 
      day: date.getDate(), 
      month: date.toLocaleString('default', { month: 'short' }) 
    };
  };

  const { day, month } = formatDateDisplay(item.date);

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('SessionDetailsScreen', { sessionId: item.id })}
      style={styles.sessionItem}
    >
       <View style={styles.dateContainer}>
        <Text style={styles.sessionDay}>{day}</Text>
        <Text style={styles.sessionMonth}>{month}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <MaterialIcons name="person" size={20} color="#666" />
          <Text style={styles.detailText}>{hostName}</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialIcons name="arrow-upward" size={20} color="#4CAF50" />
          <Text style={styles.detailText}>${cashIn.toFixed(2)}</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialIcons name="arrow-downward" size={20} color="#F44336" />
          <Text style={styles.detailText}>${cashOut.toFixed(2)}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => onDelete(item.id!)} style={styles.iconButton}>
        <MaterialIcons name="delete" size={24} color="red" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  sessionItem: {
    flexDirection: 'row',
    padding: 10,
    margin: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateContainer: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
    marginRight: 12,
  },
  sessionDay: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  sessionMonth: {
    fontSize: 16,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailText: {
    marginLeft: 5,
    fontSize: 16,
  },
  iconButton: {
    padding: 10,
  },
});

export default SessionCard;
