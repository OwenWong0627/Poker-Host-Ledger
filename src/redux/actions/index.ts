import { SELECT_GRID_ITEM, SET_INITIAL_PLAYERS_STATE, TOGGLE_KEYBOARD, RESET_GRID } from './actionTypes';

export const selectGridItem = (playerId: number, favHandIndex: number) => ({
  type: SELECT_GRID_ITEM,
  payload: { playerId, favHandIndex },
});

export const setInitialPlayersState = (players: any) => ({
  type: SET_INITIAL_PLAYERS_STATE,
  payload: players,
});

export const toggleKeyboard = (visible: boolean, selectedRank: string, selectedSuit: string) => ({
  type: TOGGLE_KEYBOARD,
  payload: { visible, selectedRank, selectedSuit},
});

export const resetGrid = () => ({
  type: RESET_GRID,
});