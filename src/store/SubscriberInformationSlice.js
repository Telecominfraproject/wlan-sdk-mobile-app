import { createSlice } from '@reduxjs/toolkit';
import { getSubscriberAccessPointInfo } from '../api/apiHandler';

export const subscriberInformationSlice = createSlice({
  name: 'subscriberInformation',
  initialState: {
    // Indicates if the subscriber information is loading or not
    loading: false,

    // Indicated the selected Access Point (null means use the first one)
    selectedAccessPointId: null,

    // Subscriber information and subparts
    subscriberInformation: null,
    accessPoints: null,
    accessPoint: null,
    internetConnection: null,
    wifiNetworks: null,
    deviceMode: null,
    dnsConfiguration: null,
    ipReservations: null,
    subscriberDevices: null,
  },
  reducers: {
    setSubscriberInformationLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSelectedAccessPointId: (state, action) => {
      state.selectedAccessPointId = action.payload;

      setStateFromSubsciberInfo(state, state.subscriberInformation, state.selectedAccessPointId);
    },
    setSubscriberInformation: (state, action) => {
      state.subscriberInformation = action.payload;

      setStateFromSubsciberInfo(state, state.subscriberInformation, state.selectedAccessPointId);
    },
    clearSubscriberInformation: state => {
      state.subscriberInformation = null;
      state.accessPoints = null;
      state.accessPoint = null;
      state.internetConnection = null;
      state.wifiNetworks = null;
      state.deviceMode = null;
      state.dnsConfiguration = null;
      state.ipReservations = null;
      state.subscriberDevices = null;
    },
  },
});

function setStateFromSubsciberInfo(state, subscriberInfo, selectAccessPointId) {
  state.accessPoints = subscriberInfo && subscriberInfo.accessPoints ? subscriberInfo.accessPoints.list : null;
  state.accessPoint = getSubscriberAccessPointInfo(subscriberInfo, selectAccessPointId, null);
  state.internetConnection = getSubscriberAccessPointInfo(subscriberInfo, selectAccessPointId, 'internetConnection');
  state.wifiNetworks = getSubscriberAccessPointInfo(subscriberInfo, selectAccessPointId, 'wifiNetworks');
  state.deviceMode = getSubscriberAccessPointInfo(subscriberInfo, selectAccessPointId, 'deviceMode');
  state.dnsConfiguration = getSubscriberAccessPointInfo(subscriberInfo, selectAccessPointId, 'dnsConfiguration');
  state.ipReservations = getSubscriberAccessPointInfo(subscriberInfo, selectAccessPointId, 'ipReservations');
  state.subscriberDevices = getSubscriberAccessPointInfo(subscriberInfo, selectAccessPointId, 'subscriberDevices');
}

export const selectSubscriberInformationLoading = state => state.subscriberInformation.loading;
export const selectCurrentAccessPointId = state => state.subscriberInformation.selectedAccessPointId;
export const selectSubscriberInformation = state => state.subscriberInformation.subscriberInformation;
export const selectAccessPoints = state => state.subscriberInformation.accessPoints;
export const selectAccessPoint = state => state.subscriberInformation.accessPoint;
export const selectInternetConnection = state => state.subscriberInformation.internetConnection;
export const selectWifiNetworks = state => state.subscriberInformation.wifiNetworks;
export const selectDeviceMode = state => state.subscriberInformation.deviceMode;
export const selectDnsConfiguration = state => state.subscriberInformation.dnsConfiguration;
export const selectIpReservations = state => state.subscriberInformation.ipReservations;
export const selectSubscriberDevices = state => state.subscriberInformation.subscriberDevices;

export const { setSubscriberInformation, clearSubscriberInformation } = subscriberInformationSlice.actions;
export default subscriberInformationSlice.reducer;
