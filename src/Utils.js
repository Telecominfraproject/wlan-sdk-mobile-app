import {Alert} from 'react-native';

export function showGeneralError(title, message) {
  console.error(title + ' -> ' + message);
  Alert.alert(title, message, null, {cancelable: true});
}
