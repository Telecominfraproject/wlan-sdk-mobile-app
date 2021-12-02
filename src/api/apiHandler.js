// Used the following for a basis for generating react-native from OpenAPI
// https://majidlotfinia.medium.com/openapi-generator-for-react-native-by-swagger-58847cadd9e8
import 'react-native-url-polyfill/auto';
import { strings } from '../localization/LocalizationStrings';
import axios from 'axios';
import { store } from '../store/Store';
import { setSystemInfo } from '../store/SystemInfoSlice';
import { showGeneralError } from '../Utils';
import {
  AuthenticationApiFactory,
  ClientsApiFactory,
  DeviceCommandsApiFactory,
  SubscriberInformationApiFactory,
  WiFiClientsApiFactory,
  Configuration as UserPortalConfiguration,
} from './generated/owUserPortalApi';
import {
  hasInternetCredentials,
  setInternetCredentials,
  getInternetCredentials,
  resetInternetCredentials,
} from 'react-native-keychain';
import { EmailApiFactory } from './generated/owSecurityApi';

const axiosInstance = axios.create({});
axiosInstance.interceptors.request.use(
  config => {
    const state = store.getState();
    const session = state.session.value;
    if (session) {
      config.headers.Authorization = 'Bearer ' + session.access_token;
    }

    return config;
  },
  error => {
    Promise.reject(error);
  },
);

// Setup the User Portal APIs
const userPortalConfig = new UserPortalConfiguration();
var baseUrlUserPortalUrl = null;
var authenticationApi = null;
var deviceCommandsApi = null;
var subscriberInformationApi = null;
var wiredClientsApi = null;
var wifiClientsApi = null;

store.subscribe(generateApis);
generateApis();

function generateApis() {
  // Setup the User Portal (TODO - also add to the setApiSystemInfo)
  baseUrlUserPortalUrl = getBaseUrlForApi('owuserport');
  authenticationApi = baseUrlUserPortalUrl
    ? new AuthenticationApiFactory(userPortalConfig, baseUrlUserPortalUrl, axiosInstance)
    : null;
  deviceCommandsApi = baseUrlUserPortalUrl
    ? new DeviceCommandsApiFactory(userPortalConfig, baseUrlUserPortalUrl, axiosInstance)
    : null;
  subscriberInformationApi = baseUrlUserPortalUrl
    ? new SubscriberInformationApiFactory(userPortalConfig, baseUrlUserPortalUrl, axiosInstance)
    : null;
  wifiClientsApi = baseUrlUserPortalUrl
    ? new WiFiClientsApiFactory(userPortalConfig, baseUrlUserPortalUrl, axiosInstance)
    : null;
  wiredClientsApi = baseUrlUserPortalUrl
    ? new ClientsApiFactory(userPortalConfig, baseUrlUserPortalUrl, axiosInstance)
    : null;
}

// Get the base URL from the System Info. This is returned in a call to SystemInfo and it
// is needed in order to provide the proper base URIs for the other API systems.
function getBaseUrlForApi(type) {
  const state = store.getState();

  if (type === 'owsec') {
    // The owsec currently comes from the branding information, while all
    // other information is from the endpoints API
    const brandInfo = state.brandInfo.value;
    if (brandInfo && brandInfo.baseUrlSecurityApi) {
      return brandInfo.baseUrlSecurityApi + '/api/v1';
    }
  } else {
    const systemInfo = state.systemInfo.value;

    if (systemInfo && systemInfo.endpoints) {
      const endpoints = systemInfo.endpoints;
      const endpointsLength = endpoints.length;

      for (let i = 0; i < endpointsLength; i++) {
        let info = endpoints[i];

        if (info.type === type) {
          return info.uri + '/api/v1';
        }
      }
    }
  }

  return null;
}

function setApiSystemInfo(systemInfo) {
  // Set the state, then we can use the getBaseUrlForApi to verify it has the proper information
  store.dispatch(setSystemInfo(systemInfo));

  let valid = true;
  const typesToValidate = ['owgw']; // Include all API types that might be used
  const typesToValidateLength = typesToValidate.length;

  for (let i = 0; i < typesToValidateLength; i++) {
    let type = typesToValidate[i];

    if (!getBaseUrlForApi(type)) {
      valid = false;
      break;
    }
  }

  if (!valid) {
    throw new Error(strings.errors.missingEndpoints);
  }
}

async function hasCredentials() {
  return hasInternetCredentials(baseUrlUserPortalUrl);
}

async function setCredentials(email, password) {
  return setInternetCredentials(baseUrlUserPortalUrl, email, password);
}

async function getCredentials() {
  return getInternetCredentials(baseUrlUserPortalUrl);
}

async function clearCredentials() {
  return resetInternetCredentials(baseUrlUserPortalUrl);
}

function getSubscriberAccessPointInfo(subscriberInformation, accessPointId, key) {
  if (!subscriberInformation) {
    return null;
  }

  // A null 'accessPointId' will select the first access point in the list
  // A null 'key' will return the access point found, if any

  let accessPoint = null;
  let accessPoints = subscriberInformation.accessPoints;
  let accessPointsList = accessPoints ? accessPoints.list : null;

  if (!accessPointsList || accessPointsList.length === 0) {
    return null;
  }

  if (!accessPointId) {
    // If no access point set, use the first one
    accessPoint = accessPointsList[0];
  } else {
    accessPoint = accessPointsList.find(item => item.id === accessPointId);
  }

  if (!key) {
    return accessPoint;
  } else {
    return accessPoint[key];
  }
}

function handleApiError(title, error) {
  const state = store.getState();
  const session = state.session.value;
  let message = strings.errors.unknown;

  if (error.response) {
    switch (error.response.status) {
      case 400:
      case 404:
        message = strings.errors.internal;
        break;

      case 403:
        if (session === null) {
          // If not currently signed in then return a credentials error
          message = strings.errors.credentials;
        } else {
          // Otherwise indicate their token failed
          message = strings.errors.token;
        }
        break;

      default:
        message = error.message;
    }
  } else if (error.request) {
    switch (error.request.status) {
      case 0:
        message = strings.errors.failedToConnect;
        break;

      default:
        message = error.request.responseText;
    }
  } else {
    message = error.message;
  }

  showGeneralError(title, message);
}

export {
  authenticationApi,
  deviceCommandsApi,
  subscriberInformationApi,
  wifiClientsApi,
  wiredClientsApi,
  getSubscriberAccessPointInfo,
  handleApiError,
  setApiSystemInfo,
  hasCredentials,
  setCredentials,
  getCredentials,
  clearCredentials,
};
