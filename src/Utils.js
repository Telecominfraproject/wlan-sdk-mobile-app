import { Alert } from 'react-native';
import { strings } from './localization/LocalizationStrings';
import { errorColor, warnColor, okColor } from './AppStyle';
import { store } from './store/Store';
import { clearSession, setSession } from './store/SessionSlice';
import { setSubscriberInformation, clearSubscriberInformation } from './store/SubscriberInformationSlice';
import { setSubscriberInformationLoading } from './store/SubscriberInformationLoadingSlice';
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

  return strings.messages.empty;
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
      // Make sure to clear any session/subscriber information (this will ensure proper API error message as well, see 403 errors)
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

    if (responseData.method) {
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
    }

    store.dispatch(setSession(responseData));

    // Get the subscriber information
    await getSubscriberInformation(true);

    // Completed sign-in
    if (setLoadingFn) {
      setLoadingFn(false);
    }

    navigation.replace('Main');
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

export async function getSubscriberInformation(subscriberInformation, setLoadingFlag) {
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

    // Only update the state if the last modified is different than the current one
    // This will ensure that there are less UI updates as this will often be linked to renders.
    if (isFieldDifferent(subscriberInformation, response.data, 'modified')) {
      logStringifyPretty(response.data, response.request.responseURL);
      store.dispatch(setSubscriberInformation(response.data));
    }
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

export function setSubscriberInformationInterval(subscriberInformation, extraUpdateFn) {
  async function checkSubscriberInformation() {
    try {
      await getSubscriberInformation(subscriberInformation, false);
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

  // The response is the subscriber list again, so save the updated information
  store.dispatch(setSubscriberInformation(response.data));
}

export async function modifySubscriberDevice(subscriberInformation, accessPointId, device, jsonObject) {
  if (!jsonObject) {
    // Do nothing
    return;
  }

  // accessPointId can be null - it means the first one
  if (!subscriberInformation || !device) {
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

export async function modifySubscriberDnsInformation(subscriberInformation, accessPointId, jsonObject) {
  if (!jsonObject) {
    // Do nothing if the object is null or empty
    return;
  }

  // accessPointId can be null - it just means use the first access point, so no check for this
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
  if (dnsConfiguration.custom && (dnsConfiguration.primary || dnsConfiguration.secondary)) {
    dnsConfiguration.ISP = false;
  } else {
    dnsConfiguration.ISP = true;
    dnsConfiguration.custom = false;
  }

  await modifySubscriberInformation(updatedSubsciberInformation);
}
