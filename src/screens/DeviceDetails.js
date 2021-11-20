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
import { showGeneralError } from '../Utils';
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
      return;
    }

    try {
      if (!accessPointToQuery || !clientToQuery) {
        showGeneralError(strings.errors.titleNetwork, strings.errors.internal);
        return;
      }

      if (!device) {
        // Only set the loading flag is there is currently no information. If there is already
        // information consider this a refresh so no need to show the user.
        setDeviceLoading(true);
      }

      const response = await subscriberDevicesApi.getSubscriberDevices(accessPointToQuery.id);
      console.log(response.data);
      if (response && response.data) {
        const searchResult = response.data.devices.find(
          deviceTemp => deviceTemp.macAddress === clientToQuery.macAddress,
        );

        if (searchResult) {
          setDevice(searchResult);
        } else {
          // List changed, so clear the current access point
          setDevice(null);
          showGeneralError(strings.errors.titleNetwork, strings.errors.noSubscriberDevice);
        }
      } else {
        console.error('Invalid response from getSubsciberDevice');
        showGeneralError(strings.errors.titleNetwork, strings.errors.invalidResponse);
      }
    } catch (error) {
      handleApiError(strings.errors.titleNetwork, error);
    } finally {
      setDeviceLoading(false);
    }
  };

  const updateDeviceValue = jsonObject => {
    if (jsonObject) {
      // We are looping, but really only expect one
      for (const [key, value] of Object.entries(jsonObject)) {
        updateSubsciberDevice(accessPoint, client, key, value);
      }
    }
  };

  const updateSubsciberDevice = async (accessPointToUpdate, clientToUpdate, keyToUpdate, valueToUpdate) => {
    if (!subscriberDevicesApi) {
      return;
    }

    try {
      if (!accessPointToUpdate || !clientToUpdate || !keyToUpdate || !valueToUpdate) {
        showGeneralError(strings.errors.titleNetwork, strings.errors.internal);
        return;
      }

      // Get the most current subscriber devices, we want to be as current as possible to ensure we have the latest
      // values before updating the new information
      const responseGet = await subscriberDevicesApi.getSubscriberDevices(accessPointToUpdate.id);
      if (responseGet && responseGet.data) {
        let subscriberDevices = responseGet.data.devices;
        let deviceToUpdate = subscriberDevices.find(deviceTemp => deviceTemp.macAddress === clientToUpdate.macAddress);

        // Update the value
        deviceToUpdate[keyToUpdate] = valueToUpdate;

        const responseModify = await subscriberDevicesApi.get.modifySubscriberDevices(
          accessPointToUpdate.id,
          false,
          subscriberDevices,
        );
        console.log(responseModify.data);
        if (responseModify && responseModify.data) {
          // Updated - no need to do anyting
        } else {
          console.error('Invalid response from modifySubscriberDevices');
          showGeneralError(strings.errors.titleNetwork, strings.errors.invalidResponse);
        }
      } else {
        console.error('Invalid response from getSubscriberDevices');
        showGeneralError(strings.errors.titleNetwork, strings.errors.invalidResponse);
      }
    } catch (error) {
      handleApiError(strings.errors.titleNetwork, error);
    }
  };

  const getClientIcon = () => {
    return require('../assets/laptop-solid.png');
  };

  const getClientBadgeIcon = () => {
    return require('../assets/wifi-solid.png');
  };

  const getClientStatusColor = () => {
    // Random choice for the moment, until the actual device parsing is implemented
    let choice = Math.floor(Math.random() * 10) % 3;

    switch (choice) {
      case 2:
        return errorColor;

      case 1:
        return warnColor;

      default:
      case 0:
        return okColor;
    }
  };

  const getClientName = () => {
    return client ? client.name : strings.messages.empty;
  };

  const onPausePress = async () => {
    // Handle pause
  };

  const getConnectionType = () => {
    return device ? device.name : strings.messages.empty;
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
              source={getClientIcon()}
              badgeSource={getClientBadgeIcon()}
              badgeTintColor={whiteColor}
              badgeBackgroundColor={getClientStatusColor()}
              badgeSize="small"
            />
            <Text style={componentStyles.sectionDeviceText}>{getClientName()}</Text>
            <ButtonStyled
              title={strings.buttons.pause}
              type="outline"
              onPress={onPausePress}
              size="small"
              disabled={!client}
            />
          </View>

          <AccordionSection
            style={componentStyles.sectionAccordion}
            title={strings.deviceDetails.connectionDetails}
            disableAccordion={true}
            isLoading={deviceLoading}>
            <ItemTextWithLabel key="status" label={strings.deviceDetails.status} value="Connected" />
            <ItemTextWithLabel key="type" label={strings.deviceDetails.connectionType} value={getConnectionType()} />
          </AccordionSection>

          <AccordionSection
            style={componentStyles.sectionAccordion}
            title={strings.deviceDetails.deviceDetails}
            disableAccordion={true}
            isLoading={deviceLoading}>
            <ItemTextWithLabel
              key="name"
              label={strings.deviceDetails.name}
              value={device ? device.name : strings.messages.empty}
            />
            <ItemTextWithLabelEditable
              key="group"
              label={strings.deviceDetails.group}
              value={device ? device.group : strings.messages.empty}
              editKey="group"
              onEdit={updateDeviceValue}
            />
            <ItemTextWithLabelEditable
              key="description"
              label={strings.deviceDetails.description}
              value={device ? device.description : strings.messages.empty}
              editKey="description"
              onEdit={updateDeviceValue}
            />
            <ItemTextWithLabel
              key="type"
              label={strings.deviceDetails.type}
              value={device ? device.type : strings.messages.empty}
            />
            <ItemTextWithLabel
              key="manufacturer"
              label={strings.deviceDetails.manufacturer}
              value={device ? device.manufacturer : strings.messages.empty}
            />
            <ItemTextWithLabel
              key="ipAddress"
              label={strings.deviceDetails.ipAddress}
              value={device ? device.ip : strings.messages.empty}
            />
            <ItemTextWithLabel
              key="macAddress"
              label={strings.deviceDetails.macAddress}
              value={device ? device.macAddress : strings.messages.empty}
            />
          </AccordionSection>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DeviceDetails;
