import Config from 'react-native-config';
import React, { useCallback, useRef, useState, useEffect } from 'react';
import { strings } from '../localization/LocalizationStrings';
import { pageStyle, okColor, infoColor, errorColor, primaryColor, whiteColor, grayBackgroundcolor } from '../AppStyle';
import { SafeAreaView, ScrollView, StyleSheet, View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSelectedAccessPointId,
  selectSubscriberInformationLoading,
  selectAccessPoints,
  selectAccessPoint,
  selectInternetConnection,
  selectWifiNetworks,
} from '../store/SubscriberInformationSlice';
import {
  scrollViewToTop,
  displayValue,
  getGuestNetworkIndex,
  setSubscriberInformationInterval,
  deleteAccessPoint,
} from '../Utils';
import ImageWithBadge from '../components/ImageWithBadge';
import ButtonSelector from '../components/ButtonSelector';
import { wifiClientsApi, wiredClientsApi, handleApiError } from '../api/apiHandler';

export default function Dashboard(props) {
  // Refs
  const scrollRef = useRef();
  const isMounted = useRef(false);
  // Dispatch
  const dispatch = useDispatch();
  // Selectors
  const subscriberInformationLoading = useSelector(selectSubscriberInformationLoading);
  const accessPoints = useSelector(selectAccessPoints);
  const accessPoint = useSelector(selectAccessPoint);
  const internetConnection = useSelector(selectInternetConnection);
  const wifiNetworks = useSelector(selectWifiNetworks);
  // States
  const [connectedDevices, setConnectedDevices] = useState(0);

  // Keep track of whether the screen is mounted or not so async tasks know to access state or not.
  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  // Refresh the information only anytime there is a navigation change and this has come into focus
  // Need to be careful here as useFocusEffect is also called during re-render so it can result in
  // infinite loops.
  useFocusEffect(
    useCallback(() => {
      scrollViewToTop(scrollRef);
      var intervalId = setSubscriberInformationInterval(null, props.navigation);
      getConnectedDevices();

      // Return function of what should be done on 'focus out'
      return () => {
        clearInterval(intervalId);
      };
      // Disable the eslint warning, as we want to change only on navigation changes
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.navigation]),
  );

  const getConnectedDevices = async () => {
    if (!accessPoint) {
      return;
    }

    const [wired, wifi] = await Promise.allSettled([
      wiredClientsApi.getWiredClients(accessPoint.macAddress),
      wifiClientsApi.getWifiClients(accessPoint.macAddress),
    ]);

    let wiredClients = wired.value && wired.value.data.clients ? wired.value.data.clients.length : 0;
    let wifiClients = wifi.value && wifi.value.data.associations ? wifi.value.data.associations.length : 0;
    if (isMounted.current) {
      setConnectedDevices(wiredClients + wifiClients);
    }
  };

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

      if (guestNetwork !== null) {
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

      if (guestNetwork !== null) {
        return okColor;
      } else {
        return errorColor;
      }
    }
  };

  const getGuestNetwork = () => {
    let guestNetworkIndex = getGuestNetworkIndex(wifiNetworks);
    if (guestNetworkIndex !== null) {
      return wifiNetworks.wifiNetworks[guestNetworkIndex];
    }

    return null;
  };

  const getConnectedDeviceBadgeBackgroundColor = () => {
    return infoColor;
  };

  const onAccessPointSelect = selected => {
    if (selected) {
      dispatch(setSelectedAccessPointId(selected.id));
    }
  };
  const onNetworkPress = () => {
    props.navigation.navigate('Configuration');
  };

  const onInternetPress = () => {
    props.navigation.navigate('Configuration');
  };

  const onGuestNetworkPress = () => {
    let guestNetworkIndex = getGuestNetworkIndex(wifiNetworks);

    if (guestNetworkIndex !== null) {
      props.navigation.navigate('Network', {
        screen: 'NetworkScreen',
        params: { wifiNetworkIndex: guestNetworkIndex },
      });
    } else {
      // Unexpected, but just go to the Network tab
      props.navigation.navigate('Network');
    }
  };

  const onConnectedDevicePress = () => {
    props.navigation.navigate('Network');
  };

  const renderAccessPointButtons = () => {
    return (
      Config.MULTI_DEVICES === 'true' && (
        <View style={componentStyles.accessPointButtonsContainer}>
          <TouchableOpacity onPress={onAddAccessPointPress}>
            <Image style={componentStyles.accessPointButtons} source={require('../assets/plus-solid.png')} />
          </TouchableOpacity>
          <Text style={componentStyles.iconLabel}>{strings.dashboard.network}</Text>
          <TouchableOpacity onPress={onDeleteAccessPointPress}>
            <Image
              style={[componentStyles.accessPointButtons, componentStyles.deleteIcon]}
              source={require('../assets/times-solid.png')}
            />
          </TouchableOpacity>
        </View>
      )
    );
  };

  const onAddAccessPointPress = () => {
    props.navigation.navigate('DeviceRegistration');
  };

  const onDeleteAccessPointPress = async () => {
    // Show a confirmation prompt
    Alert.alert(strings.dashboard.confirmTitle, strings.dashboard.confirmDeleteAccessPoint, [
      {
        text: strings.buttons.ok,
        onPress: async () => {
          try {
            let accessPointIndex = accessPoints.findIndex(ap => ap.macAddress === accessPoint.macAddress);
            await deleteAccessPoint(accessPointIndex);
          } catch (error) {
            handleApiError(strings.errors.titleDelete, error, props.navigation);
          }
        },
      },
      {
        text: strings.buttons.cancel,
      },
    ]);
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
    accessPointButtonsContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    accessPointButtons: {
      width: 20,
      height: 16,
      margin: 10,
      resizeMode: 'contain',
    },
    deleteIcon: {
      tintColor: errorColor,
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
              {renderAccessPointButtons()}
            </View>
          ) : (
            <TouchableOpacity style={componentStyles.touchableContainer} onPress={onNetworkPress}>
              <View style={componentStyles.itemContainer}>
                <Text style={componentStyles.networkNameLabel}>{displayValue(accessPoint, 'name')}</Text>
                {renderAccessPointButtons()}
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
          {getGuestNetwork() !== null && (
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
          )}
          <TouchableOpacity style={componentStyles.touchableContainer} onPress={onConnectedDevicePress}>
            <View style={componentStyles.itemContainer} onPress={onConnectedDevicePress}>
              <ImageWithBadge
                style={componentStyles.icon}
                source={require('../assets/laptop-solid.png')}
                badgeText={connectedDevices}
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
}
