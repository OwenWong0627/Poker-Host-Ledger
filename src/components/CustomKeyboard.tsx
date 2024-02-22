import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { suitImages } from '../utils/constants';

interface CustomKeyboardProps {
  onSelectKey: (rankOrSuit: 'rank' | 'suit', newValue: string) => void;
  onSelectReset: () => void;
  selectedRank: string;
  selectedSuit: string;
}

const ranks = ['2', '3', '4', '5', '6', '7', '8', '?', '9', 'T', 'J', 'Q', 'K', 'A'];
const suits = ['hearts', 'diamonds', 'clubs', 'spades'];

const CustomKeyboard: React.FC<CustomKeyboardProps>  = ({ onSelectKey, onSelectReset, selectedRank, selectedSuit }) => {
  
  const handlePressRank = (rank: string) => {
    if (rank === '?') {
      onSelectReset();
    } else {
      onSelectKey('rank', rank);
    }
  };

  return (
    <View style={styles.keyboardContainer}>
      <View style={styles.rankContainer}>
        {ranks.map((rank) => (
          <TouchableOpacity
            key={rank}
            style={[styles.rankKey, (selectedRank === rank && selectedRank !== '?') ? { borderColor: 'blue', borderWidth: 5 } : {}]}
            onPress={() => handlePressRank(rank)}
          >
            <Text style={[styles.keyText, rank === '?' && {color: 'yellow'} ]}>{rank}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.suitContainer}>
        {suits.map((suit) => (
          <TouchableOpacity
            key={suit}
            style={[styles.suitsKey, selectedSuit === suit ? { borderColor: 'blue', borderWidth: 5 } : {}]}
            onPress={() => onSelectKey('suit', suit)}
          >
            <Image
              style={styles.suitsImage}
              source={suitImages[suit]}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  suitsImage: {
    width: 20,
    height: 20,
  },
  keyboardContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rankContainer: {
    width: '80%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  suitContainer: {
    width: '20%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  rankKey: {
    width: '12%',
    height: 40,
    margin: 1,
    borderWidth: 1,
    backgroundColor: 'black',
    borderColor: '#ccc',
    borderRadius: 5,
    justifyContent: 'center',
  },
  suitsKey: {
    width: '47%',
    height: 40,
    margin: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
  },
});

export default CustomKeyboard;
