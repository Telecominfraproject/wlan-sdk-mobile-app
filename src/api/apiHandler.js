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
  Configuration as UserPortalConfiguration,
  DeviceCommandsApiFactory,
  HomeDeviceModeTypeEnum,
  InlineObjectPatternEnum,
  InternetConnectionTypeEnum,
  MFAApiFactory,
  SubMfaConfigTypeEnum,
  SubscriberDeviceApiFactory,
  SubscriberInformationApiFactory,
  WiFiClientsApiFactory,
  WifiNetworkTypeEnum,
  WifiNetworkBandsEnum,
  WifiNetworkEncryptionEnum,
} from './generated/owUserPortalApi';
import {
  hasInternetCredentials,
  setInternetCredentials,
  getInternetCredentials,
  resetInternetCredentials,
} from 'react-native-keychain';

const axiosInstance = axios.create({});

function getAccessToken() {
  const state = store.getState();
  const session = state.session.value;
  if (session) {
    return session.access_token;
  }

  return null;
}

// Setup the User Portal APIs
const userPortalConfig = new UserPortalConfiguration({ accessToken: getAccessToken });
var baseUserPortalUrl = null;
var authenticationApi = null;
var deviceCommandsApi = null;
var mfaApi = null;
var subscriberDeviceApi = null;
var subscriberInformationApi = null;
var wiredClientsApi = null;
var wifiClientsApi = null;

// TODO: Generate APIs should handle only state changes it cares about
store.subscribe(generateApis);
generateApis();

function generateApis() {
  baseUserPortalUrl = getBaseUrlForApi('owuserport');
  authenticationApi = baseUserPortalUrl
    ? new AuthenticationApiFactory(userPortalConfig, baseUserPortalUrl, axiosInstance)
    : null;
  deviceCommandsApi = baseUserPortalUrl
    ? new DeviceCommandsApiFactory(userPortalConfig, baseUserPortalUrl, axiosInstance)
    : null;
  mfaApi = baseUserPortalUrl ? new MFAApiFactory(userPortalConfig, baseUserPortalUrl, axiosInstance) : null;
  subscriberDeviceApi = baseUserPortalUrl
    ? new SubscriberDeviceApiFactory(userPortalConfig, baseUserPortalUrl, axiosInstance)
    : null;
  subscriberInformationApi = baseUserPortalUrl
    ? new SubscriberInformationApiFactory(userPortalConfig, baseUserPortalUrl, axiosInstance)
    : null;
  wifiClientsApi = baseUserPortalUrl
    ? new WiFiClientsApiFactory(userPortalConfig, baseUserPortalUrl, axiosInstance)
    : null;
  wiredClientsApi = baseUserPortalUrl
    ? new ClientsApiFactory(userPortalConfig, baseUserPortalUrl, axiosInstance)
    : null;
}

// Get the base URL from the System Info. This is returned in a call to SystemInfo and it
// is needed in order to provide the proper base URIs for the other API systems.
function getBaseUrlForApi(type) {
  const state = store.getState();

  if (type === 'owuserport') {
    // The owsec currently comes from the branding information, while all
    // other information is from the endpoints API
    const brandInfo = state.brandInfo.value;
    if (brandInfo && brandInfo.subscriber_portal) {
      return brandInfo.subscriber_portal + '/api/v1';
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
  return hasInternetCredentials(baseUserPortalUrl);
}

async function setCredentials(email, password) {
  return setInternetCredentials(baseUserPortalUrl, email, password);
}

async function getCredentials() {
  return getInternetCredentials(baseUserPortalUrl);
}

async function clearCredentials() {
  return resetInternetCredentials(baseUserPortalUrl);
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
    if (accessPoint) {
      return accessPoint[key];
    }
  }
}

function handleApiError(title, error) {
  let message = strings.errors.unknown;

  if (error.response) {
    console.log(error.response);
    switch (error.response.status) {
      case 400:
      case 404:
        message = strings.errors.internal;
        break;

      case 403:
        message = get403ErrorFromData(error.response.data);
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

  if (error.response && error.response.data && error.response.data.ErrorDescription) {
    message = error.response.data.ErrorDescription;
  }

  showGeneralError(title, message);
}

function get403ErrorFromData(error) {
  console.log(error);
  let code = error ? error.ErrorCode : null;

  if (code) {
    switch (code) {
      case 1:
        return strings.errors.apiPasswordChangeRequired;

      case 2:
        return strings.errors.apiInvalidCredentials;

      case 3:
        return strings.errors.apiPasswordAlreadyUsed;

      case 4:
        return strings.errors.apiUsernamePendingVerification;

      case 5:
        return strings.errors.apiPasswordInvalid;

      case 6:
        return strings.errors.apiInternalError;

      case 7:
        return strings.errors.apiAccessDenied;

      case 8:
        return strings.errors.apiInvalidToken;

      case 9:
        return strings.errors.apiExpiredToken;

      case 10:
        return strings.errors.apiRateLimitExceeded;

      case 11:
        return strings.errors.apiBadMfaTransaction;

      case 12:
        return strings.errors.apiMfaFailure;

      case 13:
        return strings.errors.apiSecurityServiceUnreachable;

      default:
        if (error.ErrorDescription) {
          return error.ErrorDescription;
        }
    }
  }

  // Return the following if nothing else fits
  return strings.errors.apiInvalidToken;
}

export {
  authenticationApi,
  deviceCommandsApi,
  mfaApi,
  subscriberDeviceApi,
  subscriberInformationApi,
  wifiClientsApi,
  wiredClientsApi,
  HomeDeviceModeTypeEnum,
  InternetConnectionTypeEnum,
  InlineObjectPatternEnum,
  SubMfaConfigTypeEnum,
  WifiNetworkTypeEnum,
  WifiNetworkBandsEnum,
  WifiNetworkEncryptionEnum,
  getSubscriberAccessPointInfo,
  handleApiError,
  setApiSystemInfo,
  hasCredentials,
  setCredentials,
  getCredentials,
  clearCredentials,
};
