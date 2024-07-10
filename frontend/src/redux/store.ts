import { Action, configureStore, ThunkAction, ThunkDispatch } from '@reduxjs/toolkit';
import dataReducer from './dataSlice';

export const store = configureStore({
  reducer: {
    data: dataReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch & ThunkDispatch<RootState, unknown, Action<string>>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
