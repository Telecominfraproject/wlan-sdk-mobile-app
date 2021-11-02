import React from 'react';
import { strings } from '../localization/LocalizationStrings';
import { okColor } from '../AppStyle';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';

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

  return (
    <View style={dashboardStyle.container}>
      <TouchableOpacity style={dashboardStyle.touchableContainer} onPress={onNetworkPress}>
        <View style={dashboardStyle.itemContainer} onPress={onNetworkPress}>
          <Text style={dashboardStyle.networkNameLabel}>Name</Text>
          <Text style={dashboardStyle.iconLabel}>{strings.dashboard.network}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={dashboardStyle.touchableContainer} onPress={onInternetPress}>
        <View style={dashboardStyle.itemContainer} onPress={onInternetPress}>
          <Image style={dashboardStyle.icon} source={require('../assets/globe-solid.png')} />
          <Text style={dashboardStyle.iconLabel}>{strings.dashboard.internet}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={dashboardStyle.touchableContainer} onPress={onConnectedDevicePress}>
        <View style={dashboardStyle.itemContainer} onPress={onConnectedDevicePress}>
          <Image style={dashboardStyle.icon} source={require('../assets/laptop-solid.png')} />
          <Text style={dashboardStyle.iconLabel}>{strings.dashboard.connectedDevices}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={dashboardStyle.touchableContainer} onPress={onGuestNetworkPress}>
        <View style={dashboardStyle.itemContainer} onPress={onGuestNetworkPress}>
          <Image style={dashboardStyle.icon} source={require('../assets/wifi-solid.png')} />
          <Text style={dashboardStyle.iconLabel}>{strings.dashboard.guestNetwork}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const dashboardStyle = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flexWrap: 'nowrap',
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 20,
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
    width: '100%',
    resizeMode: 'contain',
    marginBottom: 10,
  },
  iconLabel: {
    fontSize: 12,
  },
});

export default Dashboard;
