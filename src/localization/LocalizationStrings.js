import LocalizedStrings from 'react-native-localization';

export const strings = new LocalizedStrings({
  en: {
    errors: {
      badEmail: 'Please enter a valid email.',
      badFormat: 'Please match the requested format.',
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
      titleMFA: 'MFA Error',
      token: 'Credentials no longer valid, please sign-in again.',
      unknown: 'Unknown error.',
    },
    messages: {
      requestSent: 'Request successfully sent.',
      resetEmail:
        "You should soon receive an email containing the instructions to reset your password. Please make sure to check your spam if you can't find the email.",
      titleMessage: 'Message',
    },
    placeholders: {
      code: 'Code',
      confirmPassword: 'Confirm Password',
      email: 'Email',
      newPassword: 'New Password',
      password: 'Password',
      username: 'Username',
    },
    buttons: {
      cancel: 'Cancel',
      forgotPassword: 'Forgot Password',
      resendCode: 'Resend Code',
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
    forgotPassword: {
      title: 'Reset Password',
      description: 'Please enter your email to reset your password.',
    },
    passwordRequirements: {
      req1: 'Must be at least 8 characters long',
      req2: 'Must contain 1 uppercase letter',
      req3: 'Must contain 1 lowercase letter',
      req4: 'Must contain 1 digit',
      req5: 'Must contain 1 special character',
    },
    dashboard: {
      network: 'Network',
      internet: 'Internet',
      connectedDevices: 'Connected Devices',
      guestNetwork: 'Guest Network',
    },
  },
});
