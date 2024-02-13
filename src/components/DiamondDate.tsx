import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface DiamondDateProps {
  onPress: () => void;
  month: string;
  day: string;
}

const DiamondDate: React.FC<DiamondDateProps> = ({ onPress, month, day }) => {

  return (
    <TouchableOpacity style={styles.diamondIcon} >
      <View style={styles.diamondTextContainer}>
        <Text style={styles.diamondMonth}>{month}</Text>
        <Text style={styles.diamondDay}>{day}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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

export default DiamondDate;
