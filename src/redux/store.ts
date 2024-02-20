// store.ts
import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import gridReducer from './reducers/gridReducer';
import uiReducer from './reducers/uiReducer';

const rootReducer = combineReducers({
  ui: uiReducer,
  grid: gridReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

const store = configureStore({
  reducer: rootReducer,
});

export default store;