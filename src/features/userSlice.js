import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  auth: false,
  user: {},
};

export const userSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.auth = true;
      state.user = action.payload;
    },
    removeUser: (state) => {
      state.auth = false;
      state.user = null;
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
