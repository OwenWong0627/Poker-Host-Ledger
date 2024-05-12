import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, FlatList } from 'react-native';
import PageHeader from '../components/PageHeader';
import { Session } from '../db/models';
import { useDatabase } from '../context/DatabaseContext';
import { deleteSession, getSessions } from '../db/sessions';
import SessionCard from '../components/SessionCard';

const SessionsScreen = ({ navigation }: { navigation: any }) => {
  const db = useDatabase();
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {

    const loadData = async () => {
      try {
        const fetchedSessions = await getSessions(db);
        setSessions(fetchedSessions);
      } catch (error) {
        console.error('load Data error', error);
      }
    };
    loadData();
  }, [db]);

  const handleDeleteSession = async (sessionId: number) => {
    console.log("Delete session with ID:", sessionId);
    await deleteSession(db, sessionId);
    setSessions(await getSessions(db));
  };

  return (
    <SafeAreaView style={styles.container}>
      <PageHeader navigation={navigation} pageName='Sessions' setSessions={(updatedSessions: Session[]) => setSessions(updatedSessions)}/>
      <FlatList
        data={sessions}
        renderItem={({ item }) => (
          <SessionCard
            item={item}
            onDelete={handleDeleteSession}
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
