import { createSlice } from '@reduxjs/toolkit';

export const deviceUuidSlice = createSlice({
  name: 'deviceUuid',
  initialState: {
    value: null,
  },
  reducers: {
    setDeviceUuid: (state, action) => {
      state.value = action.payload;
    },
    clearDeviceUuid: state => {
      state.value = null;
    },
  },
});

export const selectDeviceUuid = state => state.deviceUuid.value;
export const { setDeviceUuid, clearDeviceUuid } = deviceUuidSlice.actions;
export default deviceUuidSlice.reducer;
