import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';

import AddButton from '../components/AddButton';
import DiamondDate from '../components/DiamondDate';
import StatsCircle from '../components/StatsCircle';
import { useDatabase } from '../context/DatabaseContext';
import { getSessions } from '../db/sessions';
import { addDollarSign } from '../utils/helpers';
import { getPlayers } from '../db/players';
import { calculateTotalMoneyLost, getPlayerProfit } from '../db/sessionPlayer';
import { useFocusEffect } from '@react-navigation/native';
import { Session } from '../db/models';

const HomeScreen = ({navigation}: {navigation: any}) => {
  const db = useDatabase();

  // const [dates, setDates] = useState(['Jan 11', 'May 10', 'Apr 1', 'Feb 30', 'Dec 29']);
  const [hostProfit, setHostProfit] = useState(0);
  const [recentSessions, setRecentSessions] = useState<Session[]>([]);
  const [numOfSessions, setNumOfSessions] = useState(0);
  const [moneyLost, setMoneyLost] = useState(0);

  const splitDatesIntoRows = (datesArray: Session[]) => {
    const displayDates = datesArray.length > 5 ? datesArray.slice(0, 5) : datesArray;
    const firstRowDatesCount = displayDates.length === 4 ? 2 : displayDates.length >= 3 ? 3 : displayDates.length;
    const firstRow = displayDates.slice(0, firstRowDatesCount);
    const secondRow = displayDates.slice(firstRowDatesCount);
    return { firstRow, secondRow };
  };

  const { firstRow, secondRow } = splitDatesIntoRows(recentSessions);

  const renderRowOfDates = (recentSessions: Session[]) => {
    return recentSessions.map((session, index) => {
      return (
        <DiamondDate
          key={session.id}
          month={new Date(session.date).toLocaleString('default', { month: 'short' })}
          day={new Date(session.date).getDate().toString()}
          onPress={() => session && navigation.navigate('SessionDetailsScreen', { sessionId: session.id })}
        />
      );
    });
  };

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          const fetchedSessions = await getSessions(db);
          const totalSessions = fetchedSessions.length;
          setNumOfSessions(totalSessions);
          setRecentSessions(fetchedSessions);
          
          const moneyLost = await calculateTotalMoneyLost(db);
          setMoneyLost(moneyLost);
          
          const fetchedPlayers = await getPlayers(db);
          const host = fetchedPlayers.find(player => player.id === 1);
          if (host) {
            setHostProfit(await getPlayerProfit(db, host.id || 1));
          }
        } catch (error) {
          console.error('load Data error', error);
        }
      };
      loadData();
    }, [db])
  );

  return (
    <View style={styles.screen}>
      <ScrollView>
        <View style={styles.container}>
          <Image
            style={styles.logo}
            source={require('../assets/poker.png')}
          />

          {/* Stats Section */}
          <View style={styles.statsRow}>
            <StatsCircle amount={addDollarSign(hostProfit)} subtext="Lifetime +/-" />
            {numOfSessions === 1 ?
              <StatsCircle amount={numOfSessions.toString()} subtext="Session" /> :
              <StatsCircle amount={numOfSessions.toString()} subtext="Sessions" />
            }
            <StatsCircle amount={addDollarSign(moneyLost)} subtext="Money Lost" />
          </View>

          {/* Recent Sessions Section */}
          <View style={styles.diamondWrapper}>
            <View style={styles.diamondRow}>
              {renderRowOfDates(firstRow)}
            </View>
            <View style={[styles.diamondRow, recentSessions.length === 4 && {marginTop: 25}]}>
              {renderRowOfDates(secondRow)}
            </View>
          </View>

          {/* Add Buttons Section */}
          <AddButton
            title="Add Session"
            onPress={() =>
              navigation.navigate('Sessions')
            }
            buttonBackgroundColor='black'
            buttonTextColor='white'
            activeOpacity={0.4}
          />
          <AddButton
            title="Add Player"
            onPress={() =>
              navigation.navigate('Players')
            }
            buttonBackgroundColor='white'
            buttonTextColor='black'
            activeOpacity={0.8}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 250,
    height: 200,
    resizeMode: 'contain',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  diamondWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 75,
  },
  diamondRow: {
    flexDirection: 'row',
  },
});

export default HomeScreen;
