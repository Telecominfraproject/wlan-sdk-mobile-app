// Used the following for a basis for generating react-native from OpenAPI
// https://majidlotfinia.medium.com/openapi-generator-for-react-native-by-swagger-58847cadd9e8
import 'react-native-url-polyfill/auto';
import {strings} from '../localization/LocalizationStrings';
import axios from 'axios';
import {useStore} from '../Store';
import {showGeneralError} from '../Utils';
import {AuthenticationApiFactory, Configuration as SecurityConfiguration} from './generated/owSecurityApi';
import {DevicesApiFactory, Configuration as GatewayConfiguration} from './generated/owGatewayApi';

const axiosInstance = axios.create({});
axiosInstance.interceptors.request.use(
  config => {
    const session = useStore.getState().session;
    if (session) {
      config.headers.Authorization = 'Bearer ' + useStore.getState().session.access_token;
    }

    return config;
  },
  error => {
    Promise.reject(error);
  },
);

// Setup the Security APIs
const securityConfig = new SecurityConfiguration();
const authenticationApi = new AuthenticationApiFactory(
  securityConfig,
  'https://14oranges.arilia.com:16001/api/v1',
  axiosInstance,
);

// Setup the Gateway APIs, if the URL is set
const gatewayBaseUrl = getBaseUrlForApi('owgw');
const gatewayConfig = new GatewayConfiguration();
const devicesApi = gatewayBaseUrl ? new DevicesApiFactory(gatewayConfig, gatewayBaseUrl, axiosInstance) : null;

// Get the base URL from the System Info. This is returned in a call to SystemInfo and it
// is needed in order to provide the proper base URIs for the other API systems.
function getBaseUrlForApi(type) {
  const systemInfo = useStore.getState().systemInfo;
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

  return null;
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
        console.error(error);
        if (useStore.getState().session === null) {
          // If not currently signed in then return a credentials error
          message = strings.errors.credentials;
        } else {
          // Otherwise indicate their token failed
          message = strings.errors.token;
        }
        break;

      default:
        message = error;
    }
  } else if (error.request) {
    message = error.request;
  } else {
    message = error;
  }

  showGeneralError(title, message);
}

export {authenticationApi, devicesApi, handleApiError};
