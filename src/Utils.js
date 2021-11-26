import { Alert } from 'react-native';
import { strings } from './localization/LocalizationStrings';
import { errorColor, warnColor, okColor } from './AppStyle';
import { store } from './store/Store';
import { clearSession, setSession } from './store/SessionSlice';
import { setSubscriber } from './store/SubscriberSlice';
import { setApiSystemInfo, clearCredentials, authenticationApi, subscriberInformationApi } from './api/apiHandler';

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

export function completeSignOut(navigation) {
  store.dispatch(clearSession());
  clearCredentials();

  navigation.reset({
    index: 0,
    routes: [{ name: 'SignIn' }],
  });
}

export async function completeSignIn(navigation, session) {
  store.dispatch(setSession(session));

  // The system info is necessary before moving on to the next view as it'll provide
  // the endpoints needed for communicating with the other systems
  const responseSystem = await authenticationApi.getSystemInfo();
  if (!responseSystem || !responseSystem.data) {
    throw new Error(strings.errors.invalidResponse);
  }

  console.log(responseSystem.data);
  setApiSystemInfo(responseSystem.data);

  // Get the subscriber info, allows for  main access point
  if (!subscriberInformationApi) {
    // If the API is not currently available then just keep going. This is temporary until the
    // API has been completed. This is just expected sample data.
    store.dispatch(
      setSubscriber({
        firstName: 'Bill',
        initials: 'BT',
        lastName: 'Tester',
        phoneNumber: '555-665-2342',
        secondaryEmail: 'billTester@example.com',
        accessPoints: {
          list: [
            {
              macAddress: '00:10:5e:00:53:af',
              name: 'Access Point',
              id: 'access_id_1',
            },
          ],
        },
      }),
    );
  } else {
    const responseSubscriber = await subscriberInformationApi.getSubscriberInfo();
    if (!responseSubscriber || !responseSubscriber.data) {
      throw new Error(strings.errors.invalidResponse);
    }

    console.log(responseSubscriber.data);
    store.dispatch(setSubscriber(responseSystem.data));
  }

  navigation.replace('Main');
}
