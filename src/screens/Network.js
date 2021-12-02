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
} from '../AppStyle';
import { StyleSheet, SafeAreaView, ScrollView, View, Text } from 'react-native';
import { selectCurrentAccessPointId } from '../store/CurrentAccessPointIdSlice';
import { selectSubscriberInformation } from '../store/SubscriberInformationSlice';
import { selectSubscriberInformationLoading } from '../store/SubscriberInformationLoadingSlice';
import { getSubscriberAccessPointInfo } from '../api/apiHandler';
import { displayValue } from '../Utils';
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

  const onRebootPress = async () => {
    // TODO: Implement
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
    // TODO: Implement
    props.navigation.navigate('Devices', { networkName: item.name });
  };

  const onUpdateFirmwarePress = async () => {
    // TODO: Implement
    console.log('Upgrade firmware');
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
              title={strings.buttons.reboot}
              type="outline"
              onPress={onRebootPress}
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
            <ItemTextWithLabel label={strings.network.productModel} value={displayValue(accessPoint, 'model')} />
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Network;
