import LocalizedStrings from 'react-native-localization';

export const strings = new LocalizedStrings({
  en: {
    errors: {
      signInError: 'An error occurred while signing in: {0}',
      deviceListError: 'An error occurred while retrieving devices: {0}',
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
