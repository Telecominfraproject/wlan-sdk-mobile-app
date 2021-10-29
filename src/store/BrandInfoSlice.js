import { createSlice } from '@reduxjs/toolkit';

export const brandInfoSlice = createSlice({
  name: 'brandInfo',
  initialState: {
    value: null,
  },
  reducers: {
    setBrandInfo: (state, action) => {
      state.value = action.payload;
    },
    clearBrandInfo: state => {
      state.value -= null;
    },
  },
});

export const selectBrandInfo = state => state.brandInfo.value;
export const { setBrandInfo, clearBrandInfo } = brandInfoSlice.actions;
export default brandInfoSlice.reducer;
