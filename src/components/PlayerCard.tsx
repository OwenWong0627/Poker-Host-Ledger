import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TouchableWithoutFeedback } from 'react-native';
import CardField from './CardField';

interface PlayerCardProps {
  id: string;
  name: string;
  profit: number;
  favHandRank1: string;
  favHandSuit1: string;
  favHandRank2: string;
  favHandSuit2: string;
}


const PlayerCard: React.FC<PlayerCardProps> = ({ id, name, profit, favHandRank1, favHandSuit1, favHandRank2, favHandSuit2 }) => {
  
  const addDollarSign = (amount: number) => {
    if (amount < 0) {
      return '-$' + Math.abs(amount).toFixed(2);
    }
    else {
      return '+$' + amount.toFixed(2);
    }
  };

  return (
    <View style={styles.gridItem}>
      <TouchableOpacity style={styles.gridTextField} >
        <Text style={styles.gridItemName}>{name}</Text>
        <Text>{addDollarSign(profit)}</Text>
      </TouchableOpacity>
      <View style={styles.favHandField}>
        <CardField
          id={id}
          favHandIndex={0}
          favHandRank={favHandRank1}
          favHandSuit={favHandSuit1}
        />
        <CardField
          id={id}
          favHandIndex={1}
          favHandRank={favHandRank2}
          favHandSuit={favHandSuit2}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gridItem: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ddd',
    borderRadius: 10,
    paddingBottom: 10,
    margin: 5,
    width: 120, // Set your desired width
    height: 120, // Set your desired height
  },
  gridTextField: {
    width: '100%',
    flex: 1,
    backgroundColor: '#eee',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  gridItemName: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  suitsImage: {
    width: 20, // Set your desired image width
    height: 20, // Set your desired image height
  },
  favHandField: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 7,
  },
  favHandCard: {
    width: 50,
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eee',
    padding: 3,
    borderRadius: 5,
    // borderColor: 'black',
    // borderWidth: 1,
  },
  favHandRank: {
    fontSize: 15,
    paddingRight: 5,
    fontWeight: 'bold',
  },
});

export default PlayerCard;
