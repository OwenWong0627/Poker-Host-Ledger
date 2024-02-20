import React, { useState } from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';

import AddButton from '../components/AddButton';
import DiamondDate from '../components/DiamondDate';
import StatsCircle from '../components/StatsCircle';

const HomeScreen = ({navigation}: {navigation: any}) => {

  const [dates, setDates] = useState(['Jan 11', 'May 10', 'Apr 1', 'Feb 30', 'Dec 29']);

  const splitDatesIntoRows = (datesArray: string[]) => {
    const displayDates = datesArray.length > 5 ? datesArray.slice(0, 5) : datesArray;
    const firstRowDatesCount = displayDates.length === 4 ? 2 : displayDates.length >= 3 ? 3 : displayDates.length;
    const firstRow = displayDates.slice(0, firstRowDatesCount);
    const secondRow = displayDates.slice(firstRowDatesCount);
    return { firstRow, secondRow };
  };

  const { firstRow, secondRow } = splitDatesIntoRows(dates);

  const renderRowOfDates = (rowOfDates: string[]) => {
    return rowOfDates.map((date, index) => {
      const [month, day] = date.split(' ');
      return (
        <DiamondDate
          key={index}
          month={month}
          day={day}
          onPress={() => console.log(`Pressed on ${date}`)}
        />
      );
    });
  };

  return (
    <View style={styles.screen}>
      <ScrollView>
        <View style={styles.container}>
          {/* Logo Section */}
          <Image
            style={styles.logo}
            source={require('../assets/poker-logo.png')}
          />

          {/* Stats Section */}
          <View style={styles.statsRow}>
            <StatsCircle amount="+$426.85" subtext="Lifetime +/-" />
            <StatsCircle amount="20" subtext="Sessions" />
            <StatsCircle amount="-$20.50" subtext="Money Lost" />
          </View>

          {/* Recent Sessions Section */}
          <View style={styles.diamondWrapper}>
            <View style={styles.diamondRow}>
              {renderRowOfDates(firstRow)}
            </View>
            <View style={[styles.diamondRow, dates.length === 4 && {marginTop: 25}]}>
              {renderRowOfDates(secondRow)}
            </View>
          </View>

          {/* Add Buttons Section */}
          <AddButton
            title="Add Session"
            onPress={() => {}}
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
