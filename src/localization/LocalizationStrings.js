import LocalizedStrings from 'react-native-localization';

export const strings = new LocalizedStrings({
  en: {
    errors: {
      apiAccessDenied: 'Access denied. Trying signing in again.',
      apiBadMfaTransaction: 'Multi-factor authentication was not accepted, please try again.',
      apiExpiredToken: 'Token has expired, please sign in again.',
      apiInternalError: 'Server had an internal error, please try again',
      apiInvalidCredentials: 'Invalid credentials, check username and/or password.',
      apiInvalidToken: 'Token is no longer valid, please sign in again.',
      apiMfaFailure: 'Multi-factor authentication failed, please try again.',
      apiSecurityServiceUnreachable: 'Security service is not reachable, please wait and try again.',
      apiPasswordAlreadyUsed: 'Password already in use, please select a different password.',
      apiPasswordChangeRequired: 'Password must be changed to continue.',
      apiPasswordInvalid: 'Password is invalid.',
      apiRateLimitExceeded: 'Server has received too many calls, please wait and try again.',
      apiUsernamePendingVerification: 'Email requires validation.',
      cannotChangePhoneMfa:
        'Cannot change your phone number while MFA (Multi-Factor Authentication) is configured to SMS. Please change MFA before updating your phone number.',
      emptyField: '{0} field must not be empty.',
      emptyFields: 'Please fill in all fields',
      failedToConnect: 'Failed to connect to server, check connections.',
      internal: 'Internal error.',
      invalidAccessTime: 'Start time must be before end time.',
      invalidCode: 'Invalid validation code.',
      invalidEmail: 'Invalid email provided.',
      invalidField: 'This value is not in a valid format, please fix or revert.',
      invalidFirstName: 'A first name must have at least 2 characters.',
      invalidIPv4: 'An IPv4 Address must be in the format of d.d.d.d.',
      invalidIPv6: 'This is not a valid IPv6 format.',
      invalidLastName: 'A last name must have at least 2 characters.',
      invalidMac: 'A MAC address must be in the format aabbccddeeff or aa:bb:cc:dd:ee:ff.',
      invalidPassword: 'Please match the requested password format.',
      invalidPhone: 'Phone number must include the country code and area code.',
      invalidResponse: 'Invalid response received from the server.',
      invalidSubnet: 'A subnet mask must in the format of d.d.d.d/xx.',
      noAccessPoint: 'No access point found.',
      noCredentials: 'No credentials provided.',
      noSubscriberDevice: 'Device not found',
      mismatchPassword: 'Password mismatch.',
      missingEndpoints: 'System is not set up correct - missing configuration information.',
      reuseCurrentPassword: 'Cannot reuse you current password.',
      titleAccessPointCommand: 'Access Point Command Error',
      titleAccessPointRegistration: 'Access Point Registration Error',
      titleAccessScheduler: 'Access Schedule Error',
      titleBrandSelection: 'Brand Selection Error',
      titleChangePassword: 'Change Password Error',
      titleClientRetrieval: 'Client Retrieval Error',
      titleDelete: 'Delete Error',
      titleDeviceStatistics: 'Device Statistics',
      titleForgotPassword: 'Forgot Password Error',
      titleIpReservationModify: 'IP Reservation Modify Error',
      titleMfa: 'Multi-Factor Authentication Error',
      titleNetwork: 'Network Error',
      titleNetworkModify: 'Network Modify Error',
      titleProfile: 'Profile Error',
      titleRemoveUser: 'Remove User Error',
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
      titleCancelled: 'Cancelled',
      titleSuccess: 'Success',
    },
    navigator: {
      accessSchedule: 'Access Schedule',
      accessTime: 'Access Time',
      changePassword: 'Change Password',
      configuration: 'Configuration',
      dashboard: 'Dashboard',
      details: 'Details',
      deviceRegistration: 'Register Device',
      deviceStatistics: 'Device Statistics',
      forgotPassword: 'Forgot Password',
      ipReservation: 'IP Reservation',
      network: 'Network',
      networkAdd: 'Add Network',
      multiFactorAuthentication: 'Multi-Factor Authentication',
      passwordPolicy: 'Password Policy',
      passwordReset: 'Password Reset',
      phoneVerification: 'Phone Number Verification',
      profile: 'Profile',
      signUp: 'Sign Up',
      termsConditions: 'Terms & Conditions',
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
      reboot: 'Reboot',
      refresh: 'Refresh',
      register: 'Register',
      removeMyAccount: 'Remove My Account',
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
      commandFactoryResetSuccess: 'Command to reset device to factory defaults successfully sent.',
      commandFirmwareUpdateSuccess:
        "Command to upgrade device firmware to '{0}' succcessfully sent, this may take several minutes to complete.",
      commandLightBlinkSuccess: 'Command to blink lights successfully sent.',
      commandRebootSuccess: 'Command to reboot device successfully sent',
      commandRefreshSuccess: 'Command to refresh device configuration successfully sent.',
      confirmTitle: 'Confirm',
      confirmDeleteIpReservation: 'Are you sure you want to delete this IP reservation?',
      confirmFactoryResetSuccess: 'Are you sure you want to reset this device to factory defaults?',
      confirmFirmwareUpdateSuccess: "Are you sure you want to upgrade device firmware to '{0}'?",
      confirmRebootSuccess: 'Are you sure you want to reboot?',
      defaultGateway: 'Default Gateway',
      defaultGatewayV6: 'Default Gateway (IPv6)',
      deviceMode: 'Device Mode',
      deviceStatistics: 'Device Statistics',
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
      ipv4: 'IPv4',
      ipv6: 'IPv6',
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
      confirmDeleteAccessPoint: 'Are you sure you want to delete access point?',
      confirmTitle: 'Confirm',
      connectedDevices: 'Connected Devices',
      guestNetwork: 'Guest Network',
    },
    deviceDetails: {
      connected: 'Connected',
      connectionDetails: 'Connection Details',
      connectionType: 'Connection Type',
      connectionTypeWifi: 'WiFi',
      connectionTypeWired: 'Wired',
      description: 'Description',
      deviceDetails: 'Device Details',
      ipAddressV4: 'IP Address (IPv4)',
      ipAddressV4Reserved: 'IP Address (IPv4 - Reserved)',
      ipAddressV6: 'IP Address (IPv6)',
      ipAddressV6Reserved: 'IP Address (IPv6 - Reserved)',
      group: 'Group',
      macAddress: 'MAC Address',
      manufacturer: 'Manufacturer',
      mode: 'Mode',
      network: 'Network',
      signalStrength: 'Signal Strength',
      speed: 'Speed',
      status: 'Status',
    },
    deviceRegistration: {
      description:
        'No access point is currently registed on this account. Please register an access point to continue.',
      descriptionAdd: 'Please enter the mac address of your access point.',
    },
    deviceStatistics: {
      titleExternalDataReceive: 'Access Point Data Received (External)',
      titleExternalDataTransmit: 'Access Point Data Transmitted (External)',
    },
    accessSchedule: {
      accessSchedule: 'Access Schedule',
      accessTimes: 'Access Times',
      editRange: 'Edit Range',
      endTime: 'End Time',
      day: 'Day',
      description: 'Description',
      ranges: 'Ranges',
      startTime: 'Start Time',
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
      selectorEncryptionWpa1Personal: 'WPA1 Personal',
      selectorEncryptionWpa2Personal: 'WPA2 Personal',
      selectorEncryptionWpa3Personal: 'WPA3 Personal',
      selectorEncryptionWpa12Personal: 'WPA1/2 Personal',
      selectorEncryptionWpa23Personal: 'WPA2/3 Personal',
      selectorTypeMain: 'Main',
      selectorTypeGuest: 'Guest',
      settings: 'Settings',
      type: 'Type',
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
    profile: {
      accountInfo: 'Account Information',
      app: 'App',
      confirmRemoveMyAccount: 'This will remove all your user information and sign you out - proceed?',
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
      statusEmailVerificationNeed: 'Email address verification needed, check your email for a verification email.',
      statusEmailVerified: 'Email address verified, now looking for the device ...',
      statusSignUpComplete: 'Sign up completed, please sign-in to continue.',
      statusCancelled: 'Sign up cancelled.',
    },
    termsConditions: {
      title: 'Terms & Conditions',
      content: 'These are the terms and conditions.',
    },
  },
});
