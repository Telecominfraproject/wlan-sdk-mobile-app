import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
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
  pageItemStyle,
} from '../AppStyle';
import { StyleSheet, SafeAreaView, ScrollView, View, Text, Alert } from 'react-native';
import { selectCurrentAccessPointId } from '../store/CurrentAccessPointIdSlice';
import { selectSubscriberInformation } from '../store/SubscriberInformationSlice';
import { selectSubscriberInformationLoading } from '../store/SubscriberInformationLoadingSlice';
import { getSubscriberAccessPointInfo, deviceCommandsApi, handleApiError } from '../api/apiHandler';
import { displayValue, showGeneralError } from '../Utils';
import AccordionSection from '../components/AccordionSection';
import ButtonStyled from '../components/ButtonStyled';
import ImageWithBadge from '../components/ImageWithBadge';
import ItemTextWithIcon from '../components/ItemTextWithIcon';
import ItemTextWithLabel from '../components/ItemTextWithLabel';

const Network = props => {
  const currentAccessPointId = useSelector(selectCurrentAccessPointId);
  const subscriberInformation = useSelector(selectSubscriberInformation);
  const subscriberInformationLoading = useSelector(selectSubscriberInformationLoading);
  const accessPoint = useMemo(
    () => getSubscriberAccessPointInfo(subscriberInformation, currentAccessPointId, null),
    [subscriberInformation, currentAccessPointId],
  );
  const internetConnection = useMemo(
    () => getSubscriberAccessPointInfo(subscriberInformation, currentAccessPointId, 'internetConnection'),
    [subscriberInformation, currentAccessPointId],
  );
  const wifiNetworks = useMemo(
    () => getSubscriberAccessPointInfo(subscriberInformation, currentAccessPointId, 'wifiNetworks'),
    [subscriberInformation, currentAccessPointId],
  );

  const getAccessPointIcon = () => {
    // TODO: Implement
    return require('../assets/wifi-solid.png');
  };

  const getAccessPointStatusColor = () => {
    // TODO: Implement
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

  const getAccessPointBadgeIcon = () => {
    // TODO: Implement
    return require('../assets/wifi-solid.png');
  };

  const onRefreshPress = async () => {
    sendAccessPointCommand('refresh', strings.network.commandRefreshSuccess);
  };

  const getWifiNetworkLabel = item => {
    // TODO: Ensure this is correct
    if (!item) {
      return strings.messages.empty;
    }

    switch (item.type) {
      case 'main':
        return strings.formatString(strings.network.mainNetwork, item.name);

      case 'guest':
        return strings.network.guestNetwork;

      default:
        return item.name;
    }
  };

  const getWifiNetworkIcon = item => {
    // TODO: Implement
    return require('../assets/wifi-solid.png');
  };

  const getWifiNetworkIconTint = item => {
    // TODO: Implement
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

  const onWifiNetworkPress = async item => {
    // TODO: Confirm
    props.navigation.navigate('Devices', { networkName: item.name });
  };

  const onUpdateFirmwarePress = async () => {
    sendAccessPointCommandWithConfirm(
      'upgrade',
      strings.network.commandFirmwareUpdateSuccess,
      strings.network.confirmFirmwareUpdateSuccess,
    );
  };

  const onBlinkLightsPress = async () => {
    sendAccessPointCommand('blink', strings.network.commandLightBlinkSuccess);
  };

  const onFactoryResetPress = async () => {
    sendAccessPointCommandWithConfirm(
      'factory',
      strings.network.commandFactoryResetSuccess,
      strings.network.confirmFactoryResetSuccess,
    );
  };

  const onRebootPress = async () => {
    sendAccessPointCommandWithConfirm(
      'reboot',
      strings.network.commandRebootSuccess,
      strings.network.confirmRebootSuccess,
    );
  };

  const sendAccessPointCommandWithConfirm = async (action, successMessage, confirmMessage) => {
    if (confirmMessage) {
      Alert.alert(strings.network.confirmTitle, confirmMessage, [
        {
          text: strings.buttons.ok,
          onPress: () => {
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
      // TODO: Verify this is funcitoning and the function call is corrected!
      const response = await deviceCommandsApi.oerfirmAnAction(action, { mac: accessPoint.macAddress, when: 0 });

      if (!response || !response.data) {
        throw new Error(strings.errors.invalidResponse);
      }

      if (response.data.Code === 0) {
        showGeneralError(strings.errors.titleAccessPointCommand, successMessage);
      } else {
        throw new Error(strings.errors.invalidResponse);
      }
    } catch (error) {
      // Handle the error.
      handleApiError(strings.errors.titleAccessPointCommand, error);
    }
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
      <ScrollView contentContainerStyle={pageStyle.scrollView}>
        <View style={pageStyle.container}>
          <View style={componentStyles.sectionNetwork}>
            <ImageWithBadge
              style={componentStyles.sectionNetworkIcon}
              source={getAccessPointIcon()}
              badgeSource={getAccessPointBadgeIcon()}
              badgeTintColor={whiteColor}
              badgeBackgroundColor={getAccessPointStatusColor()}
              badgeSize="small"
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
            style={componentStyles.sectionAccordion}
            title={strings.network.networks}
            disableAccordion={true}
            isLoading={subscriberInformationLoading}>
            {wifiNetworks &&
              wifiNetworks.wifiNetworks &&
              wifiNetworks.wifiNetworks.map(item => {
                return (
                  <ItemTextWithIcon
                    label={getWifiNetworkLabel(item)}
                    key={item.name}
                    icon={getWifiNetworkIcon(item)}
                    iconTintColor={getWifiNetworkIconTint(item)}
                    onPress={() => onWifiNetworkPress(item)}
                  />
                );
              })}
          </AccordionSection>

          <AccordionSection
            style={componentStyles.sectionAccordion}
            title={strings.network.routerSettings}
            disableAccordion={true}
            isLoading={false}>
            <ItemTextWithLabel
              label={strings.network.firmware}
              value={displayValue(accessPoint, 'firmware')}
              buttonTitle={strings.buttons.update}
              onButtonPress={onUpdateFirmwarePress}
              buttonDisabled={!accessPoint}
            />
            <ItemTextWithLabel
              label={strings.network.productModel}
              value={displayValue(accessPoint, 'model')}
              buttonTitle={strings.buttons.blink}
              onButtonPress={onBlinkLightsPress}
              buttonDisabled={!accessPoint}
            />
            <ItemTextWithLabel
              label={strings.network.serialNumber}
              value={displayValue(accessPoint, 'serial_number')}
            />
            <ItemTextWithLabel label={strings.network.macAddress} value={displayValue(accessPoint, 'macAddress')} />
          </AccordionSection>

          <AccordionSection
            style={componentStyles.sectionAccordion}
            title={strings.network.internetSettings}
            disableAccordion={true}
            isLoading={subscriberInformationLoading}>
            <ItemTextWithLabel
              label={strings.network.ipAdddress}
              value={displayValue(internetConnection, 'ipAddress')}
            />
            <ItemTextWithLabel label={strings.network.type} value={displayValue(internetConnection, 'type')} />
            <ItemTextWithLabel
              label={strings.network.subnetMask}
              value={displayValue(internetConnection, 'subnetMask')}
            />
            <ItemTextWithLabel
              label={strings.network.defaultGateway}
              value={displayValue(internetConnection, 'defaultGateway')}
            />
            <ItemTextWithLabel
              label={strings.network.primaryDns}
              value={displayValue(internetConnection, 'primaryDns')}
            />
            <ItemTextWithLabel
              label={strings.network.secondaryDns}
              value={displayValue(internetConnection, 'secondaryDns')}
            />
          </AccordionSection>

          {/* Buttons */}
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

export default Network;
