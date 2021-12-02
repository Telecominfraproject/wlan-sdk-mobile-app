import { createSlice } from '@reduxjs/toolkit';

export const subscriberInformationSlice = createSlice({
  name: 'subscriberInformation',
  initialState: {
    value: null,
  },
  reducers: {
    setSubscriberInformation: (state, action) => {
      state.value = action.payload;
    },
    clearSubscriberInformation: state => {
      state.value = null;
    },
  },
});

export const selectSubscriberInformation = state => state.subscriberInformation.value;
export const { setSubscriberInformation, clearSubscriberInformation } = subscriberInformationSlice.actions;
export default subscriberInformationSlice.reducer;
