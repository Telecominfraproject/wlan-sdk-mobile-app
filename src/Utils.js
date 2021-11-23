import { Alert } from 'react-native';
import { strings } from './localization/LocalizationStrings';
import { errorColor, warnColor, okColor } from './AppStyle';
import { store } from './store/Store';
import { clearSession } from './store/SessionSlice';
import { clearCredentials } from './api/apiHandler';

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

export function signOut(navigation) {
  store.dispatch(clearSession());
  clearCredentials();

  navigation.reset({
    index: 0,
    routes: [{ name: 'SignIn' }],
  });
}
