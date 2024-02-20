// uiReducer.ts
import { TOGGLE_KEYBOARD } from '../actions/actionTypes';

type KeyboardState ={
  isKeyboardVisible: boolean;
  selectedRank: string;
  selectedSuit: string;
}

type Action = { type: string; payload: { visible: boolean, selectedRank: string, selectedSuit: string } };

const initialState: KeyboardState = {
  isKeyboardVisible: false,
  selectedRank: '?',
  selectedSuit: 'suits',
};

const uiReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case TOGGLE_KEYBOARD:
      return {
        ...state,
        isKeyboardVisible: action.payload.visible,
        selectedRank: action.payload.selectedRank,
        selectedSuit: action.payload.selectedSuit,
      };
    default:
      return state;
  }
};

export default uiReducer;
