// gridReducer.ts
import { SELECT_GRID_ITEM, UPDATE_PLAYER_RANK, UPDATE_PLAYER_SUIT, RESET_GRID } from '../actions/actionTypes';

interface FavHand {
  favHandRank: string;
  favHandSuit: string;
  selected: boolean;
}

interface GridItem {
  key: string;
  name: string;
  profit: number;
  hand: FavHand[];
}

type GridState = GridItem[];

type SelectGridItemAction = {
  type: typeof SELECT_GRID_ITEM;
  payload: {
    key: string;
    favHandIndex: number;
  };
};

type UpdatePlayerRankAction = {
  type: typeof UPDATE_PLAYER_RANK;
  payload: {
    key: string;
    handIndex: number;
    rank: string;
  };
};

type UpdatePlayerSuitAction = {
  type: typeof UPDATE_PLAYER_SUIT;
  payload: {
    key: string;
    handIndex: number;
    suit: string;
  };
};

type ResetGridAction = {
  type: typeof RESET_GRID;
};

type Action = SelectGridItemAction | UpdatePlayerRankAction | UpdatePlayerSuitAction | ResetGridAction;


const initialState: GridState = [
  { key: '1', name: 'NAME', profit: 100,
    hand: [ { favHandRank: 'A', favHandSuit: 'hearts', selected: false }, 
            { favHandRank: 'A', favHandSuit: 'diamonds', selected: false } ]
  },
  { key: '2', name: 'NAME', profit: 0,
    hand: [ { favHandRank: '?', favHandSuit: 'suits', selected: false }, 
            { favHandRank: 'A', favHandSuit: 'spades', selected: false } ]
  },
  { key: '3', name: 'NAME', profit: -0,
    hand: [ { favHandRank: '?', favHandSuit: 'suits', selected: false }, 
            { favHandRank: 'A', favHandSuit: 'hearts', selected: false } ]
  },
  { key: '4', name: 'NAME', profit: -123.2,
    hand: [ { favHandRank: 'T', favHandSuit: 'clubs', selected: false }, 
            { favHandRank: 'A', favHandSuit: 'hearts', selected: false } ]
  },
  { key: '5', name: 'NAME', profit: 123.24,
    hand: [ { favHandRank: 'T', favHandSuit: 'suits', selected: false }, 
            { favHandRank: 'A', favHandSuit: 'hearts', selected: false } ]
  },
  { key: '6', name: 'NAME', profit: 1,
    hand: [ { favHandRank: '?', favHandSuit: 'suits', selected: false }, 
            { favHandRank: '?', favHandSuit: 'suits', selected: false } ]
  },
];

const gridReducer = (state = initialState, action: Action): GridState => {
  switch (action.type) {
    case SELECT_GRID_ITEM:
      return state.map((item) => {
        if (item.key === action.payload.key) {
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
      });
      case UPDATE_PLAYER_RANK:
        return state.map((item) =>
          item.key === action.payload.key ? {
            ...item,
            hand: item.hand.map((hand, index) =>
              index === action.payload.handIndex ? { ...hand, favHandRank: action.payload.rank } : hand
            )
          } : item
        );
      case UPDATE_PLAYER_SUIT:
        return state.map((item) =>
          item.key === action.payload.key ? {
            ...item,
            hand: item.hand.map((hand, index) =>
              index === action.payload.handIndex ? { ...hand, favHandSuit: action.payload.suit } : hand
            )
          } : item
        );
      case RESET_GRID:
        return state.map((item) => ({
          ...item,
          hand: item.hand.map((card) => ({ ...card, selected: false })),
        }));
    default:
      return state;
  }
};

export default gridReducer;
