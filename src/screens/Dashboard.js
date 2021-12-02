import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { strings } from '../localization/LocalizationStrings';
import { pageStyle, okColor, infoColor, errorColor, primaryColor, whiteColor } from '../AppStyle';
import { SafeAreaView, ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { selectCurrentAccessPointId } from '../store/CurrentAccessPointIdSlice';
import { selectSubscriberInformation } from '../store/SubscriberInformationSlice';
import { selectSubscriberInformationLoading } from '../store/SubscriberInformationLoadingSlice';
import { getSubscriberAccessPointInfo } from '../api/apiHandler';
import { displayValue } from '../Utils';
import ImageWithBadge from '../components/ImageWithBadge';

const Dashboard = props => {
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
  const subscriberDevices = useMemo(
    () => getSubscriberAccessPointInfo(subscriberInformation, currentAccessPointId, 'subscriberDevices'),
    [subscriberInformation, currentAccessPointId],
  );
  const wifiNetworks = useMemo(
    () => getSubscriberAccessPointInfo(subscriberInformation, currentAccessPointId, 'wifiNetworks'),
    [subscriberInformation, currentAccessPointId],
  );

  const getInternetBadge = () => {
    if (subscriberInformationLoading) {
      return require('../assets/question-solid.png');
    } else if (internetConnection && internetConnection.ipAddress) {
      return require('../assets/check-solid.png');
    } else {
      return require('../assets/times-solid.png');
    }
  };

  const getInternetBadgeBackgroundColor = () => {
    if (subscriberInformationLoading) {
      return infoColor;
    } else if (internetConnection && internetConnection.ipAddress) {
      return okColor;
    } else {
      return errorColor;
    }
  };

  const getGuestNetworkBadge = () => {
    if (subscriberInformationLoading) {
      return require('../assets/question-solid.png');
    } else {
      const guestNetwork = getGuestNetwork();

      if (guestNetwork) {
        return require('../assets/check-solid.png');
      } else {
        return require('../assets/times-solid.png');
      }
    }
  };

  const getGuestNetworkBadgeBackgroundColor = () => {
    if (subscriberInformationLoading) {
      return infoColor;
    } else {
      const guestNetwork = getGuestNetwork();

      if (guestNetwork) {
        return okColor;
      } else {
        return errorColor;
      }
    }
  };

  const getGuestNetwork = () => {
    if (wifiNetworks && wifiNetworks.wifiNetworks) {
      // Return the first guest network
      return wifiNetworks.wifiNetworks.find(network => network.type === 'guest');
    }

    return null;
  };

  const getConnectedDeviceBadgeText = () => {
    if (subscriberInformationLoading) {
      return '-';
    } else if (subscriberDevices && subscriberDevices.devices.length) {
      return subscriberDevices.devices.length;
    } else {
      return '0';
    }
  };

  const getConnectedDeviceBadgeBackgroundColor = () => {
    return infoColor;
  };

  const onNetworkPress = async () => {
    props.navigation.navigate('Network');
  };

  const onInternetPress = async () => {
    props.navigation.navigate('Network');
  };

  const onConnectedDevicePress = async () => {
    props.navigation.navigate('Devices');
  };

  const onGuestNetworkPress = async () => {
    props.navigation.navigate('Network');
  };

  const componentStyles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'space-between',
    },
    touchableContainer: {
      width: '100%',
    },
    itemContainer: {
      flexDirection: 'column',
      width: '100%',
      alignItems: 'center',
    },
    networkNameLabel: {
      fontSize: 48,
      color: okColor,
      textTransform: 'uppercase',
    },
    icon: {
      height: 80,
      width: 80,
      resizeMode: 'contain',
      tintColor: primaryColor,
    },
    iconLabel: {
      marginTop: 10,
      fontSize: 12,
    },
  });

  return (
    <SafeAreaView style={pageStyle.safeAreaView}>
      <ScrollView contentContainerStyle={pageStyle.scrollView}>
        <View style={[pageStyle.container, componentStyles.container]}>
          <TouchableOpacity style={componentStyles.touchableContainer} onPress={onNetworkPress}>
            <View style={componentStyles.itemContainer} onPress={onNetworkPress}>
              <Text style={componentStyles.networkNameLabel}>{displayValue(accessPoint, 'name')}</Text>
              <Text style={componentStyles.iconLabel}>{strings.dashboard.network}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={componentStyles.touchableContainer} onPress={onInternetPress}>
            <View style={componentStyles.itemContainer} onPress={onInternetPress}>
              <ImageWithBadge
                style={componentStyles.icon}
                source={require('../assets/globe-solid.png')}
                badgeSource={getInternetBadge()}
                badgeBackgroundColor={getInternetBadgeBackgroundColor()}
                badgeTintColor={whiteColor}
              />
              <Text style={componentStyles.iconLabel}>{strings.dashboard.internet}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={componentStyles.touchableContainer} onPress={onGuestNetworkPress}>
            <View style={componentStyles.itemContainer} onPress={onGuestNetworkPress}>
              <ImageWithBadge
                style={componentStyles.icon}
                source={require('../assets/wifi-solid.png')}
                badgeSource={getGuestNetworkBadge()}
                badgeBackgroundColor={getGuestNetworkBadgeBackgroundColor()}
                badgeTintColor={whiteColor}
              />
              <Text style={componentStyles.iconLabel}>{strings.dashboard.guestNetwork}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={componentStyles.touchableContainer} onPress={onConnectedDevicePress}>
            <View style={componentStyles.itemContainer} onPress={onConnectedDevicePress}>
              <ImageWithBadge
                style={componentStyles.icon}
                source={require('../assets/laptop-solid.png')}
                badgeText={getConnectedDeviceBadgeText()}
                badgeBackgroundColor={getConnectedDeviceBadgeBackgroundColor()}
                badgeTintColor={whiteColor}
              />
              <Text style={componentStyles.iconLabel}>{strings.dashboard.connectedDevices}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;
