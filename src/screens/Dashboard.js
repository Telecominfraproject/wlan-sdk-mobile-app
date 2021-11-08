import React from 'react';
import { strings } from '../localization/LocalizationStrings';
import { pageStyle, okColor, infoColor, errorColor, primaryColor, whiteColor } from '../AppStyle';
import { SafeAreaView, ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import ImageWithBadge from '../components/ImageWithBadge';

const Dashboard = props => {
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
    scrollView: {
      flex: 1,
    },
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
      <ScrollView contentContainerStyle={[pageStyle.scrollView, dashboardStyle.scrollView]}>
        <View style={[pageStyle.container, dashboardStyle.container]}>
          <TouchableOpacity style={dashboardStyle.touchableContainer} onPress={onNetworkPress}>
            <View style={dashboardStyle.itemContainer} onPress={onNetworkPress}>
              <Text style={dashboardStyle.networkNameLabel}>Name</Text>
              <Text style={dashboardStyle.iconLabel}>{strings.dashboard.network}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={dashboardStyle.touchableContainer} onPress={onInternetPress}>
            <View style={dashboardStyle.itemContainer} onPress={onInternetPress}>
              <ImageWithBadge
                style={dashboardStyle.icon}
                source={require('../assets/globe-solid.png')}
                badgeSource={require('../assets/wifi-solid.png')}
                badgeTintColor={whiteColor}
                badgeBackgroundColor={okColor}
              />
              <Text style={dashboardStyle.iconLabel}>{strings.dashboard.internet}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={dashboardStyle.touchableContainer} onPress={onConnectedDevicePress}>
            <View style={dashboardStyle.itemContainer} onPress={onConnectedDevicePress}>
              <ImageWithBadge
                style={dashboardStyle.icon}
                source={require('../assets/laptop-solid.png')}
                badgeText="?"
                badgeTintColor={whiteColor}
                badgeBackgroundColor={infoColor}
              />
              <Text style={dashboardStyle.iconLabel}>{strings.dashboard.connectedDevices}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={dashboardStyle.touchableContainer} onPress={onGuestNetworkPress}>
            <View style={dashboardStyle.itemContainer} onPress={onGuestNetworkPress}>
              <ImageWithBadge
                style={dashboardStyle.icon}
                source={require('../assets/wifi-solid.png')}
                badgeText="X"
                badgeTintColor={whiteColor}
                badgeBackgroundColor={errorColor}
              />
              <Text style={dashboardStyle.iconLabel}>{strings.dashboard.guestNetwork}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;
