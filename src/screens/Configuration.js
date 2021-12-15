import React, { useState, useEffect, useCallback, useRef } from 'react';
import { strings } from '../localization/LocalizationStrings';
import {
  marginTopDefault,
  paddingHorizontalDefault,
  borderRadiusDefault,
  pageStyle,
  whiteColor,
  errorColor,
  okColor,
  pageItemStyle,
} from '../AppStyle';
import { StyleSheet, SafeAreaView, ScrollView, View, Text, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import {
  selectCurrentAccessPointId,
  selectSubscriberInformationLoading,
  selectAccessPoint,
  selectInternetConnection,
  selectWifiNetworks,
  selectDeviceMode,
  selectDnsConfiguration,
  selectIpReservations,
} from '../store/SubscriberInformationSlice';
import { deviceCommandsApi, handleApiError } from '../api/apiHandler';
import {
  scrollViewToTop,
  displayValue,
  displayValueAccessPointType,
  displayValueAccessPointDeviceRole,
  displayValueInternetConnectionType,
  displayValueDeviceModeType,
  displayEditableValue,
  getAccessPointIcon,
  showGeneralMessage,
  modifyAccessPoint,
  modifySubscriberInternetConnection,
  modifySubscriberDeviceMode,
  modifySubscriberDnsInformation,
  setSubscriberInformationInterval,
  deleteSubscriberIpReservation,
} from '../Utils';
import AccordionSection from '../components/AccordionSection';
import ButtonStyled from '../components/ButtonStyled';
import ImageWithBadge from '../components/ImageWithBadge';
import ItemColumnsWithValues from '../components/ItemColumnsWithValues';
import ItemTextWithIcon from '../components/ItemTextWithIcon';
import ItemTextWithLabel from '../components/ItemTextWithLabel';
import ItemTextWithLabelEditable from '../components/ItemTextWithLabelEditable';
import ItemPickerWithLabel from '../components/ItemPickerWithLabel';

const Configuration = props => {
  // The sectionZIndex is used to help with any embedded picker/dropdown. Start with a high enough
  // value that it'll cover each section. The sections further up the view should have higher numbers
  var sectionZIndex = 20;
  var pickerZIndex = 20;
  const scrollRef = useRef();
  // Selectors
  const currentAccessPointId = useSelector(selectCurrentAccessPointId);
  const subscriberInformationLoading = useSelector(selectSubscriberInformationLoading);
  const accessPoint = useSelector(selectAccessPoint);
  const internetConnection = useSelector(selectInternetConnection);
  const wifiNetworks = useSelector(selectWifiNetworks);
  const deviceMode = useSelector(selectDeviceMode);
  const dnsConfiguration = useSelector(selectDnsConfiguration);
  const ipReservations = useSelector(selectIpReservations);
  // State
  const [internetConnectionType, setInternetConnectionType] = useState(
    internetConnection ? internetConnection.type : null,
  );
  const [ipv6Support, setIpv6Support] = useState(internetConnection ? internetConnection.ipV6Support : null);
  const [deviceModeType, setDeviceModeType] = useState(deviceMode ? deviceMode.type : null);
  const [enableLeds, setEnableLeds] = useState(deviceMode ? deviceMode.enableLEDS : false);
  const [customDnsValue, setCustomDnsValue] = useState(dnsConfiguration ? dnsConfiguration.custom : false);

  // Refresh the information only anytime there is a navigation change and this has come into focus
  // Need to be careful here as useFocusEffect is also called during re-render so it can result in
  // infinite loops.
  useFocusEffect(
    useCallback(() => {
      scrollViewToTop(scrollRef);
      var intervalId = setSubscriberInformationInterval(null);

      // Return function of what should be done on 'focus out'
      return () => {
        clearInterval(intervalId);
      };
      // Disable the eslint warning, as we want to change only on navigation changes
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.navigation]),
  );

  useEffect(() => {
    setInternetConnectionType(internetConnection.type);
  }, [internetConnection.type]);

  useEffect(() => {
    setDeviceModeType(deviceMode.type);
  }, [deviceMode.type]);

  useEffect(() => {
    setCustomDnsValue(dnsConfiguration.custom);
  }, [dnsConfiguration.custom]);

  const getAccessPointBadgeIconColor = () => {
    if (internetConnection && internetConnection.ipAddress) {
      return okColor;
    } else {
      return errorColor;
    }
  };

  const getAccessPointBadgeIcon = () => {
    if (internetConnection && internetConnection.ipAddress) {
      return require('../assets/check-solid.png');
    } else {
      return require('../assets/times-solid.png');
    }
  };

  const onRefreshPress = async () => {
    sendAccessPointCommand('refresh', strings.configuration.commandRefreshSuccess);
  };

  const getWifiNetworkLabel = item => {
    if (!item) {
      return strings.messages.empty;
    }

    switch (item.type) {
      case 'main':
        return strings.formatString(strings.configuration.mainNetwork, item.name);

      case 'guest':
        return strings.formatString(strings.configuration.guestNetwork, item.name);

      default:
        return item.name;
    }
  };

  const getWifiNetworkIcon = () => {
    return require('../assets/wifi-solid.png');
  };

  const getWifiNetworkIconTint = item => {
    if (item && item.bands && item.bands.length) {
      return okColor;
    }

    return errorColor;
  };

  const onWifiNetworkPress = async index => {
    // Send the network name parameter to the Network
    props.navigation.navigate('Network', { screen: 'NetworkScreen', params: { wifiNetworkIndex: index } });
  };

  const onUpdateFirmwarePress = async () => {
    sendAccessPointCommandWithConfirm(
      'upgrade',
      strings.configuration.commandFirmwareUpdateSuccess,
      strings.configuration.confirmFirmwareUpdateSuccess,
    );
  };

  const onBlinkLightsPress = async () => {
    sendAccessPointCommand('blink', strings.configuration.commandLightBlinkSuccess);
  };

  const onFactoryResetPress = async () => {
    sendAccessPointCommandWithConfirm(
      'factory',
      strings.configuration.commandFactoryResetSuccess,
      strings.configuration.confirmFactoryResetSuccess,
    );
  };

  const onRebootPress = async () => {
    sendAccessPointCommandWithConfirm(
      'reboot',
      strings.configuration.commandRebootSuccess,
      strings.configuration.confirmRebootSuccess,
    );
  };

  const sendAccessPointCommandWithConfirm = async (action, successMessage, confirmMessage) => {
    if (confirmMessage) {
      Alert.alert(strings.configuration.confirmTitle, confirmMessage, [
        {
          text: strings.buttons.ok,
          onPress: async () => {
            sendAccessPointCommand(action, successMessage);
          },
        },
        {
          text: strings.buttons.cancel,
        },
      ]);
    } else {
      sendAccessPointCommand(action, successMessage);
    }
  };

  const sendAccessPointCommand = async (action, successMessage) => {
    try {
      let payload = {
        mac: accessPoint.macAddress,
        when: 0,
      };

      // for the blink command there are some additional parameters, so add those in.
      if (action === 'blink') {
        payload.duration = 10;
        payload.pattern = 'blink';
      }

      // TODO: Verify this is functioning and the function call is correct!
      const response = await deviceCommandsApi.performAnAction(action, payload);

      if (!response || !response.data) {
        throw new Error(strings.errors.invalidResponse);
      }

      if (response.data.Code === 0) {
        showGeneralMessage(successMessage);
      } else {
        throw new Error(strings.errors.invalidResponse);
      }
    } catch (error) {
      // Handle the error.
      handleApiError(strings.errors.titleAccessPointCommand, error);
    }
  };

  const onAddNetwork = () => {
    props.navigation.navigate('Network', { screen: 'NetworkAdd', initial: false });
  };

  const onEditAccessPointSettings = async val => {
    try {
      await modifyAccessPoint(currentAccessPointId, val);
    } catch (error) {
      handleApiError(strings.errors.titleUpdate, error);
      // Need to throw the error to ensure the caller cleans up
      throw error;
    }
  };

  const onEditInternetConnectionSettings = async val => {
    try {
      await modifySubscriberInternetConnection(currentAccessPointId, val);
    } catch (error) {
      handleApiError(strings.errors.titleUpdate, error);
      // Need to throw the error to ensure the caller cleans up
      throw error;
    }
  };

  const onEditDeviceModeSettings = async val => {
    try {
      await modifySubscriberDeviceMode(currentAccessPointId, val);
    } catch (error) {
      handleApiError(strings.errors.titleUpdate, error);
      // Need to throw the error to ensure the caller cleans up
      throw error;
    }
  };

  const onEditCustomDnsSettings = async val => {
    try {
      await modifySubscriberDnsInformation(currentAccessPointId, val);
    } catch (error) {
      handleApiError(strings.errors.titleUpdate, error);
      // Need to throw the error to ensure the caller cleans up
      throw error;
    }
  };

  const onAddIpReservation = () => {
    props.navigation.navigate('IpReservationAddEdit');
  };

  const onEditIpReservation = index => {
    props.navigation.push('IpReservationAddEdit', { reservationIndex: index });
  };

  const onDeleteIpReservation = async index => {
    Alert.alert(strings.configuration.confirmTitle, strings.configuration.confirmDeleteIpReservation, [
      {
        text: strings.buttons.ok,
        onPress: async () => {
          try {
            await deleteSubscriberIpReservation(currentAccessPointId, index);
          } catch (error) {
            handleApiError(strings.errors.titleDelete, error);
            // Need to throw the error to ensure the caller cleans up
            throw error;
          }
        },
      },
      {
        text: strings.buttons.cancel,
      },
    ]);
  };

  const renderInternetConnectionSettings = () => {
    // It is very important to not use the state when doing the rendering as it'll result in race conditions.
    let type = internetConnection ? internetConnection.type : null;
    let items = [
      <ItemPickerWithLabel
        key="type"
        label={strings.configuration.type}
        value={internetConnectionType}
        setValue={setInternetConnectionType}
        items={[
          { label: displayValueInternetConnectionType({ type: 'automatic' }, 'type'), value: 'automatic' },
          { label: displayValueInternetConnectionType({ type: 'manual' }, 'type'), value: 'manual' },
          { label: displayValueInternetConnectionType({ type: 'pppoe' }, 'type'), value: 'pppoe' },
        ]}
        changeKey="type"
        onChangeValue={onEditInternetConnectionSettings}
        zIndex={pickerZIndex--}
      />,
      <ItemPickerWithLabel
        key="ipV6Support"
        label={strings.configuration.ipV6Support}
        value={ipv6Support}
        setValue={setIpv6Support}
        items={[
          { label: strings.common.no, value: false },
          { label: strings.common.yes, value: true },
        ]}
        changeKey="ipV6Support"
        onChangeValue={onEditInternetConnectionSettings}
        zIndex={pickerZIndex--}
      />,
    ];

    // IPv4
    if (type === 'automatic') {
      items.push(
        <ItemTextWithLabel
          key="ipAddress"
          label={strings.configuration.ipAddress}
          value={displayValue(internetConnection, 'ipAddress')}
        />,
      );
      items.push(
        <ItemTextWithLabel
          key="subNetMask"
          label={strings.configuration.subnetMask}
          value={displayValue(internetConnection, 'subNetMask')}
        />,
      );
      items.push(
        <ItemTextWithLabel
          key="defaultGateway"
          label={strings.configuration.defaultGateway}
          value={displayValue(internetConnection, 'defaultGateway')}
        />,
      );
      items.push(
        <ItemTextWithLabel
          key="primaryDns"
          label={strings.configuration.primaryDns}
          value={displayValue(internetConnection, 'primaryDns')}
        />,
      );
      items.push(
        <ItemTextWithLabel
          key="secondaryDns"
          label={strings.configuration.secondaryDns}
          value={displayValue(internetConnection, 'secondaryDns')}
        />,
      );

      if (ipv6Support) {
        items.push(
          <ItemTextWithLabel
            key="ipAddressV6"
            label={strings.configuration.ipAddressV6}
            value={displayValue(internetConnection, 'ipAddressV6')}
          />,
        );
        items.push(
          <ItemTextWithLabel
            key="subnetMaskV6"
            label={strings.configuration.subnetMaskV6}
            value={displayValue(internetConnection, 'subnetMaskV6')}
          />,
        );
        items.push(
          <ItemTextWithLabel
            key="defaultGatewayV6"
            label={strings.configuration.defaultGatewayV6}
            value={displayValue(internetConnection, 'defaultGatewayV6')}
          />,
        );
        items.push(
          <ItemTextWithLabel
            key="primaryDnsV6"
            label={strings.configuration.primaryDnsV6}
            value={displayValue(internetConnection, 'primaryDnsV6')}
          />,
        );
        items.push(
          <ItemTextWithLabel
            key="secondaryDnsV6"
            label={strings.configuration.secondaryDnsV6}
            value={displayValue(internetConnection, 'secondaryDnsV6')}
          />,
        );
      }
    } else if (type === 'manual') {
      items.push(
        <ItemTextWithLabelEditable
          key="ipAddress"
          label={strings.configuration.ipAddress}
          value={displayEditableValue(internetConnection, 'ipAddress')}
          type="ipV4"
          editKey="ipAddress"
          onEdit={onEditInternetConnectionSettings}
        />,
      );
      items.push(
        <ItemTextWithLabelEditable
          key="subNetMask"
          label={strings.configuration.subnetMask}
          value={displayEditableValue(internetConnection, 'subNetMask')}
          type="subnetMaskV4"
          editKey="subNetMask"
          onEdit={onEditInternetConnectionSettings}
        />,
      );
      items.push(
        <ItemTextWithLabelEditable
          key="defaultGateway"
          label={strings.configuration.defaultGateway}
          value={displayEditableValue(internetConnection, 'defaultGateway')}
          type="ipV4"
          editKey="defaultGateway"
          onEdit={onEditInternetConnectionSettings}
        />,
      );
      items.push(
        <ItemTextWithLabelEditable
          key="primaryDns"
          label={strings.configuration.primaryDns}
          value={displayEditableValue(internetConnection, 'primaryDns')}
          type="ipV4"
          editKey="primaryDns"
          onEdit={onEditInternetConnectionSettings}
        />,
      );
      items.push(
        <ItemTextWithLabelEditable
          key="secondaryDns"
          label={strings.configuration.secondaryDns}
          value={displayEditableValue(internetConnection, 'secondaryDns')}
          type="ipV4"
          editKey="secondaryDns"
          onEdit={onEditInternetConnectionSettings}
        />,
      );

      // IPv6
      if (ipv6Support) {
        items.push(
          <ItemTextWithLabelEditable
            key="ipAddressV6"
            label={strings.configuration.ipAddressV6}
            value={displayEditableValue(internetConnection, 'ipAddressV6')}
            type="ipV6"
            editKey="ipAddressV6"
            onEdit={onEditInternetConnectionSettings}
          />,
        );
        items.push(
          <ItemTextWithLabelEditable
            key="subnetMaskV6"
            label={strings.configuration.subnetMaskV6}
            value={displayEditableValue(internetConnection, 'subnetMaskV6')}
            type="subnetMaskV6"
            editKey="subnetMaskV6"
            onEdit={onEditInternetConnectionSettings}
          />,
        );
        items.push(
          <ItemTextWithLabelEditable
            key="defaultGatewayV6"
            label={strings.configuration.defaultGatewayV6}
            value={displayEditableValue(internetConnection, 'defaultGatewayV6')}
            type="ipV6"
            editKey="defaultGatewayV6"
            onEdit={onEditInternetConnectionSettings}
          />,
        );
        items.push(
          <ItemTextWithLabelEditable
            key="primaryDnsV6"
            label={strings.configuration.primaryDnsV6}
            value={displayEditableValue(internetConnection, 'primaryDnsV6')}
            type="ipV6"
            editKey="primaryDnsV6"
            onEdit={onEditInternetConnectionSettings}
          />,
        );
        items.push(
          <ItemTextWithLabelEditable
            key="secondaryDnsV6"
            label={strings.configuration.secondaryDnsV6}
            type="ipV6"
            value={displayEditableValue(internetConnection, 'secondaryDnsV6')}
            editKey="secondaryDnsV6"
            onEdit={onEditInternetConnectionSettings}
          />,
        );
      }
    } else if (type === 'pppoe') {
      items.push(
        <ItemTextWithLabelEditable
          key="username"
          label={strings.configuration.username}
          value={displayEditableValue(internetConnection, 'username')}
          editKey="username"
          onEdit={onEditInternetConnectionSettings}
        />,
      );
      items.push(
        <ItemTextWithLabelEditable
          key="password"
          label={strings.configuration.password}
          value={displayEditableValue(internetConnection, 'password')}
          type="password"
          editKey="password"
          onEdit={onEditInternetConnectionSettings}
        />,
      );
    }

    return items;
  };

  const renderDeviceMode = () => {
    // It is very important to not use the state when doing the rendering as it'll result in race conditions.
    let type = deviceMode ? deviceMode.type : null;
    let items = [
      <ItemPickerWithLabel
        key="type"
        label={strings.configuration.type}
        value={deviceModeType}
        setValue={setDeviceModeType}
        items={[
          { label: displayValueDeviceModeType({ type: 'bridge' }, 'type'), value: 'bridge' },
          { label: displayValueDeviceModeType({ type: 'manual' }, 'type'), value: 'manual' },
          { label: displayValueDeviceModeType({ type: 'nat' }, 'type'), value: 'nat' },
        ]}
        changeKey="type"
        onChangeValue={onEditDeviceModeSettings}
        zIndex={pickerZIndex--}
      />,
    ];

    // IPv4
    if (type === 'bridge') {
      // Nothing is added
    } else if (type === 'manual') {
      items.push(
        <ItemTextWithLabelEditable
          key="subnet"
          label={strings.configuration.subnet}
          value={displayEditableValue(deviceMode, 'subnet')}
          type="subnetV4"
          editKey="subnet"
          onEdit={onEditDeviceModeSettings}
        />,
      );
      items.push(
        <ItemTextWithLabelEditable
          key="subnetMask"
          label={strings.configuration.subnetMask}
          value={displayEditableValue(deviceMode, 'subnetMask')}
          type="subnetMaskV4"
          editKey="subnetMask"
          onEdit={onEditDeviceModeSettings}
        />,
      );
      items.push(
        <ItemTextWithLabelEditable
          key="startIP"
          label={strings.configuration.startIp}
          value={displayEditableValue(deviceMode, 'startIP')}
          type="ipV4"
          editKey="startIP"
          onEdit={onEditDeviceModeSettings}
        />,
      );
      items.push(
        <ItemTextWithLabelEditable
          key="endIP"
          label={strings.configuration.endIp}
          value={displayEditableValue(deviceMode, 'endIP')}
          type="ipV4"
          editKey="endIP"
          onEdit={onEditDeviceModeSettings}
        />,
      );

      if (ipv6Support) {
        items.push(
          <ItemTextWithLabelEditable
            key="subnetV6"
            label={strings.configuration.subnetV6}
            value={displayEditableValue(deviceMode, 'subnetV6')}
            type="subnetV6"
            editKey="subnetV6"
            onEdit={onEditDeviceModeSettings}
          />,
        );
        items.push(
          <ItemTextWithLabelEditable
            key="subnetMaskV6"
            label={strings.configuration.subnetMaskV6}
            value={displayEditableValue(deviceMode, 'subnetMaskV6')}
            type="subnetMaskV6"
            editKey="subnetMaskV6"
            onEdit={onEditDeviceModeSettings}
          />,
        );
        items.push(
          <ItemTextWithLabelEditable
            key="startIPV6"
            label={strings.configuration.startIpV6}
            value={displayEditableValue(deviceMode, 'startIPV6')}
            type="ipV6"
            editKey="startIPV6"
            onEdit={onEditDeviceModeSettings}
          />,
        );
        items.push(
          <ItemTextWithLabelEditable
            key="endIPV6"
            label={strings.configuration.endIpV6}
            value={displayEditableValue(deviceMode, 'endIPV6')}
            type="ipV6"
            editKey="endIPV6"
            onEdit={onEditDeviceModeSettings}
          />,
        );
      }
    } else if (type === 'nat' || !type) {
      items.push(
        <ItemTextWithLabel
          key="subnet"
          label={strings.configuration.subnet}
          value={displayValue(deviceMode, 'subnet')}
        />,
      );
      items.push(
        <ItemTextWithLabel
          key="subnetMask"
          label={strings.configuration.subnetMask}
          value={displayValue(deviceMode, 'subnetMask')}
        />,
      );
      items.push(
        <ItemTextWithLabel
          key="startIP"
          label={strings.configuration.startIp}
          value={displayValue(deviceMode, 'startIP')}
        />,
      );
      items.push(
        <ItemTextWithLabel key="endIP" label={strings.configuration.endIp} value={displayValue(deviceMode, 'endIP')} />,
      );

      if (ipv6Support) {
        items.push(
          <ItemTextWithLabel
            key="subnetV6"
            label={strings.configuration.subnetV6}
            value={displayValue(deviceMode, 'subnetV6')}
          />,
        );
        items.push(
          <ItemTextWithLabel
            key="subnetMaskV6"
            label={strings.configuration.subnetMaskV6}
            value={displayValue(deviceMode, 'subnetMaskV6')}
          />,
        );
        items.push(
          <ItemTextWithLabel
            key="startIPV6"
            label={strings.configuration.startIpV6}
            value={displayValue(deviceMode, 'startIPV6')}
          />,
        );
        items.push(
          <ItemTextWithLabel
            key="endIPV6"
            label={strings.configuration.endIpV6}
            value={displayValue(deviceMode, 'endIPV6')}
          />,
        );
      }
    }

    items.push(
      <ItemPickerWithLabel
        key="enableLEDS"
        label={strings.configuration.enableLeds}
        value={enableLeds}
        setValue={setEnableLeds}
        items={[
          { label: strings.common.yes, value: true },
          { label: strings.common.no, value: false },
        ]}
        changeKey="enableLEDS"
        onChangeValue={onEditDeviceModeSettings}
        buttonTitle={strings.buttons.blink}
        onButtonPress={onBlinkLightsPress}
        buttonDisabled={!accessPoint}
        zIndex={pickerZIndex--}
      />,
    );

    return items;
  };

  const renderDnsSettings = () => {
    // It is very important to not use the state when doing the rendering as it'll result in race conditions.
    let custom = dnsConfiguration ? dnsConfiguration.custom : false;
    let items = [
      <ItemPickerWithLabel
        key="custom"
        label={strings.configuration.type}
        value={customDnsValue}
        setValue={setCustomDnsValue}
        items={[
          { label: strings.configuration.selectorIsp, value: false },
          { label: strings.configuration.selectorCustom, value: true },
        ]}
        changeKey="custom"
        onChangeValue={onEditCustomDnsSettings}
        zIndex={pickerZIndex--}
      />,
    ];

    if (custom) {
      items.push(
        <ItemTextWithLabelEditable
          key="primary"
          label={strings.configuration.primaryDns}
          value={displayEditableValue(dnsConfiguration, 'primary')}
          placeholder={strings.messages.empty}
          type="ipV4"
          editKey="primary"
          onEdit={onEditCustomDnsSettings}
        />,
      );
      items.push(
        <ItemTextWithLabelEditable
          key="secondary"
          label={strings.configuration.secondaryDns}
          value={displayEditableValue(dnsConfiguration, 'secondary')}
          placeholder={strings.messages.empty}
          type="ipV4"
          editKey="secondary"
          onEdit={onEditCustomDnsSettings}
        />,
      );
    }

    return items;
  };

  // Styles
  const componentStyles = StyleSheet.create({
    sectionNetwork: {
      marginTop: marginTopDefault,
      height: 96,
      paddingHorizontal: paddingHorizontalDefault,
      borderRadius: borderRadiusDefault,

      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: whiteColor,
    },
    sectionNetworkIcon: {
      height: 75,
      width: 75,
      resizeMode: 'contain',
    },
    sectionNetworkText: {
      flex: 2,
      fontSize: 18,
      marginHorizontal: paddingHorizontalDefault,
    },
    sectionAccordion: {
      marginTop: marginTopDefault,
    },
    buttonLeft: {
      marginRight: paddingHorizontalDefault / 2,
      flex: 1,
    },
    buttonRight: {
      marginLeft: paddingHorizontalDefault / 2,
      flex: 1,
    },
  });

  return (
    <SafeAreaView style={pageStyle.safeAreaView}>
      <ScrollView ref={scrollRef} contentContainerStyle={pageStyle.scrollView}>
        <View style={pageStyle.containerPostLogin}>
          <View style={componentStyles.sectionNetwork}>
            <ImageWithBadge
              style={componentStyles.sectionNetworkIcon}
              source={getAccessPointIcon(accessPoint)}
              badgeSource={getAccessPointBadgeIcon()}
              badgeTintColor={whiteColor}
              badgeBackgroundColor={getAccessPointBadgeIconColor()}
              badgeSize="large"
            />
            <Text style={componentStyles.sectionNetworkText}>{displayValue(accessPoint, 'name')}</Text>
            <ButtonStyled
              title={strings.buttons.refresh}
              type="outline"
              onPress={onRefreshPress}
              size="small"
              disabled={!accessPoint}
            />
          </View>

          <AccordionSection
            style={StyleSheet.flatten([componentStyles.sectionAccordion, { zIndex: sectionZIndex-- }])}
            title={strings.configuration.networks}
            disableAccordion={true}
            isLoading={subscriberInformationLoading}
            showAdd={true}
            onAddPress={onAddNetwork}>
            {wifiNetworks &&
              wifiNetworks.wifiNetworks &&
              wifiNetworks.wifiNetworks.map((item, index) => {
                return (
                  <ItemTextWithIcon
                    label={getWifiNetworkLabel(item)}
                    key={item.name}
                    icon={getWifiNetworkIcon(item)}
                    iconTintColor={getWifiNetworkIconTint(item)}
                    onPress={() => onWifiNetworkPress(index)}
                  />
                );
              })}
          </AccordionSection>

          <AccordionSection
            style={StyleSheet.flatten([componentStyles.sectionAccordion, { zIndex: sectionZIndex-- }])}
            title={strings.formatString(strings.configuration.accessPointRoleSettings, {
              role: displayValueAccessPointDeviceRole(accessPoint, 'deviceType'),
            })}
            disableAccordion={true}
            isLoading={false}>
            <ItemTextWithLabelEditable
              key="name"
              label={strings.configuration.name}
              value={displayEditableValue(accessPoint, 'name')}
              editKey="name"
              onEdit={onEditAccessPointSettings}
            />
            <ItemTextWithLabel
              key="deviceType"
              label={strings.configuration.type}
              value={displayValueAccessPointType(accessPoint, 'deviceType')}
            />
            <ItemTextWithLabel
              key="firmware"
              label={strings.configuration.firmware}
              value={displayValue(accessPoint, 'firmware')}
              buttonTitle={strings.buttons.update}
              onButtonPress={onUpdateFirmwarePress}
              buttonDisabled={!accessPoint}
            />
            <ItemTextWithLabel
              key="model"
              label={strings.configuration.productModel}
              value={displayValue(accessPoint, 'model')}
            />
            <ItemTextWithLabel
              key="serial_number"
              label={strings.configuration.serialNumber}
              value={displayValue(accessPoint, 'serial_number')}
            />
            <ItemTextWithLabel
              key="macAddress"
              label={strings.configuration.macAddress}
              value={displayValue(accessPoint, 'macAddress')}
            />
          </AccordionSection>

          <AccordionSection
            style={StyleSheet.flatten([componentStyles.sectionAccordion, { zIndex: sectionZIndex-- }])}
            title={strings.configuration.internetSettings}
            disableAccordion={true}
            isLoading={subscriberInformationLoading}>
            {renderInternetConnectionSettings()}
          </AccordionSection>

          <AccordionSection
            style={StyleSheet.flatten([componentStyles.sectionAccordion, { zIndex: sectionZIndex-- }])}
            title={strings.configuration.deviceMode}
            disableAccordion={true}
            isLoading={subscriberInformationLoading}>
            {renderDeviceMode()}
          </AccordionSection>

          <AccordionSection
            style={StyleSheet.flatten([componentStyles.sectionAccordion, { zIndex: sectionZIndex-- }])}
            title={strings.configuration.dnsSettings}
            disableAccordion={true}
            isLoading={subscriberInformationLoading}>
            {renderDnsSettings()}
          </AccordionSection>

          <AccordionSection
            style={StyleSheet.flatten([componentStyles.sectionAccordion, { zIndex: sectionZIndex-- }])}
            title={strings.configuration.ipReservations}
            disableAccordion={true}
            isLoading={subscriberInformationLoading}
            showAdd={true}
            onAddPress={() => onAddIpReservation()}>
            {ipReservations.reservations.length &&
              ipReservations.reservations.map((item, index) => {
                let result = [
                  <ItemColumnsWithValues
                    key={'reservation_' + index}
                    max="3"
                    type="value"
                    values={[item.ipAddress, item.macAddress, item.nickname]}
                    showDelete={true}
                    onDeletePress={() => onDeleteIpReservation(index)}
                    showEdit={true}
                    onEditPress={() => onEditIpReservation(index)}
                  />,
                ];

                if (index === 0) {
                  // Add in a header to the start of the array if this is the first index
                  result.unshift(
                    <ItemColumnsWithValues
                      key="label"
                      max="3"
                      type="label"
                      values={[
                        strings.configuration.ipAddress,
                        strings.configuration.macAddress,
                        strings.configuration.nickname,
                      ]}
                      showDelete={true}
                      showEdit={true}
                    />,
                  );
                }

                return result;
              })}
          </AccordionSection>

          <View style={pageItemStyle.containerButtons}>
            <ButtonStyled
              style={componentStyles.buttonLeft}
              title={strings.buttons.reboot}
              type="outline"
              onPress={onRebootPress}
            />
            <ButtonStyled
              style={componentStyles.buttonRight}
              title={strings.buttons.factoryReset}
              type="outline"
              onPress={onFactoryResetPress}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Configuration;
