import LocalizedStrings from 'react-native-localization';

export const strings = new LocalizedStrings({
  en: {
    errors: {
      signInTitle: 'Sign In Error',
      systemSetupTitle: 'System Setup Error',
      deviceListTitle: 'Devices Error',
      credentials: 'Invalid credentials, check username and/or password.',
      missingEndpoints: 'System is not set up correct - missing configuration information.',
      token: 'Credentials no longer valid, please sign-in again.',
      internal: 'Internal error.',
      unknown: 'Unknown error.',
    },
    placeholders: {
      username: 'Username',
      password: 'Password',
    },
    buttons: {
      forgotPassword: 'Forgot Password',
      signIn: 'Sign In',
      signOut: 'Sign Out',
    },
  },
});
