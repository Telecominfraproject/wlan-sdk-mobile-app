import { createSlice } from '@reduxjs/toolkit';

export const sessionSlice = createSlice({
  name: 'session',
  initialState: {
    value: null,
  },
  reducers: {
    setSession: (state, action) => {
      state.value = action.payload;
    },
    clearSession: state => {
      state.value = null;
    },
  },
});

export const selectSession = state => state.session.value;
export const { setSession, clearSession } = sessionSlice.actions;
export default sessionSlice.reducer;
