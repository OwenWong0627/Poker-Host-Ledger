import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, SafeAreaView, Animated } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import PlayerCard from '../components/PlayerCard';
import CustomKeyboard from '../components/CustomKeyboard';
import PageHeader from '../components/PageHeader';
import { AppState } from '../redux/store';
import { setInitialPlayersState, toggleKeyboard } from '../redux/actions';
import { addPlayer, getPlayers, updatePlayerCard } from '../db/players';
import { Player } from '../db/models';
import { useDatabase } from '../context/DatabaseContext';

const PlayerScreen = ({ navigation }: { navigation: any }) => {
  const dispatch = useDispatch();
  const db = useDatabase();
  const gridData = useSelector((state: AppState) => state.grid);
  const [players, setPlayers] = useState<Player[]>([]);
  // const players = [
  //   { id: 1, name: "John Smith", profit: -200, favHandRank1: "?", favHandSuit1: "suits", favHandRank2: "?", favHandSuit2: "suits", playerNotes: "Aggressive playstyle" },
  //   { id: 2, name: "John Doe", profit: 100, favHandRank1: "A", favHandSuit1: "hearts", favHandRank2: "K", favHandSuit2: "spades", playerNotes: "Very strategic" },
  //   { id: 3, name: "Jane Smith", profit: -0, favHandRank1: "Q", favHandSuit1: "diamonds", favHandRank2: "J", favHandSuit2: "clubs", playerNotes: "Aggressive playstyle" },
  // ];
  useEffect(() => {
    dispatch(setInitialPlayersState(players));
  }, [players.length]);
  useEffect(() => {

    const loadData = async () => {
      try {
        const storedPlayers = await getPlayers(db); // Adjust getPlayers to accept SQLite.Database directly
        
        if (storedPlayers.length) {
          setPlayers(storedPlayers);
        } else {
          console.log('Adding new players to the empty database')
          await addPlayer(db, 
            { name: "Host", favHandRank1: "?", favHandSuit1: "suits", favHandRank2: "?", favHandSuit2: "suits", playerNotes: "" }
          );
          setPlayers(await getPlayers(db));
        }
      } catch (error) {
        console.error('load Data error', error);
      }
    };

    loadData();
  }, [db]);

  const isKeyboardVisible = useSelector((state: AppState) => state.ui.isKeyboardVisible);
  const selectedRank = useSelector((state: AppState) => state.ui.selectedRank);
  const selectedSuit = useSelector((state: AppState) => state.ui.selectedSuit);
  const keyboardHeight = new Animated.Value(0);
  
  const selectedPlayer = gridData.players.find(player =>
    player.hand.some(hand => hand.selected)
  );

  const selectedPlayerKey = selectedPlayer?.id;
  const selectedHandIndex = selectedPlayer
    ? selectedPlayer.hand.findIndex(hand => hand.selected)
    : -1;
    
  const handleSelect = async (rankOrSuit: 'rank' | 'suit', newValue: string) => {
    if (selectedPlayerKey !== null) {
      if (rankOrSuit === 'rank') {
        await updatePlayerCard(db, {
          id: selectedPlayerKey ? Number(selectedPlayerKey) : undefined,
          name: '',
          favHandRank1: newValue,
          favHandSuit1: selectedSuit,
          favHandRank2: newValue,
          favHandSuit2: selectedSuit,
          playerNotes: ''
        }, selectedHandIndex);
        setPlayers(await getPlayers(db));
        dispatch(toggleKeyboard(true, newValue, selectedSuit));
      } else if (rankOrSuit === 'suit') {
        await updatePlayerCard(db, {
          id: selectedPlayerKey ? Number(selectedPlayerKey) : undefined,
          name: '',
          favHandRank1: selectedRank,
          favHandSuit1: newValue,
          favHandRank2: selectedRank,
          favHandSuit2: newValue,
          playerNotes: ''
        }, selectedHandIndex);
        setPlayers(await getPlayers(db));
        dispatch(toggleKeyboard(true, selectedRank, newValue));
      }
    }
  };
  const handleSelectReset = async () => {
    if (selectedPlayerKey !== null) {
      await updatePlayerCard(db, {
        id: selectedPlayerKey ? Number(selectedPlayerKey) : undefined,
        name: '',
        favHandRank1: '?',
        favHandSuit1: 'suits',
        favHandRank2: '?',
        favHandSuit2: 'suits',
        playerNotes: ''
      }, selectedHandIndex);
      setPlayers(await getPlayers(db));
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
      <PageHeader navigation={navigation} pageName='Players' setPlayers={(updatedPlayers: Player[]) => setPlayers(updatedPlayers)}/>
      <FlatList
        data={players}
        renderItem={({ item }) => (
          <PlayerCard
            id={item.id ?? 0}
            name={item.name}
            profit={0}
            favHandRank1={item.favHandRank1}
            favHandSuit1={item.favHandSuit1}
            favHandRank2={item.favHandRank2}
            favHandSuit2={item.favHandSuit2}
            playerNotes={item.playerNotes}
            setPlayers={(updatedPlayers: Player[]) => setPlayers(updatedPlayers)}
          />
        )}
        numColumns={3}
        keyExtractor={(item) => item.id?.toString() ?? ''}
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
            onSelectKey={handleSelect}
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
    backgroundColor: 'white',
  },
  grid: {
    alignItems: 'center',
  },
});

export default PlayerScreen;
