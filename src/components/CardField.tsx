import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { selectGridItem, toggleKeyboard } from '../redux/actions';
import { AppState } from '../redux/store';
import { suitImages } from '../utils/constants';

interface CardFieldProps {
  id: number;
  favHandIndex: number;
  favHandRank: string;
  favHandSuit: string;
}

const CardField: React.FC<CardFieldProps> = ({ id, favHandIndex, favHandRank, favHandSuit }) => {

  // Use useDispatch to create a dispatch function
  const dispatch = useDispatch();

  const isSelectedIndex = useSelector((state: AppState) => 
    state.grid.players.find((item) => item.id === id)?.hand.findIndex(hand => hand.selected)
  );

  // Function to handle the selection of a player card
  const handleSelectPlayerCard = () => {
    dispatch(selectGridItem(id, favHandIndex));
    dispatch(toggleKeyboard(isSelectedIndex !== favHandIndex, favHandRank, favHandSuit));
  };

  return (
    <TouchableWithoutFeedback onPress={() => handleSelectPlayerCard()}>
      <View style={[styles.favHandCard, isSelectedIndex === favHandIndex && { borderColor: 'blue', borderWidth: 5 }]}>
        <Text style={styles.favHandRank}>{favHandRank}</Text>
        <Image
          style={styles.suitsImage}
          source={suitImages[favHandSuit]}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  suitsImage: {
    width: 20,
    height: 20,
  },
  favHandCard: {
    width: 45,
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eee',
    borderRadius: 5,
  },
  favHandRank: {
    fontSize: 15,
    paddingRight: 5,
    fontWeight: 'bold',
  },
});

export default CardField;
