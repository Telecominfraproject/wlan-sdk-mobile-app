import React, { useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { strings } from '../localization/LocalizationStrings';
import { pageStyle, okColor, infoColor, errorColor, primaryColor, whiteColor, grayBackgroundcolor } from '../AppStyle';
import { SafeAreaView, ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { selectCurrentAccessPointId, setCurrentAccessPointId } from '../store/CurrentAccessPointIdSlice';
import { selectSubscriberInformation } from '../store/SubscriberInformationSlice';
import { selectSubscriberInformationLoading } from '../store/SubscriberInformationLoadingSlice';
import { getSubscriberAccessPointInfo } from '../api/apiHandler';
import { displayValue, setSubscriberInformationInterval } from '../Utils';
import ImageWithBadge from '../components/ImageWithBadge';
import ButtonSelector from '../components/ButtonSelector';

const Dashboard = props => {
  const dispatch = useDispatch();
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
  const accessPoints = useMemo(
    () => subscriberInformation.accessPoints.list,
    /*() => [
      ...subscriberInformation.accessPoints.list,
      {
        address: {
          addressLines: [],
          buildingName: '',
          city: '',
          country: '',
          mobiles: [],
          phones: [],
          postal: '',
          state: '',
        },
        deviceMode: {
          created: 1638467981,
          enableLEDS: true,
          endIP: '',
          modified: 1638467981,
          startIP: '',
          subnet: '',
          subnetMask: '',
          type: 'nat',
        },
        dnsConfiguration: {
          ISP: true,
          custom: false,
          primary: '',
          secondary: '',
        },
        id: '123-321',
        internetConnection: {
          created: 1638467981,
          defaultGateway: '',
          ipAddress: '',
          modified: 1638467981,
          password: '',
          primaryDns: '',
          secondaryDns: '',
          subNetMask: '',
          type: 'automatic',
          username: '',
        },
        ipReservations: {
          created: 140188505938256,
          id: '',
          modified: 140187598507616,
          reservations: [],
        },
        macAddress: '000000000000',
        name: 'My Second Access Point',
        subscriberDevices: {
          created: 17,
          devices: [],
          modified: 140187598361808,
        },
        wifiNetworks: {
          created: 1638467981,
          modified: 1638467981,
          wifiNetworks: [
            {
              bands: ['2G', '5G'],
              encryption: 'wpa2',
              name: 'HomeWifi',
              password: 'OpenWifi',
              type: 'main',
            },
          ],
        },
      },
    ],*/
    [subscriberInformation],
  );

  // Refresh the information only anytime there is a navigation change and this has come into focus
  // Need to be careful here as useFocusEffect is also called during re-render so it can result in
  // infinite loops.
  useFocusEffect(
    useCallback(() => {
      var intervalId = setSubscriberInformationInterval(subscriberInformation, null);

      // Return function of what should be done on 'focus out'
      return () => {
        clearInterval(intervalId);
      };
      // Disable the eslint warning, as we want to change only on navigation changes
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.navigation]),
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

  const onAccessPointSelect = selected => {
    if (selected) {
      dispatch(setCurrentAccessPointId(selected.id));
    }
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
      textAlign: 'center',
      fontSize: 48,
      color: okColor,
      textTransform: 'uppercase',
    },
    networkCaret: {
      width: 20,
      height: 20,
      resizeMode: 'contain',
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
    dropdown: {
      borderWidth: 0,
      backgroundColor: grayBackgroundcolor,
      borderColor: primaryColor,
    },
  });

  return (
    <SafeAreaView style={pageStyle.safeAreaView}>
      <ScrollView contentContainerStyle={pageStyle.scrollView}>
        <View style={[pageStyle.container, componentStyles.container]}>
          {accessPoints.length > 1 ? (
            <View style={componentStyles.itemContainer}>
              <ButtonSelector
                maxButtons={0}
                options={accessPoints}
                titleKey={'name'}
                onSelect={selected => onAccessPointSelect(selected)}
                labelStyle={componentStyles.networkNameLabel}
                dropdownStyle={componentStyles.dropdown}
                height={200}
                numberOfLines={3}
              />
              <Text style={componentStyles.iconLabel}>{strings.dashboard.network}</Text>
            </View>
          ) : (
            <TouchableOpacity style={componentStyles.touchableContainer} onPress={onNetworkPress}>
              <View style={componentStyles.itemContainer}>
                <Text style={componentStyles.networkNameLabel}>{displayValue(accessPoint, 'name')}</Text>
                <Text style={componentStyles.iconLabel}>{strings.dashboard.network}</Text>
              </View>
            </TouchableOpacity>
          )}
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
