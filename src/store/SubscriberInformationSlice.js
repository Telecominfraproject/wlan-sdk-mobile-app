import { createSlice } from '@reduxjs/toolkit';
import isEqual from 'lodash.isequal';
import { getSubscriberAccessPointInfo } from '../api/apiHandler';
import { isFieldDifferent } from '../Utils';

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
      if (action.payload !== state.selectedAccessPointId) {
        // Only update on change to the access point ID
        state.selectedAccessPointId = action.payload;
        setStateFromSubsciberInfo(state, state.subscriberInformation, state.selectedAccessPointId);
      }
    },
    setSubscriberInformation: (state, action) => {
      if (isFieldDifferent(state.subscriberInformation, action.payload, 'modified')) {
        state.subscriberInformation = action.payload;
        setStateFromSubsciberInfo(state, state.subscriberInformation, state.selectedAccessPointId);
      } else {
        console.log('No change - not updating subscriber information');
      }
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
  // Access points do not currently have 'modified' timestamp, but may need one
  state.accessPoints = subscriberInfo && subscriberInfo.accessPoints ? subscriberInfo.accessPoints.list : null;
  state.accessPoint = getSubscriberAccessPointInfo(subscriberInfo, selectAccessPointId, null);

  // Only update the particular state if the modified date is different. Creating a new
  // object here will mean unnecessary re-renders
  [
    'internetConnection',
    'deviceMode',
    'dnsConfiguration',
    'ipReservations',
    'wifiNetworks',
    'subscriberDevices',
  ].forEach(key => {
    let newObject = getSubscriberAccessPointInfo(subscriberInfo, selectAccessPointId, key);

    if (newObject === null || state[key] === null) {
      state[key] = newObject;
    } else {
      let filtered1 = JSON.parse(JSON.stringify(newObject));
      let filtered2 = JSON.parse(JSON.stringify(state[key]));

      delete filtered1.modified;
      delete filtered2.modified;

      if (!isEqual(filtered1, filtered2)) {
        console.log(key + ' updated');
        state[key] = newObject;
      }
    }
  });
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

export const {
  setSubscriberInformationLoading,
  setSelectedAccessPointId,
  setSubscriberInformation,
  clearSubscriberInformation,
} = subscriberInformationSlice.actions;
export default subscriberInformationSlice.reducer;
