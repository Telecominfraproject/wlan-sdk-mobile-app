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
    deviceMode: null,
    dnsConfiguration: null,
    internetConnection: null,
    ipReservations: null,
    radios: null,
    subscriberDevices: null,
    wifiNetworks: null,
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
      // Only check the subscriberInformation modified field, all other modified fields are ignored.
      if (true || isFieldDifferent(state.subscriberInformation, action.payload, 'modified')) {
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
      state.deviceMode = null;
      state.dnsConfiguration = null;
      state.internetConnection = null;
      state.ipReservations = null;
      state.radios = null;
      state.subscriberDevices = null;
      state.wifiNetworks = null;
    },
  },
});

function setStateFromSubsciberInfo(state, subscriberInfo, selectAccessPointId) {
  // Always update the accessPoints, as this would be too involved to check all of them. This is only used
  // in a few locations, so having this updated frequently shouldn't be too big of a deal. Revaluated if necessary.
  state.accessPoints = subscriberInfo && subscriberInfo.accessPoints ? subscriberInfo.accessPoints.list : null;

  // Next pull out the subgroups from the currently selected access point, and update the appropriate state if
  // they have changed. NOTE: the accessPoint state will NOT include these groups, as anything that is being
  // looking at access point should only look at the first level fields.
  let subGroupFields = [
    'deviceMode',
    'dnsConfiguration',
    'internetConnection',
    'ipReservations',
    'radios',
    'subscriberDevices',
    'wifiNetworks',
  ];

  let newAccessPoint = getSubscriberAccessPointInfo(subscriberInfo, selectAccessPointId, null);
  if (newAccessPoint !== null) {
    newAccessPoint = JSON.parse(JSON.stringify(newAccessPoint));

    // Delete the access point modified field, if it exists (it does not currently)
    delete newAccessPoint.modified;
  }

  // Only update the particular state if the modified date is different. Creating a new
  // object here will mean unnecessary re-renders
  subGroupFields.forEach(key => {
    // Remove the subgroup from the newAccessPoint
    if (newAccessPoint !== null) {
      delete newAccessPoint[key];
    }

    let newObject = getSubscriberAccessPointInfo(subscriberInfo, selectAccessPointId, key);
    if (newObject === null || state[key] === null) {
      state[key] = newObject;
    } else {
      let filtered1 = JSON.parse(JSON.stringify(newObject));
      let filtered2 = JSON.parse(JSON.stringify(state[key]));

      // Ignore these modified fields, only the outer will be looked at
      delete filtered1.modified;
      delete filtered2.modified;

      if (!isEqual(filtered1, filtered2)) {
        console.log(key + ' -> state updated');
        state[key] = newObject;
      }
    }
  });

  // For the accessPoint, only include the specific access point fields and only if they changed
  // Note if both access points are null, the simple state comparison will work
  if (newAccessPoint === null || state.accessPoint === null || !isEqual(newAccessPoint, state.accessPoint)) {
    console.log('accessPoint -> state updated');
    state.accessPoint = newAccessPoint;
  }
}

export const selectSubscriberInformationLoading = state => state.subscriberInformation.loading;
export const selectCurrentAccessPointId = state => state.subscriberInformation.selectedAccessPointId;
export const selectSubscriberInformation = state => state.subscriberInformation.subscriberInformation;
export const selectAccessPoints = state => state.subscriberInformation.accessPoints;
export const selectAccessPoint = state => state.subscriberInformation.accessPoint;
export const selectDeviceMode = state => state.subscriberInformation.deviceMode;
export const selectDnsConfiguration = state => state.subscriberInformation.dnsConfiguration;
export const selectInternetConnection = state => state.subscriberInformation.internetConnection;
export const selectIpReservations = state => state.subscriberInformation.ipReservations;
export const selectRadios = state => state.subscriberInformation.radios;
export const selectSubscriberDevices = state => state.subscriberInformation.subscriberDevices;
export const selectWifiNetworks = state => state.subscriberInformation.wifiNetworks;

export const {
  setSubscriberInformationLoading,
  setSelectedAccessPointId,
  setSubscriberInformation,
  clearSubscriberInformation,
} = subscriberInformationSlice.actions;
export default subscriberInformationSlice.reducer;
