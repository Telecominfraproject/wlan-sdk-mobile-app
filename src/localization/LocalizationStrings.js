import LocalizedStrings from 'react-native-localization';

export const strings = new LocalizedStrings({
  en: {
    errors: {
      badEmail: 'Please enter a valid email.',
      badFormat: 'Please match the requested format.',
      credentials: 'Invalid credentials, check username and/or password.',
      emptyField: '{0} field must not be empty.',
      emptyFields: 'Please fill in all fields',
      failedToConnect: 'Failed to connect to server, check connections.',
      internal: 'Internal error.',
      invalidCode: 'Invalid code.',
      invalidEmail: 'Invalid email provided.',
      invalidResponse: 'Invalid response recieved from the server.',
      noAccessPoint: 'No access point found.',
      noCredentials: 'No credentials provided.',
      noSubscriberDevice: 'Device not found',
      mismatchPassword: 'Password mismatch.',
      missingEndpoints: 'System is not set up correct - missing configuration information.',
      samePassword: 'Password is the same as old password.',
      titleDashboard: 'Dashboard',
      titleDeviceDetails: 'Device Error',
      titleDeviceList: 'Devices Error',
      titleForgotPassword: 'Forgot Password Error',
      titleMfa: 'Multi-Factor Authentication Error',
      titleNetwork: 'Network Error',
      titleProfile: 'Profile Error',
      titleResetPassword: 'Reset Password Error',
      titleSignIn: 'Sign In Error',
      titleSignUp: 'Sign Up Error',
      titleSms: 'SMS Error',
      titleSystemSetup: 'System Setup Error',
      titleUpdate: 'Update Error',
      token: 'Credentials no longer valid, please sign-in again.',
      unknown: 'Unknown error.',
      userNotFound: 'User not found.',
      validationError: 'Validation Error',
    },
    messages: {
      empty: '-',
      codeSent: 'Code has been sent.',
      passwordChanged: 'Password successfully changed.',
      requestSent: 'Request successfully sent.',
      resetEmailSent:
        "You should soon receive an email containing the instructions to reset your password. Please make sure to check your spam if you can't find the email.",
      titleMessage: 'Message',
    },
    navigator: {
      changePassword: 'Change Password',
      dashboard: 'Dashboard',
      details: 'Details',
      devices: 'Devices',
      forgotPassword: 'Forgot Password',
      network: 'Network',
      multiFactorAuthentication: 'Multi-Factor Authentiation',
      passwordReset: 'Password Reset',
      phoneVerification: 'Phone Verification',
      privacyPolicy: 'Privacy Policy',
      profile: 'Profile',
      signUp: 'Sign Up',
      termsConditions: 'Terms & Conditions',
    },
    placeholders: {
      addPhone: 'Add Phone',
      code: 'Code',
      confirmPassword: 'Confirm Password',
      email: 'Email',
      newPassword: 'New Password',
      password: 'Password',
      phoneNumber: 'Phone Number',
    },
    buttons: {
      cancel: 'Cancel',
      changeBrand: 'Change Brand',
      changePassword: 'Change Password',
      forgotPassword: 'Forgot Password',
      passwordPolicy: 'Password Policy',
      pause: 'Pause',
      privacyPolicy: 'Privacy Policy',
      reboot: 'Reboot',
      resendCode: 'Resend Code',
      resetPassword: 'Reset Password',
      sendCode: 'Send Code',
      signIn: 'Sign In',
      signOut: 'Sign Out',
      signUp: 'Sign Up',
      submit: 'Submit',
      termsConditions: 'Terms & Conditions',
      update: 'Update',
      unpause: 'Unpause',
      validate: 'Validate',
      verify: 'Verify',
    },
    accordionSection: {
      none: '- None -',
    },
    brandSelector: {
      description: 'Please select your provider to continue.',
      title: 'Welcome',
    },
    signIn: {
      title: 'Sign In',
      description: 'Please enter your email and password to sign in to your account.',
      noAccount: "Don't have an account?",
    },
    signUp: {
      title: 'Sign Up',
      description: 'Please enter a email and password to create an account.',
    },
    forgotPassword: {
      title: 'Reset Password',
      description: 'Please enter your email to reset your password.',
    },
    privacyPolicy: {
      title: 'Privacy Policy',
      content: 'This is the privacy policy.',
    },
    termsConditions: {
      title: 'Terms & Conditions',
      content: 'These are the terms and conditions.',
    },
    dashboard: {
      network: 'Network',
      internet: 'Internet',
      connectedDevices: 'Connected Devices',
      guestNetwork: 'Guest Network',
    },
    deviceList: {
      wifiClients: 'Wifi Clients',
      wiredClients: 'Wired Clients',
    },
    deviceDetails: {
      connected: 'Connected',
      connectionDetails: 'Connection Details',
      connectionType: 'Connection Type',
      connectionTypeWifi: 'WiFi ({0})',
      connectionTypeWired: 'Wired ({0})',
      description: 'Description',
      deviceDetails: 'Device Details',
      ipAddress: 'IP Address',
      group: 'Group',
      macAddress: 'MAC Address',
      manufacturer: 'Manufacturer',
      name: 'Name',
      status: 'Status',
      type: 'Type',
    },
    network: {
      defaultGateway: 'Default Gateway',
      firmware: 'Firmware',
      guestNetwork: 'Guest Network',
      internetSettings: 'Internet Settings',
      ipAdddress: 'IP Address',
      macAddress: 'MAC Address',
      mainNetwork: '{0} (Main)',
      networks: 'Networks',
      primaryDns: 'Primary DNS',
      productModel: 'Product Model',
      routerSettings: 'Router Settings',
      secondaryDns: 'Secondary DNS',
      serialNumber: 'Serial number',
      subnetMask: 'Subnet Mask',
      type: 'Type',
    },
    profile: {
      accountInfo: 'Account Information',
      app: 'App',
      email: 'Email',
      description: 'Description',
      manageDeviceGroups: 'Manage Device Groups',
      mfa: 'MFA',
      name: 'Name',
      notifications: 'Notifications',
      notificationHistory: 'Notification History',
      notificationPref: 'Notification Preference',
      off: 'Off',
      phone: 'Phone Number',
      role: 'Role',
      sms: 'SMS',
      version: 'Version',
      voice: 'Voice',
    },
  },
});
