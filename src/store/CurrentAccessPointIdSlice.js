import { createSlice } from '@reduxjs/toolkit';

export const currentAccessPointIdSlice = createSlice({
  name: 'currentAccessPointId',
  initialState: {
    value: null,
  },
  reducers: {
    setCurrentAccessPointId: (state, action) => {
      state.value = action.payload;
    },
    clearCurrentAccessPointId: state => {
      state.value = null;
    },
  },
});

export const selectCurrentAccessPointId = state => state.currentAccessPointId.value;
export const { setCurrentAccessPointId, clearCurrentAccessPointId } = currentAccessPointIdSlice.actions;
export default currentAccessPointIdSlice.reducer;
