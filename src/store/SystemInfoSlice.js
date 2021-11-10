import { createSlice } from '@reduxjs/toolkit';

export const systemInfoSlice = createSlice({
  name: 'systemInfo',
  initialState: {
    value: null,
  },
  reducers: {
    setSystemInfo: (state, action) => {
      state.value = action.payload;
    },
    clearSystemInfo: state => {
      state.value = null;
    },
  },
});

export const selectSystemInfo = state => state.systemInfo.value;
export const { setSystemInfo, clearSystemInfo } = systemInfoSlice.actions;
export default systemInfoSlice.reducer;
