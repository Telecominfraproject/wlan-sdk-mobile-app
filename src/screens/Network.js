import React, { useCallback, useState } from 'react';
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
import { internetConnectionApi, wifiNetworksApi, handleApiError } from '../api/apiHandler';
import { selectCurrentAccessPoint } from '../store/SubscriberSlice';
import { useFocusEffect } from '@react-navigation/native';
import { showGeneralError } from '../Utils';
import AccordionSection from '../components/AccordionSection';
import ButtonStyled from '../components/ButtonStyled';
import ImageWithBadge from '../components/ImageWithBadge';
import ItemTextWithIcon from '../components/ItemTextWithIcon';
import ItemTextWithLabel from '../components/ItemTextWithLabel';

const Network = props => {
  const accessPoint = useSelector(selectCurrentAccessPoint);
  const [wifiNetworks, setWifiNetworks] = useState();
  const [wifiNetworksLoading, setWifiNetworksLoading] = useState(false);
  const [internetConnection, setInternetConnection] = useState();
  const [internetConnectionLoading, setInternetConnectionLoading] = useState(false);

  // Refresh the information only anytime there is a navigation change and this has come into focus
  // Need to becareful here as useFocusEffect is also called during re-render so it can result in
  // infinite loops.
  useFocusEffect(
    useCallback(() => {
      getWifiNetworks(accessPoint);
      getInternetConnection(accessPoint);

      // Return function of what should be done on 'focus out'
      return () => {};
      // Disable the eslint warning, as we want to change only on navigation changes
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.navigation, accessPoint]),
  );

  const getWifiNetworks = async accessPointToQuery => {
    if (!wifiNetworksApi) {
      return;
    }

    try {
      if (!accessPointToQuery) {
        // If there is no access point to query, then clear the wifi networks as well
        setWifiNetworks(null);
        return;
      }

      if (!wifiNetworks) {
        // Only set the loading flag is there is currently no information. If there is already
        // information consider this a refresh so no need to show the user.
        setWifiNetworksLoading(true);
      }

      const response = await wifiNetworksApi.getWifiNetworks(accessPointToQuery.id, false);
      console.log(response.data);
      if (response && response.data) {
        setWifiNetworks(response.data);
      } else {
        console.error('Invalid response from getWifiNetworks');
        showGeneralError(strings.errors.titleNetwork, strings.errors.invalidResponse);
      }
    } catch (error) {
      handleApiError(strings.errors.titleNetwork, error);
    } finally {
      setWifiNetworksLoading(false);
    }
  };

  const getInternetConnection = async accessPointToQuery => {
    if (!internetConnectionApi) {
      return;
    }

    try {
      if (!accessPointToQuery) {
        // If there is no access point to query, then clear the internet connection as well
        setInternetConnection(null);
        return;
      }

      if (!internetConnection) {
        // Only set the loading flag is there is currently no information. If there is already
        // information consider this a refresh so no need to show the user.
        setInternetConnectionLoading(true);
      }

      const response = await internetConnectionApi.getInternetConnectionSettings(accessPointToQuery.id, false);
      console.log(response.data);
      if (response && response.data) {
        setInternetConnection(response.data);
      } else {
        console.error('Invalid response from getInternetConnectionSettings');
        showGeneralError(strings.errors.titleNetwork, strings.errors.invalidResponse);
      }
    } catch (error) {
      handleApiError(strings.errors.titleNetwork, error);
    } finally {
      setInternetConnectionLoading(false);
    }
  };

  const getAccessPointIcon = () => {
    return require('../assets/wifi-solid.png');
  };

  const getAccessPointStatusColor = () => {
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
    return require('../assets/wifi-solid.png');
  };

  const getAccessPointName = () => {
    if (!accessPoint) {
      return strings.messages.empty;
    }

    return accessPoint.name;
  };

  const onRebootPress = async () => {
    // Handle reboot
  };

  const getWifiNetworkLabel = item => {
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
    return require('../assets/wifi-solid.png');
  };

  const getWifiNetworkIconTint = item => {
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

  const onWifiNetworkPress = async () => {
    props.navigation.navigate('DeviceList');
  };

  const onUpdateFirmwarePress = async () => {
    // Handle Update Firmware
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
            <Text style={componentStyles.sectionNetworkText}>{getAccessPointName()}</Text>
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
            isLoading={wifiNetworksLoading}>
            {wifiNetworks &&
              wifiNetworks.map(item => {
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
              value={accessPoint ? accessPoint.firmware : strings.messages.empty}
              buttonTitle={strings.buttons.update}
              onButtonPress={onUpdateFirmwarePress}
              buttonDisabled={!accessPoint}
            />
            <ItemTextWithLabel
              label={strings.network.productModel}
              value={accessPoint ? accessPoint.model : strings.messages.empty}
            />
            <ItemTextWithLabel
              label={strings.network.serialNumber}
              value={accessPoint ? accessPoint.serial_number : strings.messages.empty}
            />
            <ItemTextWithLabel
              label={strings.network.macAddress}
              value={accessPoint ? accessPoint.macAddress : strings.messages.empty}
            />
          </AccordionSection>

          <AccordionSection
            style={componentStyles.sectionAccordion}
            title={strings.network.internetSettings}
            disableAccordion={true}
            isLoading={internetConnectionLoading}>
            <ItemTextWithLabel
              label={strings.network.ipAdddress}
              value={internetConnection ? internetConnection.ipAddress : strings.messages.empty}
            />
            <ItemTextWithLabel
              label={strings.network.type}
              value={internetConnection ? internetConnection.type : strings.messages.empty}
            />
            <ItemTextWithLabel
              label={strings.network.subnetMask}
              value={internetConnection ? internetConnection.subnetMask : strings.messages.empty}
            />
            <ItemTextWithLabel
              label={strings.network.defaultGateway}
              value={internetConnection ? internetConnection.defaultGateway : strings.messages.empty}
            />
            <ItemTextWithLabel
              label={strings.network.primaryDns}
              value={internetConnection ? internetConnection.primaryDns : strings.messages.empty}
            />
            <ItemTextWithLabel
              label={strings.network.secondaryDns}
              value={internetConnection ? internetConnection.secondaryDns : strings.messages.empty}
            />
          </AccordionSection>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Network;
