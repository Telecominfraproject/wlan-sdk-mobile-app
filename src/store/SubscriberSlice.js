import { createSlice } from '@reduxjs/toolkit';

export const subscriberSlice = createSlice({
  name: 'subscriber',
  initialState: {
    value: null,
  },
  reducers: {
    setSubscriber: (state, action) => {
      state.value = action.payload;
    },
    clearSubscriber: state => {
      state.value = null;
    },
  },
});

export const selectSubscriber = state => state.subscriber.value;
export const selectCurrentAccessPoint = state => {
  const subscriber = state.subscriber.value;
  console.log(subscriber);

  if (
    subscriber &&
    subscriber.accessPoints &&
    subscriber.accessPoints.list &&
    subscriber.accessPoints.list.length > 0
  ) {
    // Return the first access point
    return subscriber.accessPoints.list[0];
  }
};
export const { setSubscriber, clearSubscriber } = subscriberSlice.actions;
export default subscriberSlice.reducer;
