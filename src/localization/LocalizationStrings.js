import LocalizedStrings from 'react-native-localization';

export const strings = new LocalizedStrings({
  en: {
    errors: {
      signInTitle: 'Sign In Error',
      systemSetupTitle: 'System Setup Error',
      deviceListTitle: 'Devices Error',
      forgotPasswordTitle: 'Forgot Password Error',
      resetPasswordTitle: 'Reset Password Error',
      credentials: 'Invalid credentials, check username and/or password.',
      failedToConnect: 'Failed to connect to server, check connections.',
      missingEndpoints: 'System is not set up correct - missing configuration information.',
      token: 'Credentials no longer valid, please sign-in again.',
      internal: 'Internal error.',
      unknown: 'Unknown error.',
    },
    messages: {
      resetEmail:
        "You should soon receive an email containing the instructions to reset your password. Please make sure to check your spam if you can't find the email.",
    },
    placeholders: {
      username: 'Username',
      password: 'Password',
      newPassword: 'New Password',
      email: 'Email',
    },
    buttons: {
      forgotPassword: 'Forgot Password',
      signIn: 'Sign In',
      signOut: 'Sign Out',
      sendEmail: 'Send Email',
      submit: 'Submit',
    },
    brandSelector: {
      title: 'Welcome',
      description: 'Please select your provider to continue.',
    },
    signIn: {
      description: 'Please sign in to your account.',
    },
  },
});
