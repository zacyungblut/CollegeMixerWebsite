import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from '../reducers/auth'
import userReducer from '../slices/userSlice'

export const store = configureStore({
  reducer: {
    counter: authReducer,
    user: userReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
