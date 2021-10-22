// Used the following for a basis for generating react-native from OpenAPI
// https://majidlotfinia.medium.com/openapi-generator-for-react-native-by-swagger-58847cadd9e8
import 'react-native-url-polyfill/auto';
import {AuthenticationApiFactory, Configuration as SecurityConfiguration} from './generated/owSecurityApi';
import {DevicesApiFactory, Configuration as GatewayConfiguration} from './generated/owGatewayApi';

import axios from 'axios';
import {useStore} from '../Store';

const axiosInstance = axios.create({});
axiosInstance.interceptors.request.use(
  config => {
    let session = useStore.getState().session;
    if (session) {
      config.headers.Authorization = 'Bearer ' + useStore.getState().session.access_token;
    }

    return config;
  },
  error => {
    Promise.reject(error);
  },
);

const securityConfig = new SecurityConfiguration();
const gatewayConfig = new GatewayConfiguration();

const authenticationApi = new AuthenticationApiFactory(
  securityConfig,
  'https://14oranges.arilia.com:16001/api/v1',
  axiosInstance,
);
const devicesApi = new DevicesApiFactory(gatewayConfig, 'https://14oranges.arilia.com:16002/api/v1', axiosInstance);

export {authenticationApi, devicesApi};
