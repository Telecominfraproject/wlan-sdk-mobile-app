import { Alert } from 'react-native';
import { strings } from './localization/LocalizationStrings';
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
