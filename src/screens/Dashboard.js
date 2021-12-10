import React, { useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { strings } from '../localization/LocalizationStrings';
import { pageStyle, okColor, infoColor, errorColor, primaryColor, whiteColor, grayBackgroundcolor } from '../AppStyle';
import { SafeAreaView, ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  setSelectedAccessPointId,
  selectSubscriberInformationLoading,
  selectSubscriberInformation,
  selectAccessPoints,
  selectAccessPoint,
  selectInternetConnection,
  selectSubscriberDevices,
  selectWifiNetworks,
} from '../store/SubscriberInformationSlice';
import { displayValue, setSubscriberInformationInterval, scrollViewToTop } from '../Utils';
import ImageWithBadge from '../components/ImageWithBadge';
import ButtonSelector from '../components/ButtonSelector';

const Dashboard = props => {
  const scrollRef = useRef();
  const dispatch = useDispatch();
  const subscriberInformation = useSelector(selectSubscriberInformation);
  const subscriberInformationLoading = useSelector(selectSubscriberInformationLoading);
  const accessPoints = useSelector(selectAccessPoints);
  const accessPoint = useSelector(selectAccessPoint);
  const internetConnection = useSelector(selectInternetConnection);
  const subscriberDevices = useSelector(selectSubscriberDevices);
  const wifiNetworks = useSelector(selectWifiNetworks);

  // Refresh the information only anytime there is a navigation change and this has come into focus
  // Need to be careful here as useFocusEffect is also called during re-render so it can result in
  // infinite loops.
  useFocusEffect(
    useCallback(() => {
      scrollViewToTop(scrollRef);
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
    } else if (subscriberDevices && subscriberDevices.devices) {
      return subscriberDevices.devices.length;
    } else {
      return '?';
    }
  };

  const getConnectedDeviceBadgeBackgroundColor = () => {
    return infoColor;
  };

  const onAccessPointSelect = selected => {
    if (selected) {
      dispatch(setSelectedAccessPointId(selected.id));
    }
  };
  const onNetworkPress = async () => {
    props.navigation.navigate('Configuration');
  };

  const onInternetPress = async () => {
    props.navigation.navigate('Configuration');
  };

  const onConnectedDevicePress = async () => {
    props.navigation.navigate('Devices');
  };

  const onGuestNetworkPress = async () => {
    props.navigation.navigate('Configuration');
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
      <ScrollView ref={scrollRef} contentContainerStyle={pageStyle.scrollView}>
        <View style={[pageStyle.containerPostLogin, componentStyles.container]}>
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
          {getGuestNetwork() ? (
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
          ) : (
            <></>
          )}
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
