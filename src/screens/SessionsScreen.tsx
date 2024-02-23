import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, SafeAreaView, FlatList } from 'react-native';
import PageHeader from '../components/PageHeader';
import { Player, Session } from '../db/models';
import { useDatabase } from '../context/DatabaseContext';
import { getSessions } from '../db/sessions';
import SessionCard from '../components/SessionCard';

const SessionsScreen = ({ navigation }: { navigation: any }) => {
  const db = useDatabase();
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    const players = [
      { name: "John Smith", profit: -200, favHandRank1: "?", favHandSuit1: "suits", favHandRank2: "?", favHandSuit2: "suits", playerNotes: "Aggressive playstyle" },
      { name: "John Doe", profit: 100, favHandRank1: "A", favHandSuit1: "hearts", favHandRank2: "K", favHandSuit2: "spades", playerNotes: "Very strategic" },
      { name: "Jane Smith", profit: -0, favHandRank1: "Q", favHandSuit1: "diamonds", favHandRank2: "J", favHandSuit2: "clubs", playerNotes: "Aggressive playstyle" },
    ];

    const loadData = async () => {
      try {
        const fetchedSessions = await getSessions(db); // Adjust getPlayers to accept SQLite.Database directly
        setSessions(fetchedSessions);
      } catch (error) {
        console.error('load Data error', error);
      }
    };
    loadData();
  }, [db]);

  return (
    <SafeAreaView style={styles.container}>
      <PageHeader navigation={navigation} pageName='Sessions' setSessions={(updatedSessions: Session[]) => setSessions(updatedSessions)}/>
      <FlatList
        data={sessions}
        renderItem={({ item }) => (
          <SessionCard
            item={item}
          />
        )}
        keyExtractor={(item: Session) => item.id?.toString() ?? ''}
      />
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  grid: {
    alignItems: 'center',
  },
});

export default SessionsScreen;
