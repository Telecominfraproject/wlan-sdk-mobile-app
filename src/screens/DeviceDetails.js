import React, { useCallback, useState } from 'react';
import { strings } from '../localization/LocalizationStrings';
import {
  marginTopDefault,
  paddingHorizontalDefault,
  borderRadiusDefault,
  pageStyle,
  whiteColor,
  errorColor,
  warnColor,
  okColor,
} from '../AppStyle';
import { StyleSheet, SafeAreaView, ScrollView, View, Text } from 'react-native';
import { subscriberDevicesApi, handleApiError } from '../api/apiHandler';
import { useFocusEffect } from '@react-navigation/native';
import { showGeneralError, displayValue } from '../Utils';
import AccordionSection from '../components/AccordionSection';
import ButtonStyled from '../components/ButtonStyled';
import ImageWithBadge from '../components/ImageWithBadge';
import ItemTextWithLabel from '../components/ItemTextWithLabel';
import ItemTextWithLabelEditable from '../components/ItemTextWithLabelEditable';

const DeviceDetails = props => {
  const accessPoint = props.route.params.accessPoint;
  const client = props.route.params.client;
  const [device, setDevice] = useState();
  const [deviceLoading, setDeviceLoading] = useState(false);

  // Refresh the information only anytime there is a navigation change and this has come into focus
  // Need to becareful here as useFocusEffect is also called during re-render so it can result in
  // infinite loops.
  useFocusEffect(
    useCallback(() => {
      if (accessPoint && client) {
        getSubsciberDevice(accessPoint, client);
      }

      // Return function of what should be done on 'focus out'
      return () => {};
      // Disable the eslint warning, as we want to change only on navigation changes
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.navigation, accessPoint, client]),
  );

  const getSubsciberDevice = async (accessPointToQuery, clientToQuery) => {
    if (!subscriberDevicesApi) {
      // This is expected to be temporary
      return;
    }

    try {
      if (!accessPointToQuery || !clientToQuery) {
        showGeneralError(strings.errors.titleDeviceDetails, strings.errors.internal);
        return;
      }

      if (!device) {
        // Only set the loading flag is there is currently no information. If there is already
        // information consider this a refresh so no need to show the user.
        setDeviceLoading(true);
      }

      const response = await subscriberDevicesApi.getSubscriberDevices(accessPointToQuery.id);
      console.log(response.data);

      if (!response || !response.data || !response.data.devices) {
        console.error('Invalid response from getSubsciberDevice');
        showGeneralError(strings.errors.titleDeviceDetails, strings.errors.invalidResponse);
        return;
      }

      const foundDevice = response.data.devices.find(deviceTemp => deviceTemp.macAddress === clientToQuery.macAddress);
      if (foundDevice) {
        setDevice(foundDevice);
      } else {
        setDevice(null);
        showGeneralError(strings.errors.titleDeviceDetails, strings.errors.noSubscriberDevice);
      }
    } catch (error) {
      handleApiError(strings.errors.titleDeviceDetails, error);
    } finally {
      setDeviceLoading(false);
    }
  };

  const updateDeviceValue = jsonObject => {
    if (jsonObject) {
      // Loop though all key/values, but really only expect one pair in the current flow
      for (const [key, value] of Object.entries(jsonObject)) {
        updateSubsciberDevice(accessPoint, client, key, value);
      }
    }
  };

  const updateSubsciberDevice = async (accessPointToUpdate, clientToUpdate, keyToUpdate, valueToUpdate) => {
    if (!subscriberDevicesApi) {
      // This is expected to be temporary
      return;
    }

    try {
      if (!accessPointToUpdate || !clientToUpdate || !keyToUpdate || !valueToUpdate) {
        showGeneralError(strings.errors.titleDeviceDetails, strings.errors.internal);
        return;
      }

      // Get the most current subscriber devices, we want to be as current as possible to ensure we have the latest
      // values before updating the new information
      const responseGet = await subscriberDevicesApi.getSubscriberDevices(accessPointToUpdate.id);
      if (!responseGet || !responseGet.data || !responseGet.data.devices) {
        console.error('Invalid response from getSubsciberDevice');
        showGeneralError(strings.errors.titleDeviceDetails, strings.errors.invalidResponse);
        return;
      }

      let subscriberDevices = responseGet.data.devices;
      let deviceToUpdate = subscriberDevices.find(deviceTemp => deviceTemp.macAddress === clientToUpdate.macAddress);

      // Update the value for the key (which will update the list as well)
      deviceToUpdate[keyToUpdate] = valueToUpdate;

      const responseModify = await subscriberDevicesApi.get.modifySubscriberDevices(
        accessPointToUpdate.id,
        false,
        subscriberDevices,
      );
      console.log(responseModify.data);

      if (!responseModify || !responseModify.data) {
        console.error('Invalid response from modifySubscriberDevices');
        showGeneralError(strings.errors.titleDeviceDetails, strings.errors.invalidResponse);
      }

      // TODO: Verify the response code once API has been implemented
      // Do nothing if everything work as expected
    } catch (error) {
      handleApiError(strings.errors.titleDeviceDetails, error);
    }
  };

  const getDeviceIcon = () => {
    // TODO: Handle proper icon based on device type
    return require('../assets/laptop-solid.png');
  };

  const getDeviceBadgeIcon = () => {
    if ('ssid' in client) {
      return require('../assets/wifi-solid.png');
    } else {
      return require('../assets/network-wired-solid.png');
    }
  };

  const getDeviceBadgeStatusColor = () => {
    if ('ssid' in client) {
      const rssi = client.rssi;

      // Handle WIFI status
      // TODO: Verify this
      if (rssi <= -80) {
        return errorColor;
      } else if (rssi > -80 && rssi <= -50) {
        return warnColor;
      } else if (rssi > -50 && rssi < 0) {
        return okColor;
      } else {
        return errorColor;
      }
    } else {
      // Wired client
      // TODO: Check to see if there is more to look at here
      return okColor;
    }
  };

  const getClientName = () => {
    displayValue(client, 'name');
  };

  const onPauseUnpauseButtonLabel = () => {
    if (device && !device.suspended) {
      return strings.buttons.unpause;
    }

    return strings.buttons.pause;
  };

  const onPauseUnpausePress = async () => {
    if (device) {
      // Swap the current suspend state
      updateDeviceValue({ suspended: !device.suspended });
    } else {
      showGeneralError(strings.errors.titleDeviceDetails, strings.errors.invalidResponse);
    }
  };

  const getConnectionType = () => {
    // TODO: get proper connection type
    if ('ssid' in client) {
      return strings.formatString(strings.deviceDetails.connectionTypeWifi, displayValue(client, 'ssid'));
    } else {
      return strings.formatString(strings.deviceDetails.connectionTypeWired, displayValue(client, 'ssid'));
    }
  };

  // Styles
  const componentStyles = StyleSheet.create({
    sectionDevice: {
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
    sectionDeviceIcon: {
      height: 75,
      width: 75,
    },
    sectionDeviceText: {
      flex: 2,
      fontSize: 18,
      marginHorizontal: paddingHorizontalDefault,
    },
    sectionAccordion: {
      marginTop: marginTopDefault,
    },
  });

  return (
    <SafeAreaView style={pageStyle.safeAreaView}>
      <ScrollView contentContainerStyle={pageStyle.scrollView}>
        <View style={pageStyle.container}>
          <View style={componentStyles.sectionDevice}>
            <ImageWithBadge
              style={componentStyles.sectionDeviceIcon}
              source={getDeviceIcon()}
              badgeSource={getDeviceBadgeIcon()}
              badgeTintColor={whiteColor}
              badgeBackgroundColor={getDeviceBadgeStatusColor()}
              badgeSize="large"
            />
            <Text style={componentStyles.sectionDeviceText}>{getClientName()}</Text>
            <ButtonStyled
              title={onPauseUnpauseButtonLabel()}
              type="outline"
              onPress={onPauseUnpausePress}
              size="small"
              disabled={!device}
            />
          </View>

          <AccordionSection
            style={componentStyles.sectionAccordion}
            title={strings.deviceDetails.connectionDetails}
            disableAccordion={true}
            isLoading={deviceLoading}>
            <ItemTextWithLabel
              key="status"
              label={strings.deviceDetails.status}
              value={strings.deviceDetails.connected}
            />
            <ItemTextWithLabel key="type" label={strings.deviceDetails.connectionType} value={getConnectionType()} />
          </AccordionSection>

          <AccordionSection
            style={componentStyles.sectionAccordion}
            title={strings.deviceDetails.deviceDetails}
            disableAccordion={true}
            isLoading={deviceLoading}>
            <ItemTextWithLabel key="name" label={strings.deviceDetails.name} value={displayValue(device, 'name')} />
            <ItemTextWithLabelEditable
              key="group"
              label={strings.deviceDetails.group}
              value={displayValue(device, 'group')}
              editKey="group"
              onEdit={updateDeviceValue}
            />
            <ItemTextWithLabelEditable
              key="description"
              label={strings.deviceDetails.description}
              value={displayValue(device, 'description')}
              editKey="description"
              onEdit={updateDeviceValue}
            />
            <ItemTextWithLabel key="type" label={strings.deviceDetails.type} value={displayValue(device, 'type')} />
            <ItemTextWithLabel
              key="manufacturer"
              label={strings.deviceDetails.manufacturer}
              value={displayValue(device, 'manufacturer')}
            />
            <ItemTextWithLabel
              key="ipAddress"
              label={strings.deviceDetails.ipAddress}
              value={displayValue(device, 'ip')}
            />
            <ItemTextWithLabel
              key="macAddress"
              label={strings.deviceDetails.macAddress}
              value={displayValue(device, 'macAddress')}
            />
          </AccordionSection>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DeviceDetails;
