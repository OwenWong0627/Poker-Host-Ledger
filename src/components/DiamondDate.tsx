import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface DiamondDateProps {
  onPress: () => void;
  month: string;
  day: string;
}

const DiamondDate: React.FC<DiamondDateProps> = ({ onPress, month, day }) => {

  return (
    <TouchableOpacity style={styles.diamondIcon} onPress={onPress}>
      <View style={styles.diamondTextContainer}>
        <Text style={styles.diamondMonth}>{month}</Text>
        <Text style={styles.diamondDay}>{day}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  diamondIcon: {
    width: 70,
    height: 70,
    backgroundColor: '#ddd',
    marginHorizontal: 15,
    borderRadius: 15,
    transform: [{ rotate: '45deg' }],
  },
  diamondTextContainer: {
    marginLeft: 0,
    marginTop: 7,
    transform: [{ rotate: '-45deg' }],
  },
  diamondMonth: {
    fontSize: 20,
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
