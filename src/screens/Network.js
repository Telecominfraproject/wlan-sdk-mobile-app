import React, { useState, useEffect } from 'react';
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
import { accessPointsApi, wifiNetworksApi, handleApiError } from '../api/apiHandler';
import AccordionSection from '../components/AccordionSection';
import ButtonStyled from '../components/ButtonStyled';
import ImageWithBadge from '../components/ImageWithBadge';
import ItemTextWithLabel from '../components/ItemTextWithLabel';
import ItemTextWithIcon from '../components/ItemTextWithIcon';

const Network = props => {
  const [accessPoint, setAccessPoint] = useState();
  const [accessPointLoading, setAccessPointLoading] = useState(false);
  const [wifiNetworks, setWifiNetworks] = useState([]);
  const [wifiNetworksLoading, setWifiNetworksLoading] = useState(false);

  useEffect(() => {
    getAccessPoint();
    getWifiNetworks();
  }, []);

  const getAccessPoint = async () => {
    if (!accessPointsApi) {
      return;
    }

    try {
      setAccessPointLoading(true);
      const response = await accessPointsApi.getSubscriberAccessPointList();
      setAccessPoint(response.data.list);
      console.log(response.data);
    } catch (error) {
      handleApiError(strings.errors.titleNetwork, error);
    } finally {
      setAccessPointLoading(false);
    }
  };

  const getWifiNetworks = async () => {
    if (!wifiNetworksApi) {
      return;
    }

    try {
      setWifiNetworksLoading(true);
      const response = await wifiNetworksApi.getWifiNetworks;
      setWifiNetworks(response.data.list);
      console.log(response.data);
    } catch (error) {
      handleApiError(strings.errors.titleNetwork, error);
    } finally {
      setWifiNetworksLoading(false);
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
            <ButtonStyled title={strings.buttons.reboot} type="outline" onPress={onRebootPress} size="small" />
          </View>
          <AccordionSection
            style={componentStyles.sectionAccordion}
            title={strings.network.network}
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
            isLoading={accessPointLoading}>
            <ItemTextWithLabel
              label={strings.network.firmware}
              value={accessPoint ? accessPoint.firmware : strings.messages.empty}
              buttonTitle={strings.buttons.update}
              onButtonPress={onUpdateFirmwarePress}
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Network;
