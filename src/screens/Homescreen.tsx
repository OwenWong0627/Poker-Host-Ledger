import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AddButton from '../components/AddButton';
import DiamondDate from '../components/DiamondDate';

const HomeScreen = () => {

  const [dates, setDates] = useState(['Jan 11', 'May 10', 'Apr 1', 'Feb 30']);

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
    <View style={styles.container}>
      {/* Logo Section */}
      <Text style={styles.logo}>LOGO</Text>

      {/* Circle Icons Section */}
      <View style={styles.iconRow}>
        <View style={styles.circleIcon} />
        <Text style={styles.iconText}>Label</Text>
        <View style={styles.circleIcon} />
        <Text style={styles.iconText}>Label</Text>
      </View>

      {/* Diamond Icons Section */}
      <View style={styles.diamondWrapper}>
        <View style={styles.diamondRow}>
          {renderRowOfDates(firstRow)}
        </View>
        <View style={[styles.diamondRow, dates.length === 4 && {marginTop: 25}]}>
          {renderRowOfDates(secondRow)}
        </View>
      </View>

      {/* Buttons Section */}
      <AddButton
        title="Add Session"
        onPress={() => {}}
        buttonBackgroundColor='black'
        buttonTextColor='white'
        activeOpacity={0.4}
      />
      <AddButton
        title="Add Player"
        onPress={() => {}}
        buttonBackgroundColor='white'
        buttonTextColor='black'
        activeOpacity={0.8}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 24,
    marginBottom: 20,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  circleIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ddd',
  },
  iconText: {
    fontSize: 16,
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
  diamondIcon: {
    width: 65,
    height: 65,
    backgroundColor: '#ddd',
    marginHorizontal: 15,
    borderRadius: 15,
    transform: [{ rotate: '45deg' }],
  },
  diamondTextContainer: {
    marginLeft: 2,
    marginTop: 5,
    transform: [{ rotate: '-45deg' }],
  },
  diamondMonth: {
    fontSize: 25,
    textAlign: 'center',
  },
  diamondDay: {
    fontSize: 15,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default HomeScreen;
