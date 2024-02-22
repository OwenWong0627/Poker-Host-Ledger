// gridReducer.ts
import { Player } from '../../db/models';
import { SELECT_GRID_ITEM, SET_INITIAL_PLAYERS_STATE, RESET_GRID } from '../actions/actionTypes';

interface FavHand {
  selected: boolean;
}

interface PlayerState {
  id: number;
  hand: FavHand[];
}

type GridState = {
  players: PlayerState[];
}

type SelectGridItemAction = {
  type: typeof SELECT_GRID_ITEM;
  payload: {
    playerId: number;
    favHandIndex: number;
  };
};

type SetInitialPlayersStateAction = {
  type: typeof SET_INITIAL_PLAYERS_STATE;
  payload: Player[];
};

type ResetGridAction = {
  type: typeof RESET_GRID;
};

type Action = SelectGridItemAction | SetInitialPlayersStateAction | ResetGridAction;


const initialState: GridState = {
  players: [],
};

const transformPlayersForRedux = (dbPlayers: Player[]): GridState['players'] => {
  return dbPlayers.map(player => ({
    id: player.id || 0, // Assuming a default value of 0 for undefined id
    hand: [
      { selected: false }, // Assuming two cards per player as per your example
      { selected: false },
    ],
  }));
};

const gridReducer = (state = initialState, action: Action): GridState => {
  switch (action.type) {
    case SELECT_GRID_ITEM:
      return {
        ...state,
        players: state.players.map((item) => {
          if (item.id === action.payload.playerId) {
            // Only mutate hand for the item with the matching key
            return {
              ...item,
              hand: item.hand.map((card, index) => (
                index === action.payload.favHandIndex ? { ...card, selected: !card.selected } : { ...card, selected: false }
              )),
            };
          }
          return {
            ...item,
            // Reset selection for all other items
            hand: item.hand.map((card) => ({ ...card, selected: false })),
          };
        }),
      };
    case SET_INITIAL_PLAYERS_STATE:
      return {
        ...state,
        players: transformPlayersForRedux(action.payload),
      };
    case RESET_GRID:
      return {
        ...state,
        players: state.players.map((item) => ({
          ...item,
          hand: item.hand.map((card) => ({ ...card, selected: false })),
        })),
      };
    default:
      return state;
  }
};

export default gridReducer;
