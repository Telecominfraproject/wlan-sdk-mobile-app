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
      cannotChangePhoneMfa:
        'Cannot change your phone number while MFA (Multi-Factor Authentication) is configured to SMS. Please change MFA before updating your phone number.',
      emptyField: '{0} field must not be empty.',
      emptyFields: 'Please fill in all fields',
      failedToConnect: 'Failed to connect to server, check connections.',
      internal: 'Internal error.',
      invalidCode: 'Invalid validation code.',
      invalidEmail: 'Invalid email provided.',
      invalidField: 'This value is not in a valid format, please fix or revert.',
      invalidFirstName: 'A first name must have at least 2 characters',
      invalidIPv4: 'An IPv4 Address must be in the format of d.d.d.d',
      invalidIPv6: 'An IPv6 Address must be in the format of d.d.d.d',
      invalidLastName: 'A last name must have at least 2 characters',
      invalidMac: 'A MAC address must be in the format xx‑xx‑xx‑xx‑xx‑xx',
      invalidPassword: 'Please match the requested password format.',
      invalidPhone: 'Phone number must include the country code and area code.',
      invalidResponse: 'Invalid response received from the server.',
      invalidSubnet: 'A subnet mask must in the format of d.d.d.d.',
      noAccessPoint: 'No access point found.',
      noCredentials: 'No credentials provided.',
      noSubscriberDevice: 'Device not found',
      mismatchPassword: 'Password mismatch.',
      missingEndpoints: 'System is not set up correct - missing configuration information.',
      titleAccessPointCommand: 'Access Point Command Error',
      titleAccessPointRegistration: 'Access Point Registration Error',
      titleAccessScheduler: 'Access Schedule',
      titleChangePassword: 'Change Password Error',
      titleClientRetrieval: 'Client Retrieval Error',
      titleDelete: 'Delete Error',
      titleForgotPassword: 'Forgot Password Error',
      titleIpReservationModify: 'IP Reservation Modify Error',
      titleMfa: 'Multi-Factor Authentication Error',
      titleNetwork: 'Network Error',
      titleNetworkModify: 'Network Modify Error',
      titleProfile: 'Profile Error',
      titleResendCode: 'Resend Code Error',
      titleSignIn: 'Sign In Error',
      titleSignUp: 'Sign Up Error',
      titleSmsValidation: 'SMS Validation Error',
      titleSettingUpdate: 'Setting Update Error',
      unknown: 'Unknown error.',
      userNotFound: 'User not found.',
      validationError: 'Validation Error',
    },
    messages: {
      empty: '-',
      guestNetworkExists: 'Only one guest type network is allowed and one already exists.',
      passwordChanged: 'Password successfully changed.',
      resetEmailSent:
        "You should soon receive an email containing the instructions to reset your password. Please make sure to check your spam if you can't find the email.",
      titleMessage: 'Message',
    },
    navigator: {
      accessSchedule: 'Access Schedule',
      changePassword: 'Change Password',
      configuration: 'Configuration',
      dashboard: 'Dashboard',
      details: 'Details',
      deviceRegistration: 'Register Device',
      forgotPassword: 'Forgot Password',
      ipReservation: 'IP Reservation',
      network: 'Network',
      networkAdd: 'Add Network',
      multiFactorAuthentication: 'Multi-Factor Authentication',
      passwordReset: 'Password Reset',
      phoneVerification: 'Phone Number Verification',
      privacyPolicy: 'Privacy Policy',
      profile: 'Profile',
      signUp: 'Sign Up',
      termsConditions: 'Terms & Conditions',
      timeRangeEdit: 'Edit Time Range',
    },
    buttons: {
      add: 'Add',
      addNetwork: 'Add Network',
      blink: 'Blink',
      cancel: 'Cancel',
      changeBrand: 'Change Brand',
      changePassword: 'Change Password',
      deleteNetwork: 'Delete Network',
      fix: 'Fix',
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
      reserve: 'Reserve',
      resetPassword: 'Reset Password',
      revert: 'Revert',
      sendCode: 'Send Code',
      signIn: 'Sign In',
      signOut: 'Sign Out',
      signUp: 'Sign Up',
      submit: 'Submit',
      termsConditions: 'Terms & Conditions',
      update: 'Update',
      unpause: 'Unpause',
      unreserve: 'Unreserve',
      validate: 'Validate',
      verify: 'Verify',
    },
    common: {
      automatic: 'Automatic',
      bridge: 'Bridge',
      extender: 'Extender',
      manual: 'Manual',
      name: 'Name',
      nat: 'NAT',
      no: 'No',
      password: 'password',
      pppoe: 'PPPoE',
      router: 'Router',
      type: 'Type',
      yes: 'Yes',
    },
    placeholders: {
      addPhone: 'Add Phone',
      code: 'Code',
      confirmPassword: 'Confirm Password',
      currentPassword: 'Current Password',
      deviceName: 'Device Name',
      email: 'Email',
      ipAddress: 'IP Address',
      ipAddressV4V6: 'IP Address (IPv4 or IPv6)',
      macAddress: 'MAC Address',
      newPassword: 'New Password',
      nickname: 'Nickname',
      password: 'Password',
      phoneNumber: 'Phone Number',
    },
    accordionSection: {
      none: '- None -',
    },
    brandSelector: {
      title: 'Welcome',
      description: 'Please select your provider to continue.',
    },
    mfaCode: {
      descriptionDefault: 'A validation code was sent, please enter in this code below.',
      descriptionEmail: 'A validation code was sent by email, please enter in this code below.',
      descriptionSms: 'A validation code was sent by text message (SMS), please enter in this code below.',
      validationCodeResendDefault: 'A validation code was resent.',
      validationCodeResendEmail: 'A validation code was resent by email.',
      validationCodeResendSms: 'A validation code was resent by text message (SMS).',
    },
    configuration: {
      accessPointRoleSettings: '{role} Settings',
      commandFactoryResetSuccess: 'Command to reset to factory defaults successfully sent.',
      commandFirmwareUpdateSuccess: 'Command to upgrade firmware successfully sent.',
      commandLightBlinkSuccess: 'Command to blink lights successfully sent.',
      commandRebootSuccess: 'Command to reboot successfully sent',
      commandRefreshSuccess: 'Command to refresh successfully sent.',
      confirmTitle: 'Confirm',
      confirmDeleteIpReservation: 'Are you sure you want to delete this IP reservation?',
      confirmFactoryResetSuccess: 'Are you sure you want to reset to factory defaults?',
      confirmFirmwareUpdateSuccess: 'Are you sure you want to upgrade firmware?',
      confirmRebootSuccess: 'Are you sure you want to reboot?',
      defaultGateway: 'Default Gateway',
      defaultGatewayV6: 'Default Gateway (IPv6)',
      deviceMode: 'Device Mode',
      dnsSettings: 'DNS Settings',
      endIp: 'End IP',
      endIpV6: 'End IP (IPv6)',
      enableLeds: 'LEDs Enabled',
      firmware: 'Firmware',
      guestNetwork: '{0} (Guest Network)',
      internetSettings: 'Internet Settings',
      ipAddress: 'IP Address',
      ipAddressV6: 'IP Address (IPv6)',
      ipReservations: 'IP Reservations',
      ipV6Support: 'IPv6 Support',
      macAddress: 'MAC Address',
      mainNetwork: '{0} (Main)',
      networks: 'Networks',
      nickname: 'Nickname',
      primaryDns: 'Primary DNS',
      primaryDnsV6: 'Primary DNS (IPv6)',
      productModel: 'Product Model',
      secondaryDns: 'Secondary DNS',
      secondaryDnsV6: 'Secondary DNS (IPv6)',
      selectorCustom: 'Custom',
      selectorIsp: 'ISP',
      serialNumber: 'Serial number',
      startIp: 'Start IP',
      startIpV6: 'Start IP (IPv6)',
      status: 'Status',
      subnet: 'Subnet',
      subnetV6: 'Subnet (IPv6)',
      subnetMask: 'Subnet Mask',
      subnetMaskV6: 'Subnet Mask (IPv6)',
      username: 'Username',
    },
    dashboard: {
      network: 'Network',
      internet: 'Internet',
      connectedDevices: 'Connected Devices',
      guestNetwork: 'Guest Network',
    },
    deviceDetails: {
      connected: 'Connected',
      connectionDetails: 'Connection Details',
      connectionType: 'Connection Type',
      connectionTypeWifi: 'WiFi ({0})',
      connectionTypeWired: 'Wired ({0})',
      description: 'Description',
      deviceDetails: 'Device Details',
      ipAddressV4: 'IP Address (IPv4)',
      ipAddressV4Reserved: 'IP Address (IPv4 - Reserved)',
      ipAddressV6: 'IP Address (IPv6)',
      ipAddressV6Reserved: 'IP Address (IPv6 - Reserved)',
      group: 'Group',
      macAddress: 'MAC Address',
      manufacturer: 'Manufacturer',
      status: 'Status',
    },
    deviceRegistration: {
      description:
        'No access point is currently registed on this account. Please register an access point to continue.',
    },
    accessSchedule: {
      accessSchedule: 'Access Schedule',
      editRange: 'Edit Range',
      endTime: 'End Time',
      day: 'Day',
      description: 'Description',
      ranges: 'Ranges',
      startTime: 'Start Time',
      times: 'Times',
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      sunday: 'Sunday',
    },
    forgotPassword: {
      title: 'Reset Password',
      description: 'Please enter your email to reset your password.',
    },
    ipReservation: {
      title: 'IP Reservation',
    },
    network: {
      bands: 'Bands',
      confirmTitle: 'Confirm',
      confirmDeleteNetwork: 'Delete this network?',
      encryption: 'Encryption',
      nameSsid: 'Name (SSID)',
      selectorBandsAll: 'All',
      selectorBands2g: '2.4 Ghz',
      selectorBands5g: '5 Ghz',
      selectorBands5gl: '5 Ghz (Lower)',
      selectorBands5gu: '5 Ghz (Upper)',
      selectorBands6g: '6 Ghz',
      selectorEncryptionPsk: 'PSK',
      selectorEncryptionPsk2: 'PSK2',
      selectorEncryptionWpa: 'WPA',
      selectorEncryptionWpa2: 'WPA2',
      selectorEncryptionWpaMixed: 'WPA Mixed',
      selectorTypeMain: 'Main',
      selectorTypeGuest: 'Guest',
      settings: 'Settings',
      wifiClients: 'Wifi Clients',
      wiredClients: 'Wired Clients',
    },
    passwordChange: {
      title: 'Password Change',
      descriptionForced: 'You must change your password to continue.',
      description: 'Enter in your current password and a new password.',
    },
    phoneVerification: {
      description: 'A validation code was sent by text message (SMS), please enter in this code below.',
    },
    privacyPolicy: {
      title: 'Privacy Policy',
      content: 'This is the privacy policy.',
    },
    profile: {
      accountInfo: 'Account Information',
      app: 'App',
      email: 'Email',
      firstName: 'First Name',
      description: 'Description',
      lastName: 'Last Name',
      manageDeviceGroups: 'Manage Device Groups',
      mfa: 'MFA',
      off: 'Off',
      phone: 'Phone Number',
      role: 'Role',
      sms: 'SMS',
      version: 'Version',
      voice: 'Voice',
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
    termsConditions: {
      title: 'Terms & Conditions',
      content: 'These are the terms and conditions.',
    },
  },
});
