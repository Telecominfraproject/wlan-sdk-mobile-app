import LocalizedStrings from 'react-native-localization';

export const strings = new LocalizedStrings({
  en: {
    errors: {
      credentials: 'Invalid credentials, check username and/or password.',
      emptyFields: 'Please fill in all fields',
      failedToConnect: 'Failed to connect to server, check connections.',
      internal: 'Internal error.',
      mismatchPassword: 'Password mismatch.',
      missingEndpoints: 'System is not set up correct - missing configuration information.',
      samePassword: 'Password is the same as old password.',
      titleSignIn: 'Sign In Error',
      titleSystemSetup: 'System Setup Error',
      titleDeviceList: 'Devices Error',
      titleForgotPassword: 'Forgot Password Error',
      titleResetPassword: 'Reset Password Error',
      token: 'Credentials no longer valid, please sign-in again.',
      unknown: 'Unknown error.',
    },
    messages: {
      message: 'Message',
      requestSent: 'Request successfully sent.',
      resetEmail:
        "You should soon receive an email containing the instructions to reset your password. Please make sure to check your spam if you can't find the email.",
    },
    placeholders: {
      confirmPassword: 'Confirm Password',
      email: 'Email',
      newPassword: 'New Password',
      password: 'Password',
      username: 'Username',
    },
    buttons: {
      cancel: 'Cancel',
      forgotPassword: 'Forgot Password',
      sendEmail: 'Send Email',
      signIn: 'Sign In',
      signOut: 'Sign Out',
      submit: 'Submit',
    },
    brandSelector: {
      description: 'Please select your provider to continue.',
      title: 'Welcome',
    },
    signIn: {
      description: 'Please sign in to your account.',
    },
  },
});
