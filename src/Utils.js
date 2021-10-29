import { Alert } from 'react-native';
import { strings } from './localization/LocalizationStrings';

export function showGeneralError(title, message) {
  console.error(title + ' -> ' + message);
  Alert.alert(title, message, null, { cancelable: true });
}

export function showGeneralMessage(message) {
  Alert.alert(strings.messages.titleMessage, message);
}

export function logStringifyPretty(obj) {
  console.log(JSON.stringify(obj, null, '\t'));
}
