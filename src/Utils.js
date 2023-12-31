import uuid from 'react-native-uuid';
import { Alert } from 'react-native';
import { strings } from './localization/LocalizationStrings';
import { errorColor, warnColor, okColor } from './AppStyle';
import { store } from './store/Store';
import { setDeviceUuid } from './store/DeviceUuidSlice';
import {
  setSubscriberInformationLoading,
  setSubscriberInformation,
  clearSubscriberInformation,
} from './store/SubscriberInformationSlice';
import {
  authenticationApi,
  subscriberInformationApi,
  getSubscriberAccessPointInfo,
  clearSession,
  setSession,
  HomeDeviceModeTypeEnum,
  InternetConnectionTypeEnum,
  WifiNetworkBandsEnum,
  WifiNetworkEncryptionEnum,
  WifiNetworkTypeEnum,
  handleApiError,
} from './api/apiHandler';

export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export async function getDeviceUuid() {
  let deviceUuid = store.getState().deviceUuid.value;

  if (deviceUuid === null) {
    deviceUuid = uuid.v4();
    store.dispatch(setDeviceUuid(deviceUuid));
  }

  return deviceUuid;
}

export function showGeneralError(title, message) {
  console.error(title + ' -> ' + message);
  Alert.alert(title, message, null, { cancelable: true });
}

export function showGeneralMessage(title, message) {
  Alert.alert(title, message);
}

export function scrollViewToTop(scrollViewRef) {
  if (scrollViewRef && scrollViewRef.current) {
    scrollViewRef.current.scrollTo({ y: 0, animated: true });
  }
}

export function sanitizeEmailInput(email, required) {
  let valueSanitized = email;

  if (valueSanitized) {
    valueSanitized = valueSanitized.trim();
  }

  if (required) {
    if (!valueSanitized) {
      throw new Error(strings.formatString(strings.errors.emptyField, 'Email'));
    }

    const re = /\S+@\S+\.\S+/;
    if (!re.test(valueSanitized)) {
      throw new Error(strings.errors.invalidEmail);
    }
  }

  return valueSanitized;
}

export function sanitizePasswordInput(password, regexPattern, required) {
  let valueSanitized = password;

  if (regexPattern && valueSanitized) {
    const reg = new RegExp(regexPattern, 'g');
    if (!reg.test(valueSanitized)) {
      throw new Error(strings.errors.invalidPassword);
    }
  }

  if (required) {
    if (!valueSanitized) {
      throw new Error(strings.formatString(strings.errors.emptyField, 'Password'));
    }
  }

  return valueSanitized;
}

export function sanitizeMacAddressInput(macAddress, required) {
  let valueSanitized = macAddress;

  if (valueSanitized) {
    valueSanitized = valueSanitized.trim();
    valueSanitized = valueSanitized.toLowerCase();
    valueSanitized = valueSanitized.replace(/[^0-9a-f]/g, '');
  }

  if (required) {
    if (!valueSanitized) {
      throw new Error(strings.formatString(strings.errors.emptyField, 'MAC Address'));
    }

    // If required, make sure it is long enough
    if (valueSanitized.length !== 12) {
      throw new Error(strings.errors.invalidMac);
    }
  }

  return valueSanitized;
}

export function sanitizeCode(code, required) {
  let valueSanitized = code;

  if (valueSanitized) {
    valueSanitized = valueSanitized.trim();
  }

  if (required) {
    if (!valueSanitized) {
      throw new Error(strings.formatString(strings.errors.emptyField, 'Code'));
    }
  }

  return valueSanitized;
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
        case InternetConnectionTypeEnum.Manual:
          return strings.common.manual;

        case InternetConnectionTypeEnum.Pppoe:
          return strings.common.pppoe;

        case InternetConnectionTypeEnum.Automatic:
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
        case HomeDeviceModeTypeEnum.Bridge:
          return strings.common.bridge;

        case HomeDeviceModeTypeEnum.Manual:
          return strings.common.manual;

        case HomeDeviceModeTypeEnum.Nat:
          return strings.common.nat;

        default:
          return obj[key];
      }
    }
  }

  return strings.messages.empty;
}

export function displayValueWiredMode(obj, key) {
  if (obj && key) {
    if (key in obj) {
      switch (obj[key]) {
        case 'auto':
          return strings.common.automatic;

        default:
          return obj[key];
      }
    }
  }

  return strings.messages.empty;
}

export function displayValueWiredSpeed(obj, key) {
  if (obj && key) {
    if (key in obj) {
      switch (obj[key]) {
        case 'auto':
          return strings.common.automatic;

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

export function getSubscriberDeviceIndexForMac(subscriberDevices, macAddress) {
  if (!subscriberDevices || !macAddress) {
    return null;
  }

  let index = subscriberDevices.devices.findIndex(item => item.macAddress === macAddress);
  if (index < 0) {
    return null;
  } else {
    return index;
  }
}

export function getGuestNetworkIndex(wifiNetworks) {
  if (wifiNetworks && wifiNetworks.wifiNetworks) {
    // Return the first guest network index
    let index = wifiNetworks.wifiNetworks.findIndex(network => network.type === WifiNetworkTypeEnum.Guest);
    if (index < 0) {
      return null;
    } else {
      return index;
    }
  }

  return null;
}

export function getClientName(client, subscriberDevices) {
  let name = null;
  let clientMacAddress = client ? client.macAddress : null;

  // Priority goes to the the subscriber device name if it exists
  let subscriberDeviceIndex = getSubscriberDeviceIndexForMac(subscriberDevices, clientMacAddress);
  if (subscriberDeviceIndex !== null) {
    name = subscriberDevices.devices[subscriberDeviceIndex].name;
  }

  if (!name) {
    if ('name' in client) {
      name = client.name;
    }
  }

  if (!name) {
    return displayValue(client, 'macAddress');
  }

  return name;
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

    // This information was provided by CB
    if (rssi <= -75) {
      return errorColor;
    } else if (rssi > -75 && rssi <= -60) {
      return warnColor;
    } else if (rssi > -60 && rssi < 0) {
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

export function getNetworkTypeItems() {
  return [
    { label: strings.network.selectorTypeMain, value: WifiNetworkTypeEnum.Main },
    { label: strings.network.selectorTypeGuest, value: WifiNetworkTypeEnum.Guest },
  ];
}

export function getNetworkEncryptionItems() {
  return [
    {
      label: strings.network.selectorEncryptionWpa1Personal,
      value: WifiNetworkEncryptionEnum.Wpa1Personal,
    },
    {
      label: strings.network.selectorEncryptionWpa2Personal,
      value: WifiNetworkEncryptionEnum.Wpa2Personal,
    },
    {
      label: strings.network.selectorEncryptionWpa3Personal,
      value: WifiNetworkEncryptionEnum.Wpa3Personal,
    },
    {
      label: strings.network.selectorEncryptionWpa12Personal,
      value: WifiNetworkEncryptionEnum.Wpa12Personal,
    },
    {
      label: strings.network.selectorEncryptionWpa23Personal,
      value: WifiNetworkEncryptionEnum.Wpa23Personal,
    },
  ];
}

export function getNetworkBandsSelectorItems(radios) {
  let items = [{ label: strings.network.selectorBandsAll, value: WifiNetworkBandsEnum.All }];

  // The radios field contains a list of support bands (and other information) for the particular
  // access point. So look through this array and make sure only to present the bands that are
  // supported.
  let supportedBands = [];
  if (radios) {
    radios.forEach(radio => {
      supportedBands.push(radio.band);
    });
  }

  if (supportedBands) {
    if (supportedBands.includes(WifiNetworkBandsEnum._2G)) {
      items.push({ label: strings.network.selectorBands2g, value: WifiNetworkBandsEnum._2G });
    }

    if (supportedBands.includes(WifiNetworkBandsEnum._5G)) {
      items.push({ label: strings.network.selectorBands5g, value: WifiNetworkBandsEnum._5G });
    }

    if (supportedBands.includes(WifiNetworkBandsEnum._5Gl)) {
      items.push({ label: strings.network.selectorBands5gl, value: WifiNetworkBandsEnum._5Gl });
    }

    if (supportedBands.includes(WifiNetworkBandsEnum._5Gu)) {
      items.push({ label: strings.network.selectorBands5gu, value: WifiNetworkBandsEnum._5Gu });
    }

    if (supportedBands.includes(WifiNetworkBandsEnum._6G)) {
      items.push({ label: strings.network.selectorBands6g, value: WifiNetworkBandsEnum._6G });
    }
  }

  return items;
}

export function logStringifyPretty(obj, title) {
  if (title) {
    console.log(title, JSON.stringify(obj, null, '\t'));
  } else {
    console.log(JSON.stringify(obj, null, '\t'));
  }
}

export async function completeSignOut(navigation) {
  await clearSession();

  if (navigation) {
    navigation.reset({
      index: 0,
      routes: [{ name: 'SignIn' }],
    });
  }
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
      await clearSession();
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

      await setSession(responseData);

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

    await clearSession();

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

export function setSubscriberInformationInterval(extraUpdateFn, nagivation) {
  async function checkSubscriberInformation() {
    try {
      let promisesToHandle = [getSubscriberInformation(false)];

      if (extraUpdateFn) {
        promisesToHandle.push(extraUpdateFn());
      }

      await Promise.all(promisesToHandle);
    } catch (error) {
      // do nothing
      if (error && error.response && error.response.status === 403) {
        handleApiError(strings.errors.titleAuthenticationRefresh, error, nagivation);
      }
    }
  }

  let intervalId = setInterval(checkSubscriberInformation, 60000);
  checkSubscriberInformation();

  return intervalId;
}

export async function addAccessPoint(jsonObject) {
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

  // Get or create the access points list
  let accessPoints = null;

  if (!updatedSubsciberInformation.accessPoints || !updatedSubsciberInformation.accessPoints.list) {
    // No access points list, so create one
    updatedSubsciberInformation.accessPoints = {
      list: [],
    };
  }
  accessPoints = updatedSubsciberInformation.accessPoints.list;

  // Special case - if there is an entry with an all-zero MAC address it should be overritten, as it is
  // just a placeholder
  let blankAccessPointIndex = accessPoints.findIndex(ap => ap.macAddress === '000000000000');
  if (blankAccessPointIndex >= 0) {
    let accessPoint = accessPoints[blankAccessPointIndex];

    for (const [key, value] of Object.entries(jsonObject)) {
      if (accessPoint[key] !== value) {
        accessPoint[key] = value;
      }
    }
  } else {
    accessPoints.push(jsonObject);
  }

  await modifySubscriberInformation(updatedSubsciberInformation);
}

export async function deleteAccessPoint(accessPointIndex) {
  if (accessPointIndex === null) {
    // Do nothing if the selected access point index is null
    return;
  }

  let subscriberInformation = store.getState().subscriberInformation.subscriberInformation;
  if (!subscriberInformation) {
    throw new Error(strings.errors.internal);
  }

  // Clone the current subscriber information
  let updatedSubsciberInformation = JSON.parse(JSON.stringify(subscriberInformation));
  let accessPoints = null;

  if (
    updatedSubsciberInformation &&
    updatedSubsciberInformation.accessPoints &&
    updatedSubsciberInformation.accessPoints.list
  ) {
    accessPoints = updatedSubsciberInformation.accessPoints.list;
  }

  if (!accessPoints || accessPoints.length < accessPointIndex) {
    console.error('Access Point index out of range');
    throw new Error(strings.errors.internal);
  }

  // Remove the element from the array
  accessPoints.splice(accessPointIndex, 1);
  await modifySubscriberInformation(updatedSubsciberInformation);
}

export async function modifySubscriberInformation(updatedJson, configChanged = true, applyConfigOnly = false) {
  if (!subscriberInformationApi) {
    throw new Error(strings.errors.internal);
  }

  if (!updatedJson) {
    throw new Error(strings.errors.internal);
  }

  const response = await subscriberInformationApi.modifySubscriberInfo(configChanged, applyConfigOnly, updatedJson);
  if (!response || !response.data) {
    throw new Error(strings.errors.invalidResponse);
  }

  logStringifyPretty(response.data, response.request.responseURL);

  // The response is the subscriber list again, so save the updated information. Note that the
  // setSubscriberInformation call will only change the state if something actually changed.
  store.dispatch(setSubscriberInformation(response.data));
}

export async function modifyAccessPoint(accessPointId, jsonObject) {
  // Note the expectation is that is specific to the access point and NOT any of the
  // internet connection settings!
  // This will NOT trigger a configuration update.
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

  await modifySubscriberInformation(updatedSubsciberInformation, false);
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

export async function modifySubscriberDevice(accessPointId, deviceIndex, jsonObject) {
  if (!jsonObject) {
    // Do nothing
    return;
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

  console.log(subscriberDevices);

  if (deviceIndex === null) {
    subscriberDevices.devices.push(jsonObject);
  } else {
    let deviceToUpdate = subscriberDevices.devices[deviceIndex];
    for (const [key, value] of Object.entries(jsonObject)) {
      deviceToUpdate[key] = value;
    }
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

// allSettled polyfill
Promise.allSettled =
  Promise.allSettled ||
  (promises =>
    Promise.all(
      promises.map(promise =>
        promise
          .then(value => ({
            status: 'fulfilled',
            value,
          }))
          .catch(reason => ({
            status: 'rejected',
            reason,
          })),
      ),
    ));
