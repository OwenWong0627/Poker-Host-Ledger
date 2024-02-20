import React, { useEffect } from 'react';
import { StyleSheet, FlatList, SafeAreaView, Animated } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../redux/store';

import PlayerCard from '../components/PlayerCard';
import CustomKeyboard from '../components/CustomKeyboard';
import { toggleKeyboard, updatePlayerRank, updatePlayerSuit } from '../redux/actions';
import PageHeader from '../components/PageHeader';

const PlayerScreen = ({ navigation }: { navigation: any }) => {
  const gridData = useSelector((state: AppState) => state.grid);
  const isKeyboardVisible = useSelector((state: AppState) => state.ui.isKeyboardVisible);
  const selectedRank = useSelector((state: AppState) => state.ui.selectedRank);
  const selectedSuit = useSelector((state: AppState) => state.ui.selectedSuit);
  const keyboardHeight = new Animated.Value(0);
  
  const selectedPlayer = gridData.find(player =>
    player.hand.some(hand => hand.selected)
  );

  const selectedPlayerKey = selectedPlayer?.key;
  const selectedHandIndex = selectedPlayer
    ? selectedPlayer.hand.findIndex(hand => hand.selected)
    : -1;
    
  const dispatch = useDispatch();
  const handleSelectRank = (rank: string) => {
    if (selectedPlayerKey !== null) {
      dispatch(updatePlayerRank(selectedPlayerKey ?? '', selectedHandIndex, rank));
      dispatch(toggleKeyboard(true, rank, selectedSuit));
    }
  };
  const handleSelectSuit = (suit: string) => {
    if (selectedPlayerKey !== null) {
      dispatch(updatePlayerSuit(selectedPlayerKey ?? '', selectedHandIndex, suit));
      dispatch(toggleKeyboard(true, selectedRank, suit));
    }
  };
  const handleSelectReset = () => {
    if (selectedPlayerKey !== null) {
      dispatch(updatePlayerRank(selectedPlayerKey ?? '', selectedHandIndex, '?'));
      dispatch(updatePlayerSuit(selectedPlayerKey ?? '', selectedHandIndex, 'suits'));
      dispatch(toggleKeyboard(true, '?', 'suits'));
    }
  }

  useEffect(() => {
    Animated.timing(keyboardHeight, {
      toValue: isKeyboardVisible ? 1 : 0, // 1 when visible, 0 when hidden
      duration: 300, // Duration of the animation
      useNativeDriver: true,
    }).start();
  }, [isKeyboardVisible]);

  const keyboardTranslateY = keyboardHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0], // Adjust these values based on the height of your keyboard
  });

  return (
    <SafeAreaView style={styles.container}>
      <PageHeader navigation={navigation}/>
      <FlatList
        data={gridData}
        renderItem={({ item }) => (
          <PlayerCard
            id={item.key}
            name={item.name}
            profit={item.profit}
            favHandRank1={item.hand[0].favHandRank}
            favHandSuit1={item.hand[0].favHandSuit}
            favHandRank2={item.hand[1].favHandRank}
            favHandSuit2={item.hand[1].favHandSuit}
          />
        )}
        numColumns={3}
        keyExtractor={(item) => item.key}
        contentContainerStyle={[styles.grid, { paddingBottom: isKeyboardVisible ? 120 : 0 }]}
      />
      {isKeyboardVisible && (
        <Animated.View
          style={{
            transform: [{ translateY: keyboardTranslateY }],
            position: 'absolute',
            bottom: 0,
            left: 0,
          }}
        >
          <CustomKeyboard
            onSelectRank={handleSelectRank}
            onSelectSuit={handleSelectSuit}
            onSelectReset={handleSelectReset}
            selectedRank={selectedRank}
            selectedSuit={selectedSuit}
          />
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: 'white',
  },
  grid: {
    alignItems: 'center',
  },
});

export default PlayerScreen;
