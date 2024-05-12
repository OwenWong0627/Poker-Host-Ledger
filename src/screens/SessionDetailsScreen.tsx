import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button } from 'react-native';
import { SessionPlayerDetail } from '../db/models';
import { getPlayersForSession, addPlayerToSession } from '../db/sessionPlayer';
import { useDatabase } from '../context/DatabaseContext';
import AddPlayerModal from '../modals/AddPlayerModal';
import { getPlayerName } from '../db/players';
import PlayerCollapsible from '../components/PlayerCollapsible';
import PageHeader from '../components/PageHeader';

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
      {/* <PageHeader /> */}
      <AddPlayerModal
        visible={modalVisible}
        onAddExistingPlayer={handleAddExistingPlayer}
        onClose={() => setModalVisible(false)}
      />
      {/* Header showing total cash in/out */}
      <View style={styles.cashouts}>
        <Text>Total In: <Text style={{fontWeight: 'bold'}}>${totalCashIn}</Text></Text>
        <Text>Total Out: <Text style={{fontWeight: 'bold'}}>${totalCashOut}</Text></Text>
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
    // paddingTop: 0,
    padding: 10,
  },
});


export default SessionDetailsScreen;
