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

export function completeSignOut(navigation) {
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
      navigation.navigate('ResetPassword', { userId: userId });
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
    store.dispatch(setSubscriberInformationLoading(false));
  }
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

  // TODO: Verify the response code once API has been fully implemented
  logStringifyPretty(response.data, response.request.responseURL);
  if (response.data.Code !== 0) {
    throw new Error(strings.errors.invalidResponse);
  }

  // Reload the subscriber information, and wait for it
  await getSubscriberInformation(true);
}

export async function modifySubscriberDevice(subscriberInformation, accessPointId, device, jsonObject) {
  if (!accessPointId || !device || !jsonObject) {
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
