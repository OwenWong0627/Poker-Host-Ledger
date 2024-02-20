import { SELECT_GRID_ITEM, TOGGLE_KEYBOARD, UPDATE_PLAYER_RANK, UPDATE_PLAYER_SUIT, RESET_GRID } from './actionTypes';

export const selectGridItem = (key: string, favHandIndex: number) => ({
  type: SELECT_GRID_ITEM,
  payload: { key, favHandIndex },
});

export const toggleKeyboard = (visible: boolean, selectedRank: string, selectedSuit: string) => ({
  type: TOGGLE_KEYBOARD,
  payload: { visible, selectedRank, selectedSuit},
});

export const updatePlayerRank = (key: string, handIndex: number, rank: string) => ({
  type: UPDATE_PLAYER_RANK,
  payload: { key, handIndex, rank },
});

export const updatePlayerSuit = (key: string, handIndex: number, suit: string) => ({
  type: UPDATE_PLAYER_SUIT,
  payload: { key, handIndex, suit },
});

export const resetGrid = () => ({
  type: RESET_GRID,
});