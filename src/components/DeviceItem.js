import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Image } from 'react-native';

const DeviceItem = props => {
  const getDeviceIcon = () => {
    return require('../assets/laptop-solid.png');
  };

  const getDeviceName = () => {
    return props.device.compatible;
  };

  const getDeviceType = () => {
    return props.device.manufacturer;
  };

  const deviceItemStyle = StyleSheet.create({
    container: {
      flexDirection: 'row',
      flexWrap: 'nowrap',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 10,
    },
    textContainer: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      flexWrap: 'nowrap',
      flex: 2,
      marginLeft: 10,
    },
    icon: {
      width: 24,
      height: 24,
    },
  });

  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={deviceItemStyle.container}>
        <Image style={deviceItemStyle.icon} source={getDeviceIcon()} />

        <View style={deviceItemStyle.textContainer}>
          <Text>{getDeviceName()}</Text>
          <Text>{getDeviceType()}</Text>
        </View>

        <Image style={deviceItemStyle.icon} source={require('../assets/angle-right-solid.png')} />
      </View>
    </TouchableOpacity>
  );
};

export default DeviceItem;
