import LocalizedStrings from 'react-native-localization';

export const strings = new LocalizedStrings({
  en: {
    errors: {
      apiAccessDenied: 'Access denied. Trying signing in again.',
      apiPasswordAlreadyUsed: 'Password already in use, please select a different password.',
      apiPasswordChangeRequired: 'Password must be changed to continue.',
      apiInvalidCredentials: 'Invalid credentials, check username and/or password.',
      apiInvalidToken: 'Token is no longer valid, please sign in again.',
      apiPasswordInvalid: 'Password is invalid',
      apiUsernamePendingVerification: 'Email requires validation',
      badEmail: 'Please enter a valid email.',
      badPasswordFormat: 'Please match the requested password format.',
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
      titleAccessPointCommand: 'Access Point Command Error',
      titleDashboard: 'Dashboard',
      titleDeviceDetails: 'Device Error',
      titleDeviceList: 'Devices Error',
      titleDeviceRegistration: 'Device Registration Error',
      titleForgotPassword: 'Forgot Password Error',
      titleMfa: 'Multi-Factor Authentication Error',
      titleNetwork: 'Network Error',
      titleProfile: 'Profile Error',
      titleChangePassword: 'Change Password Error',
      titleSignIn: 'Sign In Error',
      titleSignUp: 'Sign Up Error',
      titleSms: 'SMS Error',
      titleSystemSetup: 'System Setup Error',
      titleUpdate: 'Update Error',
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
      deviceRegistration: 'Register Device',
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
      currentPassword: 'Current Password',
      deviceName: 'Device Name',
      email: 'Email',
      macAddress: 'MAC Address',
      newPassword: 'New Password',
      password: 'Password',
      phoneNumber: 'Phone Number',
    },
    common: {
      automatic: 'Automatic',
      bridge: 'Bridge',
      manual: 'Manual',
      nat: 'NAT',
      no: 'No',
      pppoe: 'PPPoE',
      yes: 'Yes',
    },
    buttons: {
      blink: 'Blink',
      cancel: 'Cancel',
      changeBrand: 'Change Brand',
      changePassword: 'Change Password',
      forgotPassword: 'Forgot Password',
      factoryReset: 'Factory Reset',
      ok: 'Ok',
      passwordPolicy: 'Password Policy',
      pause: 'Pause',
      privacyPolicy: 'Privacy Policy',
      reboot: 'Reboot',
      refresh: 'Refresh',
      register: 'Register',
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
    passwordChange: {
      title: 'Password Change',
      descriptionForced: 'You must change your password to continue.',
      description: 'Enter in your current password and a new password.',
    },
    deviceRegistration: {
      description:
        'No access point is currently registed on this account. Please register an access point to continue.',
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
      commandFactoryResetSuccess: 'Command to reset to factory defaults successfully sent.',
      commandFirmwareUpdateSuccess: 'Command to upgrade firmware successfully sent.',
      commandLightBlinkSuccess: 'Command to blink lights successfully sent.',
      commandRebootSuccess: 'Command to reboot successfully sent',
      commandRefreshSuccess: 'Command to refresh successfully sent.',
      confirmFactoryResetSuccess: 'Are you sure you want to reset to factory defaults?',
      confirmFirmwareUpdateSuccess: 'Are you sure you want to upgrade firmware?',
      confirmRebootSuccess: 'Are you sure you want to reboot?',
      customDnsSettings: 'Custom DNS Settings',
      defaultGateway: 'Default Gateway',
      deviceMode: 'Device Mode',
      endIp: 'End IP',
      enableLeds: 'LEDs Enabled',
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
      selectorCustom: 'Custom',
      selectorIsp: 'ISP',
      serialNumber: 'Serial number',
      startIp: 'Start IP',
      status: 'Status',
      subnet: 'Subnet',
      subnetMask: 'Subnet Mask',
      type: 'Type',
    },
    profile: {
      accountInfo: 'Account Information',
      app: 'App',
      email: 'Email',
      firstName: 'First Name',
      description: 'Description',
      manageDeviceGroups: 'Manage Device Groups',
      mfa: 'MFA',
      lastName: 'Last Name',
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
