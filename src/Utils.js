import { Alert } from 'react-native';
import { strings } from './localization/LocalizationStrings';
import { errorColor, warnColor, okColor } from './AppStyle';
import { store } from './store/Store';
import { clearSession, setSession } from './store/SessionSlice';
import {
  setSubscriberInformationLoading,
  setSubscriberInformation,
  clearSubscriberInformation,
} from './store/SubscriberInformationSlice';
import {
  authenticationApi,
  subscriberInformationApi,
  getSubscriberAccessPointInfo,
  clearCredentials,
} from './api/apiHandler';

export function showGeneralError(title, message) {
  console.error(title + ' -> ' + message);
  Alert.alert(title, message, null, { cancelable: true });
}

export function showGeneralMessage(message) {
  Alert.alert(strings.messages.titleMessage, message);
}

export function scrollViewToTop(scrollViewRef) {
  if (scrollViewRef && scrollViewRef.current) {
    scrollViewRef.current.scrollTo({ y: 0, animated: true });
  }
}

export function displayValue(obj, key) {
  if (obj && key) {
    if (key in obj) {
      return obj[key];
    }
  }

  return strings.messages.empty;
}

export function displayValueBoolean(obj, key) {
  if (obj && key) {
    if (key in obj) {
      return obj[key] ? strings.common.yes : strings.common.no;
    }
  }

  return strings.messages.empty;
}

export function displayValueAccessPointType(obj, key) {
  if (obj && key) {
    if (key in obj) {
      switch (obj[key]) {
        default:
          return obj[key].toUpperCase().replace('_', ' ');
      }
    }
  }

  return strings.messages.empty;
}

export function displayValueAccessPointDeviceRole(obj, key) {
  if (obj && key) {
    if (key in obj) {
      switch (obj[key]) {
        // TOD: Example extender - does not actually exist - just a placeholder. Need a list here.
        case 'tplink_extender':
          return strings.common.extender;

        default:
          return strings.common.router;
      }
    }
  }

  return strings.common.router;
}

export function displayValueInternetConnectionType(obj, key) {
  if (obj && key) {
    if (key in obj) {
      switch (obj[key]) {
        case 'manual':
          return strings.common.manual;

        case 'pppoe':
          return strings.common.pppoe;

        case 'automatic':
          return strings.common.automatic;

        default:
          return obj[key];
      }
    }
  }

  return strings.messages.empty;
}

export function displayValueDeviceModeType(obj, key) {
  if (obj && key) {
    if (key in obj) {
      switch (obj[key]) {
        case 'bridge':
          return strings.common.bridge;

        case 'manual':
          return strings.common.manual;

        case 'nat':
          return strings.common.nat;

        default:
          return obj[key];
      }
    }
  }

  return strings.messages.empty;
}

export function displayEditableValue(obj, key) {
  if (obj && key) {
    if (key in obj) {
      return obj[key];
    }
  }

  // Just return null if not found, editable values should not have anything returned
  // if there is nothing there.
  return null;
}

export function getAccessPointIcon(accessPoint) {
  if (accessPoint && accessPoint.deviceType) {
    switch (accessPoint.deviceType) {
      case 'edgecore_eap101':
        return require('./assets/devices/edgecore_eap101.png');

      case 'edgecore_eap102':
        return require('./assets/devices/edgecore_eap102.png');

      case 'edgecore_ecw5211':
        return require('./assets/devices/edgecore_ecw5211.png');

      case 'edgecore_ecw5410':
        return require('./assets/devices/edgecore_ecw5410.png');

      case 'edgecore_oap100':
        return require('./assets/devices/edgecore_oap100.png');

      case 'edgecore_spw2ac1200':
        return require('./assets/devices/edgecore_spw2ac1200.png');

      case 'edgecore_ssw2ac2600':
        return require('./assets/devices/edgecore_ssw2ac2600.png');
    }
  }

  return require('./assets/devices/hdd-solid.png');
}

export function getDeviceFromClient(client, subscriberInformation, accessPointId) {
  if (!client || !subscriberInformation) {
    return null;
  }

  let subscriberDevices = getSubscriberAccessPointInfo(subscriberInformation, accessPointId, 'subscriberDevices');
  if (!subscriberDevices || !subscriberDevices.devices) {
    return null;
  }

  return subscriberDevices.devices.find(item => item.macAddress === client.macAddress);
}

export function getGuestNetworkIndex(wifiNetworks) {
  if (wifiNetworks && wifiNetworks.wifiNetworks) {
    // Return the first guest network index
    let index = wifiNetworks.wifiNetworks.findIndex(network => network.type === 'guest');
    if (index < 0) {
      return null;
    } else {
      return index;
    }
  }

  return null;
}

export function getClientIcon(client) {
  // TODO: Will have to get proper icons, might have to depend on device
  return require('./assets/laptop-solid.png');
}

export function getClientConnectionIcon(client) {
  if ('ssid' in client) {
    return require('./assets/wifi-solid.png');
  } else {
    return require('./assets/network-wired-solid.png');
  }
}

export function getClientConnectionStatusColor(client) {
  // TODO: Should this handle suspended devices?
  if (!client) {
    return errorColor;
  } else if ('ssid' in client) {
    // Handle WIFI status
    const rssi = client.rssi;

    // TODO: Verify this
    if (rssi <= -80) {
      return errorColor;
    } else if (rssi > -80 && rssi <= -50) {
      return warnColor;
    } else if (rssi > -50 && rssi < 0) {
      return okColor;
    } else {
      return errorColor;
    }
  } else {
    // Wired client
    // TODO: Check to see if there is more to look at here
    return okColor;
  }
}

export function logStringifyPretty(obj, title) {
  if (title) {
    console.log(title, JSON.stringify(obj, null, '\t'));
  } else {
    console.log(JSON.stringify(obj, null, '\t'));
  }
}

export async function completeSignOut(navigation) {
  store.dispatch(clearSession());
  clearCredentials();

  navigation.reset({
    index: 0,
    routes: [{ name: 'SignIn' }],
  });
}

export async function completeSignIn(navigation, userId, password, sessionData, setLoadingFn) {
  try {
    let responseData = sessionData;

    if (setLoadingFn) {
      // Loading has started
      setLoadingFn(true);
    }

    if (!sessionData) {
      // Make sure to clear any session/subscriber information and try and get token. If we already have session data
      // nothing to do, just handle the continuation
      store.dispatch(clearSession());
      store.dispatch(clearSubscriberInformation());

      const response = await authenticationApi.getAccessToken({
        userId: userId,
        password: password,
      });

      if (!response || !response.data) {
        throw new Error(strings.errors.invalidResponse);
      }

      responseData = response.data;
      logStringifyPretty(responseData, response.request.responseURL);
    }

    if (responseData.question === 'mfa challenge') {
      // If the data returns a 'method' then we must handle Multi-Factor Authentication, in the response
      // there are three items: method, uuid, created, this will be passed to the MFA handler
      if (setLoadingFn) {
        setLoadingFn(false);
      }

      navigation.navigate('MfaCode', { userId: userId, mfaInfo: responseData });
    } else {
      switch (responseData.errorCode) {
        case 0:
          // Success - process the rest of the sign in process
          break;

        default:
          if (responseData.ErrorDescription) {
            throw new Error(responseData.ErrorDescription);
          } else {
            throw new Error(strings.errors.invalidResponse);
          }
      }

      store.dispatch(setSession(responseData));

      // Get the subscriber information
      await getSubscriberInformation(true);

      // Completed sign-in
      if (setLoadingFn) {
        setLoadingFn(false);
      }

      navigation.replace('Main');
    }
  } catch (error) {
    if (setLoadingFn) {
      // Clear the loading state
      setLoadingFn(false);
    }

    // Clear any saved credentials, make the user re-enter them
    clearCredentials();

    // Check for password reset handling
    if (error.response && error.response.status === 403 && error.response.data && error.response.data.ErrorCode === 1) {
      // The password reset error code is 1, just navigate to the Reset Password screen
      navigation.navigate('ChangePasswordForced', { userId: userId, forced: true });
      return;
    }

    // Throw the error to be handled by the callers exception handler
    throw error;
  }
}

export async function getSubscriberInformation(setLoadingFlag) {
  try {
    if (setLoadingFlag) {
      store.dispatch(setSubscriberInformationLoading(true));
    }

    if (!subscriberInformationApi) {
      throw new Error(strings.errors.internal);
    }

    const response = await subscriberInformationApi.getSubscriberInfo();
    if (!response || !response.data) {
      throw new Error(strings.errors.invalidResponse);
    }

    logStringifyPretty(response.data, response.request.responseURL);
    store.dispatch(setSubscriberInformation(response.data));
  } finally {
    if (setLoadingFlag) {
      store.dispatch(setSubscriberInformationLoading(false));
    }
  }
}

export function isFieldDifferent(currentData, newData, field) {
  let currentValue = currentData ? currentData[field] : null;
  let newValue = newData ? newData[field] : null;

  if (newValue !== currentValue) {
    return true;
  } else {
    return false;
  }
}

export function isArrayDifferent(array1, array2) {
  if (array1 === null || array2 === null) {
    return array1 !== array2;
  }

  if (array1.length !== array2.length) {
    return true;
  }

  let intersection = array1.filter(x => array2.includes(x));
  return intersection.length !== array1.length;
}

export function setSubscriberInformationInterval(extraUpdateFn) {
  async function checkSubscriberInformation() {
    try {
      await getSubscriberInformation(false);
      if (extraUpdateFn) {
        await extraUpdateFn();
      }
    } catch (error) {
      // do nothing
    }
  }

  let intervalId = setInterval(checkSubscriberInformation, 60000);
  checkSubscriberInformation();

  return intervalId;
}

export async function modifySubscriberInformation(updatedJson) {
  if (!subscriberInformationApi) {
    throw new Error(strings.errors.internal);
  }

  if (!updatedJson) {
    throw new Error(strings.errors.internal);
  }

  const response = await subscriberInformationApi.modifySubscriberInfo(updatedJson);
  if (!response || !response.data) {
    throw new Error(strings.errors.invalidResponse);
  }

  logStringifyPretty(response.data, response.request.responseURL);

  // The response is the subscriber list again, so save the updated information. Note that the
  // setSubscriberInformation call will only change the state if something actually changed.
  store.dispatch(setSubscriberInformation(response.data));
}

export async function modifyAccessPoint(accessPointId, jsonObject) {
  if (!jsonObject) {
    // Do nothing if the object is null or empty
    return;
  }

  let subscriberInformation = store.getState().subscriberInformation.subscriberInformation;
  if (!subscriberInformation) {
    throw new Error(strings.errors.internal);
  }

  // Clone the current subscriber information
  let updatedSubsciberInformation = JSON.parse(JSON.stringify(subscriberInformation));
  let accessPoint = getSubscriberAccessPointInfo(updatedSubsciberInformation, accessPointId, null);
  if (!accessPoint) {
    throw new Error(strings.errors.internal);
  }

  // Update the values and check to make sure there has been change
  let changed = false;
  for (const [key, value] of Object.entries(jsonObject)) {
    if (accessPoint[key] !== value) {
      accessPoint[key] = value;
      changed = true;
    }
  }

  // If no change occured, just return. This is very important to avoid
  // some types of setState infinite loops
  if (!changed) {
    return;
  }

  await modifySubscriberInformation(updatedSubsciberInformation);
}

export async function modifySubscriberDeviceMode(accessPointId, jsonObject) {
  if (!jsonObject) {
    // Do nothing if the object is null or empty
    return;
  }

  let subscriberInformation = store.getState().subscriberInformation.subscriberInformation;
  if (!subscriberInformation) {
    throw new Error(strings.errors.internal);
  }

  // Clone the current subscriber information
  let updatedSubsciberInformation = JSON.parse(JSON.stringify(subscriberInformation));
  let deviceMode = getSubscriberAccessPointInfo(updatedSubsciberInformation, accessPointId, 'deviceMode');
  if (!deviceMode) {
    throw new Error(strings.errors.internal);
  }

  // Update the values and check to make sure there has been change
  let changed = false;
  for (const [key, value] of Object.entries(jsonObject)) {
    if (deviceMode[key] !== value) {
      deviceMode[key] = value;
      changed = true;
    }
  }

  // If no change occured, just return. This is very important to avoid
  // some types of setState infinite loops
  if (!changed) {
    return;
  }

  await modifySubscriberInformation(updatedSubsciberInformation);
}

export async function modifySubscriberDevice(accessPointId, device, jsonObject) {
  if (!jsonObject) {
    // Do nothing
    return;
  }

  if (!device) {
    throw new Error(strings.errors.internal);
  }

  let subscriberInformation = store.getState().subscriberInformation.subscriberInformation;
  if (!subscriberInformation) {
    throw new Error(strings.errors.internal);
  }

  // Clone the current subscriber list and get the current device list
  let updatedSubsciberInformation = JSON.parse(JSON.stringify(subscriberInformation));
  let subscriberDevices = getSubscriberAccessPointInfo(updatedSubsciberInformation, accessPointId, 'subscriberDevices');

  if (!subscriberDevices) {
    throw new Error(strings.errors.internal);
  }

  // TODO: This needs to be verified!
  let deviceToUpdate = subscriberDevices.find(item => item.macAddress === device.macAddress);
  for (const [key, value] of Object.entries(jsonObject)) {
    deviceToUpdate[key] = value;
  }

  await modifySubscriberInformation(updatedSubsciberInformation);
}

export async function modifySubscriberInternetConnection(accessPointId, jsonObject) {
  if (!jsonObject) {
    // Do nothing if the object is null or empty
    return;
  }

  let subscriberInformation = store.getState().subscriberInformation.subscriberInformation;
  if (!subscriberInformation) {
    throw new Error(strings.errors.internal);
  }

  // Clone the current subscriber information
  let updatedSubsciberInformation = JSON.parse(JSON.stringify(subscriberInformation));
  let internetConnection = getSubscriberAccessPointInfo(
    updatedSubsciberInformation,
    accessPointId,
    'internetConnection',
  );
  if (!internetConnection) {
    throw new Error(strings.errors.internal);
  }

  // Update the values and check to make sure there has been change
  let changed = false;
  for (const [key, value] of Object.entries(jsonObject)) {
    if (internetConnection[key] !== value) {
      internetConnection[key] = value;
      changed = true;
    }
  }

  // If no change occured, just return. This is very important to avoid
  // some types of setState infinite loops
  if (!changed) {
    return;
  }

  await modifySubscriberInformation(updatedSubsciberInformation);
}

export async function modifySubscriberDnsInformation(accessPointId, jsonObject) {
  if (!jsonObject) {
    // Do nothing if the object is null or empty
    return;
  }

  let subscriberInformation = store.getState().subscriberInformation.subscriberInformation;
  if (!subscriberInformation) {
    throw new Error(strings.errors.internal);
  }

  // Clone the current subscriber information
  let updatedSubsciberInformation = JSON.parse(JSON.stringify(subscriberInformation));
  let dnsConfiguration = getSubscriberAccessPointInfo(updatedSubsciberInformation, accessPointId, 'dnsConfiguration');
  if (!dnsConfiguration) {
    throw new Error(strings.errors.internal);
  }

  // Update the values and check to make sure there has been change
  let changed = false;
  for (const [key, value] of Object.entries(jsonObject)) {
    if (dnsConfiguration[key] !== value) {
      dnsConfiguration[key] = value;
      changed = true;
    }
  }

  // If no change occured, just return. This is very important to avoid
  // some types of setState infinite loops
  if (!changed) {
    return;
  }

  // There are some dependant values here, make sure they make sense
  if (dnsConfiguration.custom) {
    dnsConfiguration.ISP = false;
  } else {
    dnsConfiguration.ISP = true;
    dnsConfiguration.custom = false;
  }

  await modifySubscriberInformation(updatedSubsciberInformation);
}

export async function addSubscriberIpReservation(accessPointId, ipReservationJsonObject) {
  if (!ipReservationJsonObject) {
    // Do nothing if the object is null or empty
    return;
  }

  let subscriberInformation = store.getState().subscriberInformation.subscriberInformation;
  if (!subscriberInformation) {
    throw new Error(strings.errors.internal);
  }

  // Clone the current subscriber information
  let updatedSubsciberInformation = JSON.parse(JSON.stringify(subscriberInformation));
  let ipReservations = getSubscriberAccessPointInfo(updatedSubsciberInformation, accessPointId, 'ipReservations');
  if (!ipReservations) {
    throw new Error(strings.errors.internal);
  }

  if (!ipReservations.reservations) {
    ipReservations.reservations = [];
  }

  ipReservations.reservations.push(ipReservationJsonObject);
  await modifySubscriberInformation(updatedSubsciberInformation);
}

export async function modifySubscriberIpReservation(accessPointId, ipReservationIndex, ipReservationJsonObject) {
  if (ipReservationIndex === null || !ipReservationJsonObject) {
    // Do nothing if the object is null or empty
    return;
  }

  let subscriberInformation = store.getState().subscriberInformation.subscriberInformation;
  if (!subscriberInformation) {
    throw new Error(strings.errors.internal);
  }

  // Clone the current subscriber information
  let updatedSubsciberInformation = JSON.parse(JSON.stringify(subscriberInformation));
  let ipReservations = getSubscriberAccessPointInfo(updatedSubsciberInformation, accessPointId, 'ipReservations');
  if (!ipReservations) {
    throw new Error(strings.errors.internal);
  }

  if (ipReservations.reservations.length < ipReservationIndex) {
    console.error('IP Reservation index out of range');
    throw new Error(strings.errors.internal);
  }

  let reservationToUpdate = ipReservations.reservations[ipReservationIndex];
  if (!reservationToUpdate) {
    throw new Error(strings.errors.internal);
  }

  for (const [key, value] of Object.entries(ipReservationJsonObject)) {
    reservationToUpdate[key] = value;
  }

  await modifySubscriberInformation(updatedSubsciberInformation);
}

export async function deleteSubscriberIpReservation(accessPointId, ipReservationIndex) {
  if (ipReservationIndex === null) {
    // Do nothing if the index is null
    return;
  }

  let subscriberInformation = store.getState().subscriberInformation.subscriberInformation;
  if (!subscriberInformation) {
    throw new Error(strings.errors.internal);
  }

  // Clone the current subscriber information
  let updatedSubsciberInformation = JSON.parse(JSON.stringify(subscriberInformation));
  let ipReservations = getSubscriberAccessPointInfo(updatedSubsciberInformation, accessPointId, 'ipReservations');
  if (!ipReservations) {
    throw new Error(strings.errors.internal);
  }

  if (ipReservations.reservations.length < ipReservationIndex) {
    console.error('IP Reservation index out of range');
    throw new Error(strings.errors.internal);
  }

  // Remove the element from the array
  ipReservations.reservations.splice(ipReservationIndex, 1);
  await modifySubscriberInformation(updatedSubsciberInformation);
}

export async function addNetwork(accessPointId, networkJsonObject) {
  if (!networkJsonObject) {
    // Do nothing if the object is null or empty
    return;
  }

  let subscriberInformation = store.getState().subscriberInformation.subscriberInformation;
  if (!subscriberInformation) {
    throw new Error(strings.errors.internal);
  }

  // Clone the current subscriber information
  let updatedSubsciberInformation = JSON.parse(JSON.stringify(subscriberInformation));
  let wifiNetworks = getSubscriberAccessPointInfo(updatedSubsciberInformation, accessPointId, 'wifiNetworks');
  if (!wifiNetworks) {
    throw new Error(strings.errors.internal);
  }

  if (!wifiNetworks.wifiNetworks) {
    wifiNetworks.wifiNetworks = [];
  }

  wifiNetworks.wifiNetworks.push(networkJsonObject);
  await modifySubscriberInformation(updatedSubsciberInformation);
}

export async function modifyNetworkSettings(accessPointId, networkIndex, networkJsonObject) {
  if (networkIndex === null || !networkJsonObject) {
    // Do nothing if the object is null or empty
    return;
  }

  let subscriberInformation = store.getState().subscriberInformation.subscriberInformation;
  if (!subscriberInformation) {
    throw new Error(strings.errors.internal);
  }

  // Clone the current subscriber information
  let updatedSubsciberInformation = JSON.parse(JSON.stringify(subscriberInformation));
  let wifiNetworks = getSubscriberAccessPointInfo(updatedSubsciberInformation, accessPointId, 'wifiNetworks');
  if (!wifiNetworks || !wifiNetworks.wifiNetworks) {
    throw new Error(strings.errors.internal);
  }

  if (wifiNetworks.wifiNetworks.length < networkIndex) {
    console.error('Network index out of range');
    throw new Error(strings.errors.internal);
  }

  let wifiNetworkToUpdate = wifiNetworks.wifiNetworks[networkIndex];
  if (!wifiNetworkToUpdate) {
    throw new Error(strings.errors.internal);
  }

  for (const [key, value] of Object.entries(networkJsonObject)) {
    wifiNetworkToUpdate[key] = value;
  }

  await modifySubscriberInformation(updatedSubsciberInformation);
}

export async function deleteNetwork(accessPointId, networkIndex) {
  if (networkIndex === null) {
    // Do nothing if the network index is not valid
    return;
  }

  let subscriberInformation = store.getState().subscriberInformation.subscriberInformation;
  if (!subscriberInformation) {
    throw new Error(strings.errors.internal);
  }

  // Clone the current subscriber information
  let updatedSubsciberInformation = JSON.parse(JSON.stringify(subscriberInformation));
  let wifiNetworks = getSubscriberAccessPointInfo(updatedSubsciberInformation, accessPointId, 'wifiNetworks');
  if (!wifiNetworks || !wifiNetworks.wifiNetworks) {
    throw new Error(strings.errors.internal);
  }

  if (wifiNetworks.wifiNetworks.length < networkIndex) {
    console.error('Network index out of range');
    throw new Error(strings.errors.internal);
  }

  // Remove the element from the array
  wifiNetworks.wifiNetworks.splice(networkIndex, 1);
  await modifySubscriberInformation(updatedSubsciberInformation);
}
