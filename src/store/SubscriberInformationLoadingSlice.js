import { createSlice } from '@reduxjs/toolkit';

export const subscriberInformationLoadingSlice = createSlice({
  name: 'subscriberInformationLoading',
  initialState: {
    value: null,
  },
  reducers: {
    setSubscriberInformationLoading: (state, action) => {
      state.value = action.payload;
    },
    clearSubscriberInformationLoading: state => {
      state.value = null;
    },
  },
});

export const selectSubscriberInformationLoading = state => state.subscriberInformationLoading.value;
export const { setSubscriberInformationLoading, clearSubscriberInformationLoading } =
  subscriberInformationLoadingSlice.actions;
export default subscriberInformationLoadingSlice.reducer;
