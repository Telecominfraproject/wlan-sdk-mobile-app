import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { strings } from '../localization/LocalizationStrings';
import { marginTopDefault, paddingHorizontalDefault, borderRadiusDefault, pageStyle, whiteColor } from '../AppStyle';
import { StyleSheet, SafeAreaView, ScrollView, View, Text } from 'react-native';
import { selectCurrentAccessPointId } from '../store/CurrentAccessPointIdSlice';
import { selectSubscriberInformation } from '../store/SubscriberInformationSlice';
import { selectSubscriberInformationLoading } from '../store/SubscriberInformationLoadingSlice';
import {
  showGeneralError,
  displayValue,
  getDeviceFromClient,
  getClientIcon,
  getClientConnectionIcon,
  getClientConnectionStatusColor,
  updateSubscriberDevice,
} from '../Utils';
import AccordionSection from '../components/AccordionSection';
import ButtonStyled from '../components/ButtonStyled';
import ImageWithBadge from '../components/ImageWithBadge';
import ItemTextWithLabel from '../components/ItemTextWithLabel';
import ItemTextWithLabelEditable from '../components/ItemTextWithLabelEditable';

const DeviceDetails = props => {
  const currentAccessPointId = useSelector(selectCurrentAccessPointId);
  const client = props.route.params.client;
  const subscriberInformation = useSelector(selectSubscriberInformation);
  const subscriberInformationLoading = useSelector(selectSubscriberInformationLoading);
  const device = useMemo(
    () => getDeviceFromClient(client, subscriberInformation, currentAccessPointId),
    [subscriberInformation, currentAccessPointId, client],
  );

  const getDeviceIcon = () => {
    return getClientIcon(client);
  };

  const getDeviceBadgeIcon = () => {
    return getClientConnectionIcon(client);
  };

  const getDeviceBadgeStatusColor = () => {
    return getClientConnectionStatusColor(client);
  };

  const getDeviceName = () => {
    return displayValue(client, 'name');
  };

  const onPauseUnpauseButtonLabel = () => {
    if (device && !device.suspended) {
      return strings.buttons.unpause;
    }

    return strings.buttons.pause;
  };

  const updateDeviceValue = jsonObject => {
    if (jsonObject) {
      updateSubscriberDevice(subscriberInformation, currentAccessPointId, device, jsonObject);
    }
  };

  const onPauseUnpausePress = async () => {
    if (device) {
      // Swap the current suspend state
      updateSubscriberDevice(subscriberInformation, currentAccessPointId, device, { suspended: !device.suspended });
    } else {
      showGeneralError(strings.errors.titleDeviceDetails, strings.errors.invalidResponse);
    }
  };

  const getConnectionType = () => {
    // TODO: get proper connection type
    if ('ssid' in client) {
      return strings.formatString(strings.deviceDetails.connectionTypeWifi, displayValue(client, 'ssid'));
    } else {
      return strings.formatString(strings.deviceDetails.connectionTypeWired, displayValue(client, 'speed'));
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
            <Text style={componentStyles.sectionDeviceText}>{getDeviceName()}</Text>
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
            isLoading={subscriberInformationLoading}>
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
            isLoading={subscriberInformationLoading}>
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
