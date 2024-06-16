import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button } from 'react-native';
import { SessionPlayerDetail } from '../db/models';
import { getPlayersForSession, addPlayerToSession } from '../db/sessionPlayer';
import { useDatabase } from '../context/DatabaseContext';
import AddPlayerModal from '../modals/AddPlayerModal';
import { getPlayerName } from '../db/players';
import PlayerCollapsible from '../components/PlayerCollapsible';

interface SessionDetailsProps {
  route: any;
}

const SessionDetailsScreen: React.FC<SessionDetailsProps> = ({ route }) => {
  const db = useDatabase();
  const { sessionId } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [sessionDetails, setSessionDetails] = useState<SessionPlayerDetail[]>([]);
  const [sessionPlayerNames, setSessionPlayerNames] = useState<string[]>([]);
  const [totalCashIn, setTotalCashIn] = useState<number>(0);
  const [totalCashOut, setTotalCashOut] = useState<number>(0);

  const fetchSessionDetails = async () => {
    const details = await getPlayersForSession(db, sessionId);
    const playerNames = await Promise.all(details.map(async detail => getPlayerName(db, detail.player_id)));
    setSessionPlayerNames(playerNames);
    setSessionDetails(details);
    const totalIn = details.reduce((acc, detail) => acc + detail.cash_in, 0);
    const totalOut = details.reduce((acc, detail) => acc + detail.cash_out, 0);
    setTotalCashIn(totalIn);
    setTotalCashOut(totalOut);
  };

  const handleAddExistingPlayer = async (newPlayerId: number) => {
    const playerIds = sessionDetails.map(sessionDetails => sessionDetails.player_id);
    if (!playerIds.includes(newPlayerId)) {
      console.log('Adding player to session:', newPlayerId);
      await addPlayerToSession(db, sessionId, newPlayerId || 0, 0, 0);
      fetchSessionDetails();
    }
    else {
      console.log('Player already in session:', newPlayerId);
    }
  };
  

  useEffect(() => {
    fetchSessionDetails();
  }, [db, sessionId]);

  return (
    <View style={styles.container}>
      <AddPlayerModal
        visible={modalVisible}
        onAddExistingPlayer={handleAddExistingPlayer}
        onClose={() => setModalVisible(false)}
      />
      <View style={styles.cashouts}>
        <Text style={styles.totalLabel}>Total In: <Text style={styles.totalValue}>${totalCashIn.toFixed(2)}</Text></Text>
        <Text style={styles.totalLabel}>Total Out: <Text style={styles.totalValue}>${totalCashOut.toFixed(2)}</Text></Text>
      </View>
      <FlatList
        data={sessionDetails}
        keyExtractor={(item) => item.player_id.toString()}
        renderItem={({ item, index }) => (
          <PlayerCollapsible
            sessionPlayerDetail={item}
            playerName={sessionPlayerNames[index]}
            fetchSessionDetails={fetchSessionDetails}
          />
        )}
      />
      <Button title="Add Player" onPress={() => setModalVisible(true)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 25,
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
  },
  cashouts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    marginBottom: 10, // Added for spacing between the totals
  },
  totalValue: {
    fontWeight: 'bold',
    color: '#4CAF50', // A greenish tone for emphasis
  },
});


export default SessionDetailsScreen;
