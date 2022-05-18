// Used the following for a basis for generating react-native from OpenAPI
// https://majidlotfinia.medium.com/openapi-generator-for-react-native-by-swagger-58847cadd9e8
import 'react-native-url-polyfill/auto';
import axios from 'axios';
import { strings } from '../localization/LocalizationStrings';
import { store } from '../store/Store';
import { showGeneralError, logStringifyPretty, completeSignOut } from '../Utils';
import {
  AuthenticationApiFactory,
  ClientsApiFactory,
  Configuration as UserPortalConfiguration,
  DeviceCommandsApiFactory,
  DeviceStatisticsApiFactory,
  HomeDeviceModeTypeEnum,
  InlineObjectPatternEnum,
  InternetConnectionTypeEnum,
  MFAApiFactory,
  SubMfaConfigTypeEnum,
  SubscriberInformationApiFactory,
  SubscriberRegistrationApiFactory,
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

// Setup the User Portal APIs
var subscriberPortalUrl = null;
var baseUserPortalUrl = null;
var authenticationApi = null;
var deviceCommandsApi = null;
var deviceStatisticsApi = null;
var mfaApi = null;
var subscriberInformationApi = null;
var subscriberRegistrationApi = null;
var wiredClientsApi = null;
var wifiClientsApi = null;

// This instance is only used for authentication, it has no refresh check as this
// would result in problems during authentication calls.
const axiosInstanceAuthentication = axios.create({});

// This instance will check for token refresh. This will NOT be used for authentication calls as
// it would end up in loops.
const axiosInstanceWithRefresh = axios.create({});

axiosInstanceWithRefresh.interceptors.request.use(
  // This interceptor is for checking on when to use the refresh token to try and
  // retreive another valid access token
  async function (config) {
    let session = await getSession();
    let now = Math.floor(Date.now() / 1000);

    if (session) {
      let nearExpired = session.created + Math.floor(session.expires_in * 0.75);
      if (now >= nearExpired) {
        console.log('Token expired, refreshing');

        try {
          if (authenticationApi) {
            let response = await authenticationApi.getAccessToken(
              {
                refreshToken: session.refresh_token,
              },
              null,
              false,
              false,
              false,
              false,
              'refresh_token',
            );

            if (!response || !response.data) {
              throw new Error(strings.errors.internal);
            }

            let responseData = response.data;
            logStringifyPretty(responseData, 'Refresh Token');
            await setSession(responseData);

            // Update the header with the new Bearer
            config.headers.Authorization = 'Bearer ' + response.data.access_token;
          }
        } catch (error) {
          console.log('Refreshing token failed');

          // Clear any session information
          await clearSession();

          // Clear the current Authorization as this guarantees that the current command will fail
          // Would prefer to send an error here - but it does not seem that this can occur
          config.headers.Authorization = '';
        }
      }
    }

    return config;
  },
  error => Promise.reject(error),
  {},
);

const userPortalConfig = new UserPortalConfiguration({ accessToken: getAccessTokenForBearer });
store.subscribe(generateApis);
// Generate the APIs
generateApis();

function generateApis() {
  const state = store.getState();
  const brandInfo = state.brandInfo.value;

  if (brandInfo && brandInfo.subscriber_portal) {
    if (!baseUserPortalUrl || subscriberPortalUrl !== brandInfo.subscriber_portal) {
      baseUserPortalUrl = brandInfo.subscriber_portal + '/api/v1';
      authenticationApi = new AuthenticationApiFactory(
        userPortalConfig,
        baseUserPortalUrl,
        axiosInstanceAuthentication,
      );
      deviceCommandsApi = new DeviceCommandsApiFactory(userPortalConfig, baseUserPortalUrl, axiosInstanceWithRefresh);
      deviceStatisticsApi = new DeviceStatisticsApiFactory(
        userPortalConfig,
        baseUserPortalUrl,
        axiosInstanceWithRefresh,
      );
      mfaApi = new MFAApiFactory(userPortalConfig, baseUserPortalUrl, axiosInstanceWithRefresh);
      subscriberInformationApi = new SubscriberInformationApiFactory(
        userPortalConfig,
        baseUserPortalUrl,
        axiosInstanceWithRefresh,
      );
      subscriberRegistrationApi = new SubscriberRegistrationApiFactory(
        userPortalConfig,
        baseUserPortalUrl,
        axiosInstanceWithRefresh,
      );
      wifiClientsApi = new WiFiClientsApiFactory(userPortalConfig, baseUserPortalUrl, axiosInstanceWithRefresh);
      wiredClientsApi = new ClientsApiFactory(userPortalConfig, baseUserPortalUrl, axiosInstanceWithRefresh);
    }
  } else {
    subscriberPortalUrl = null;
    baseUserPortalUrl = null;
    authenticationApi = null;
    deviceCommandsApi = null;
    deviceStatisticsApi = null;
    mfaApi = null;
    subscriberInformationApi = null;
    subscriberRegistrationApi = null;
    wifiClientsApi = null;
    wiredClientsApi = null;
  }
}

async function getAccessTokenForBearer() {
  console.log('get token');
  const session = await getSession();
  if (session) {
    return session.access_token;
  }

  return null;
}

async function hasSession() {
  return hasInternetCredentials(baseUserPortalUrl);
}

async function setSession(session) {
  if (session) {
    return await setInternetCredentials(baseUserPortalUrl, 'session', JSON.stringify(session));
  } else {
    return await setInternetCredentials(baseUserPortalUrl, 'session', null);
  }
}

async function getSession() {
  let jsonSessionString = await getInternetCredentials(baseUserPortalUrl);
  if (jsonSessionString && jsonSessionString.password) {
    return JSON.parse(jsonSessionString.password);
  }

  return null;
}

async function clearSession() {
  return await resetInternetCredentials(baseUserPortalUrl);
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

function handleApiError(title, error, navigation) {
  let signOut = false;
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
        signOut = true;
        break;

      default:
        if (error.response && error.response.data && error.response.data.ErrorDescription) {
          message = error.response.data.ErrorDescription;
        } else {
          message = error.message;
        }
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

  if (signOut) {
    completeSignOut(navigation);
  }
}

function get403ErrorFromData(error) {
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

      case 14:
        return strings.errors.apiCannotRefreshToken;

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
  deviceStatisticsApi,
  mfaApi,
  subscriberInformationApi,
  subscriberRegistrationApi,
  wifiClientsApi,
  wiredClientsApi,
  HomeDeviceModeTypeEnum,
  InternetConnectionTypeEnum,
  InlineObjectPatternEnum,
  SubMfaConfigTypeEnum,
  WifiNetworkTypeEnum,
  WifiNetworkBandsEnum,
  WifiNetworkEncryptionEnum,
  hasSession,
  setSession,
  getSession,
  clearSession,
  getSubscriberAccessPointInfo,
  handleApiError,
};
