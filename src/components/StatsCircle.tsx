import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface StatsCircleProps {
  amount: string;
  subtext: string;
}

const StatsCircle: React.FC<StatsCircleProps> = ({ amount, subtext }) => {

  return (
    <View style={styles.statItem}>
      <View style={styles.circleIcon}>
        <Text style={styles.iconText}>{amount}</Text>
      </View>
      <Text style={styles.statText}>{subtext}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  statItem: {
    alignItems: 'center',
  },
  circleIcon: {
    width: 65,
    height: 65,
    borderRadius: 35,
    backgroundColor: '#ddd',
    marginHorizontal: 25,
    marginBottom: 8, // Add space between the icon and the text
    justifyContent: 'center', // Center the child text vertically
    alignItems: 'center', // Center the child text horizontally
  },
  iconText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statText: {
    width: '100%',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default StatsCircle;
