// src/slices/userSlice.ts

import { createSlice } from '@reduxjs/toolkit';

interface UserState {
  token: string | null;
  isValidated: boolean;
  isFirstSessionLogin: boolean;
}

const initialState: UserState = {
  token: null,
  isValidated: false,
  isFirstSessionLogin: true,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setIsValidated: (state, action) => {
      state.isValidated = action.payload;
    },
    setIsFirstSessionLogin: (state, action) => {
      state.isFirstSessionLogin = action.payload;
    },
    resetAuth: (state) => {
      state.token = null;
      state.isValidated = false;
    },
  },
});

export const { setToken, setIsValidated, setIsFirstSessionLogin, resetAuth } = userSlice.actions;
export default userSlice.reducer;
