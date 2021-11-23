import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { strings } from '../localization/LocalizationStrings';
import { pageStyle, okColor, infoColor, errorColor, primaryColor, whiteColor } from '../AppStyle';
import { SafeAreaView, ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { selectCurrentAccessPoint } from '../store/SubscriberSlice';
import { internetConnectionApi, wifiNetworksApi, subscriberDevicesApi, handleApiError } from '../api/apiHandler';
import { showGeneralError } from '../Utils';
import ImageWithBadge from '../components/ImageWithBadge';

const Dashboard = props => {
  const accessPoint = useSelector(selectCurrentAccessPoint);
  const [internetConnection, setInternetConnection] = useState();
  const [internetConnectionLoading, setInternetConnectionLoading] = useState(false);
  const [wifiNetworks, setWifiNetworks] = useState();
  const [wifiNetworksLoading, setWifiNetworksLoading] = useState(false);
  const [subscriberDevices, setSubscriberDevices] = useState();
  const [subscriberDevicesLoading, setSubscriberDevicesLoading] = useState(false);

  // Refresh the information only anytime there is a navigation change and this has come into focus
  // Need to becareful here as useFocusEffect is also called during re-render so it can result in
  // infinite loops.
  useFocusEffect(
    useCallback(() => {
      getInternetConnection(accessPoint);
      getWifiNetworks(accessPoint);
      getSubsciberDevices(accessPoint);

      // Return function of what should be done on 'focus out'
      return () => {};
      // Disable the eslint warning, as we want to change only on navigation changes
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.navigation, accessPoint]),
  );

  const getInternetConnection = async accessPointToQuery => {
    if (!internetConnectionApi) {
      return;
    }

    try {
      if (!accessPointToQuery) {
        // If there is no access point to query, then clear the internet connection as well
        internetConnection(null);
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
        showGeneralError(strings.errors.titleDashboard, strings.errors.invalidResponse);
      }
    } catch (error) {
      handleApiError(strings.errors.titleDashboard, error);
    } finally {
      setInternetConnectionLoading(false);
    }
  };

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
        showGeneralError(strings.errors.titleDashboard, strings.errors.invalidResponse);
      }
    } catch (error) {
      handleApiError(strings.errors.titleDashboard, error);
    } finally {
      setWifiNetworksLoading(false);
    }
  };

  const getSubsciberDevices = async accessPointToQuery => {
    if (!subscriberDevicesApi) {
      return;
    }

    try {
      if (!accessPointToQuery) {
        showGeneralError(strings.errors.titleDashboard, strings.errors.internal);
        return;
      }

      if (!subscriberDevices) {
        // Only set the loading flag is there is currently no information. If there is already
        // information consider this a refresh so no need to show the user.
        setSubscriberDevicesLoading(true);
      }

      const response = await subscriberDevicesApi.getSubscriberDevices(accessPointToQuery.id);
      console.log(response.data);
      if (response && response.data) {
        setSubscriberDevices(response.data);
      } else {
        console.error('Invalid response from getSubsciberDevices');
        showGeneralError(strings.errors.titleDashboard, strings.errors.invalidResponse);
      }
    } catch (error) {
      handleApiError(strings.errors.titleDashboard, error);
    } finally {
      setSubscriberDevicesLoading(false);
    }
  };

  const getInternetBadge = () => {
    if (internetConnectionLoading) {
      return require('../assets/question-solid.png');
    } else if (internetConnection && internetConnection.ipAddress) {
      return require('../assets/check-solid.png');
    } else {
      return require('../assets/times-solid.png');
    }
  };

  const getInternetBadgeBackgroundColor = () => {
    if (internetConnectionLoading) {
      return infoColor;
    } else if (internetConnection && internetConnection.ipAddress) {
      return okColor;
    } else {
      return errorColor;
    }
  };

  const getGuestNetworkBadge = () => {
    if (wifiNetworksLoading) {
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
    if (wifiNetworksLoading) {
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

  const getConnectedDeviceBadgeText = () => {
    if (subscriberDevicesLoading) {
      return '-';
    } else if (!subscriberDevices) {
      return '0';
    } else {
      return subscriberDevices.length;
    }
  };

  const getConnectedDeviceBadgeBackgroundColor = () => {
    return infoColor;
  };

  const getGuestNetwork = () => {
    if (wifiNetworks) {
      // Return first guest network
      return wifiNetworks.find(network => network.type === 'guest');
    }

    return null;
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

  const dashboardStyle = StyleSheet.create({
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
        <View style={[pageStyle.container, dashboardStyle.container]}>
          <TouchableOpacity style={dashboardStyle.touchableContainer} onPress={onNetworkPress}>
            <View style={dashboardStyle.itemContainer} onPress={onNetworkPress}>
              <Text style={dashboardStyle.networkNameLabel}>{accessPoint ? accessPoint.name : '-'}</Text>
              <Text style={dashboardStyle.iconLabel}>{strings.dashboard.network}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={dashboardStyle.touchableContainer} onPress={onInternetPress}>
            <View style={dashboardStyle.itemContainer} onPress={onInternetPress}>
              <ImageWithBadge
                style={dashboardStyle.icon}
                source={require('../assets/globe-solid.png')}
                badgeSource={getInternetBadge()}
                badgeBackgroundColor={getInternetBadgeBackgroundColor()}
                badgeTintColor={whiteColor}
              />
              <Text style={dashboardStyle.iconLabel}>{strings.dashboard.internet}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={dashboardStyle.touchableContainer} onPress={onGuestNetworkPress}>
            <View style={dashboardStyle.itemContainer} onPress={onGuestNetworkPress}>
              <ImageWithBadge
                style={dashboardStyle.icon}
                source={require('../assets/wifi-solid.png')}
                badgeSource={getGuestNetworkBadge()}
                badgeBackgroundColor={getGuestNetworkBadgeBackgroundColor()}
                badgeTintColor={whiteColor}
              />
              <Text style={dashboardStyle.iconLabel}>{strings.dashboard.guestNetwork}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={dashboardStyle.touchableContainer} onPress={onConnectedDevicePress}>
            <View style={dashboardStyle.itemContainer} onPress={onConnectedDevicePress}>
              <ImageWithBadge
                style={dashboardStyle.icon}
                source={require('../assets/laptop-solid.png')}
                badgeText={getConnectedDeviceBadgeText()}
                badgeBackgroundColor={getConnectedDeviceBadgeBackgroundColor()}
                badgeTintColor={whiteColor}
              />
              <Text style={dashboardStyle.iconLabel}>{strings.dashboard.connectedDevices}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;
