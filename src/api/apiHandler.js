// Used the following for a basis for generating react-native from OpenAPI
// https://majidlotfinia.medium.com/openapi-generator-for-react-native-by-swagger-58847cadd9e8
import 'react-native-url-polyfill/auto';
import { strings } from '../localization/LocalizationStrings';
import axios from 'axios';
import store from '../store/Store';
import { setSystemInfo } from '../store/SystemInfoSlice';
import { showGeneralError } from '../Utils';
import { AuthenticationApiFactory, Configuration as SecurityConfiguration } from './generated/owSecurityApi';
import { DevicesApiFactory, Configuration as GatewayConfiguration } from './generated/owGatewayApi';

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

// Setup the Security APIs
const securityConfig = new SecurityConfiguration();
const authenticationApi = new AuthenticationApiFactory(
  securityConfig,
  'https://14oranges.arilia.com:16001/api/v1',
  axiosInstance,
);

// Setup the Gateway APIs, if the URL is set
const gatewayConfig = new GatewayConfiguration();
var devicesApi = null;

store.subscribe(generateDevicesApi);
generateDevicesApi();

function generateDevicesApi() {
  let url = getBaseUrlForApi('owgw');
  devicesApi = url ? new DevicesApiFactory(gatewayConfig, url, axiosInstance) : null;
}

// Get the base URL from the System Info. This is returned in a call to SystemInfo and it
// is needed in order to provide the proper base URIs for the other API systems.
function getBaseUrlForApi(type) {
  const state = store.getState();
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
        console.error(error);
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
    console.log(error.request.responseText);
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

export { authenticationApi, devicesApi, handleApiError, setApiSystemInfo };
