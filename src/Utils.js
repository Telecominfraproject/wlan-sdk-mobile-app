import { Alert } from 'react-native';
import { strings } from './localization/LocalizationStrings';
import { errorColor, warnColor, okColor } from './AppStyle';
import { store } from './store/Store';
import { clearSession, setSession } from './store/SessionSlice';
import { setSubscriberInformation } from './store/SubscriberInformationSlice';
import {
  setApiSystemInfo,
  clearCredentials,
  authenticationApi,
  subscriberInformationApi,
  getSubscriberAccessPointInfo,
  handleApiError,
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

export async function completeSignIn(navigation, session) {
  store.dispatch(setSession(session));

  // The system info is necessary before moving on to the next view as it'll provide
  // the endpoints needed for communicating with the other systems
  if (authenticationApi) {
    // TODO: This is no longer needed
    const responseSystem = await authenticationApi.getSystemInfo();
    if (!responseSystem || !responseSystem.data) {
      throw new Error(strings.errors.invalidResponse);
    }

    console.log(responseSystem.data);
    setApiSystemInfo(responseSystem.data);
  }

  // Get the subscriber info, allows for  main access point
  if (!subscriberInformationApi) {
    // If the API is not currently available then just keep going. This is temporary until the
    // API has been completed. This is just expected sample data.
    store.dispatch(
      setSubscriberInformation({
        firstName: 'Bill',
        initials: 'BT',
        lastName: 'Tester',
        phoneNumber: '555-665-2342',
        secondaryEmail: 'billTester@example.com',
        accessPoints: {
          list: [
            {
              id: 'access_id_1',
              macAddress: '00105e0053af',
              name: 'Access Point',
              subscriberDevices: {
                created: 0,
                modified: 0,
                devices: [
                  {
                    name: 'string',
                    description: 'string',
                    macAddress: 'string',
                    manufacturer: 'string',
                    firstContact: 0,
                    lastContact: 0,
                    group: 'string',
                    icon: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    suspended: true,
                    ip: 'string',
                    created: 0,
                    modified: 0,
                    schedule: {
                      description: 'string',
                      created: 0,
                      modified: 0,
                      schedule: [
                        {
                          description: 'string',
                          day: 'string',
                          rangeList: ['string'],
                        },
                      ],
                    },
                  },
                ],
              },
              ipReservations: {
                created: 0,
                modified: 0,
                reservations: [
                  {
                    nickname: 'string',
                    ipAddress: '198.51.100.42',
                    macAddress: 'string',
                  },
                ],
              },
              address: {
                buildingName: 'string',
                addressLines: ['string'],
                city: 'string',
                state: 'string',
                postal: 'string',
                country: 'string',
                phones: ['string'],
                mobiles: ['string'],
              },
              wifiNetworks: {
                created: 0,
                modified: 0,
                networks: [
                  {
                    type: 'main',
                    name: 'Main Network',
                    password: 'string',
                    encryption: 'string',
                    bands: ['2G'],
                  },
                ],
              },
              internetConnection: {
                type: 'manual',
                username: 'string',
                password: 'string',
                ipAddress: '198.51.100.42',
                subnetMask: '198.51.100.42',
                defaultGateway: '198.51.100.42',
                primaryDns: '198.51.100.42',
                secondaryDns: '198.51.100.42',
                created: 0,
                modified: 0,
              },
              deviceMode: {
                type: 'automatic',
                enableLEDS: true,
                subnet: '198.51.100.42',
                subnetMask: '198.51.100.42',
                startIP: '198.51.100.42',
                endIP: '198.51.100.42',
                created: 0,
                modified: 0,
              },
              dnsConfiguration: {
                ISP: true,
                custom: true,
                primary: '198.51.100.42',
                seconfary: '198.51.100.42',
              },
            },
          ],
        },
        serviceAddress: {
          buildingName: 'string',
          addressLines: ['string'],
          city: 'string',
          state: 'string',
          postal: 'string',
          country: 'string',
          phones: ['string'],
          mobiles: ['string'],
        },
        billingAddress: {
          buildingName: 'string',
          addressLines: ['string'],
          city: 'string',
          state: 'string',
          postal: 'string',
          country: 'string',
          phones: ['string'],
          mobiles: ['string'],
        },
      }),
    );
  } else {
    const responseSubscriber = await subscriberInformationApi.getSubscriberInfo();
    if (!responseSubscriber || !responseSubscriber.data) {
      throw new Error(strings.errors.invalidResponse);
    }

    console.log(responseSubscriber.data);
    store.dispatch(setSubscriberInformation(responseSystem.data));
  }

  navigation.replace('Main');
}

export async function updateSubscriberDevice(subscriberInformation, accessPointId, device, jsonObject) {
  if (!subscriberInformationApi) {
    // This is expected to be temporary
    return;
  }

  try {
    if (!accessPointId || !device || !jsonObject) {
      showGeneralError(strings.errors.titleDeviceDetails, strings.errors.internal);
      return;
    }

    let updatedSubsciberInformation = JSON.parse(JSON.stringify(subscriberInformation));
    let subscriberDevices = getSubscriberAccessPointInfo(
      updatedSubsciberInformation,
      accessPointId,
      'subscriberDevices',
    );

    if (!subscriberDevices) {
      showGeneralError(strings.errors.titleDeviceDetails, strings.errors.internal);
      return;
    }

    // TODO: This needs to be verified!
    let deviceToUpdate = subscriberDevices.find(item => item.macAddress === device.macAddress);
    for (const [key, value] of Object.entries(jsonObject)) {
      deviceToUpdate[key] = value;
    }

    const responseModify = await subscriberInformationApi.modifySubscriberInfo(updatedSubsciberInformation);

    if (!responseModify || !responseModify.data) {
      console.log(responseModify);
      console.error('Invalid response from modifySubscriberInfo');
      showGeneralError(strings.errors.titleDeviceDetails, strings.errors.invalidResponse);
    }

    console.log(responseModify.data);
    // TODO: Verify the response code once API has been implemented
    // Do nothing if everything work as expected
  } catch (error) {
    handleApiError(strings.errors.titleDeviceDetails, error);
  }
}
