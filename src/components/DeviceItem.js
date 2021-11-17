import React from 'react';
import { okColor, warnColor, errorColor, whiteColor } from '../AppStyle';
import { StyleSheet, TouchableOpacity, View, Text, Image } from 'react-native';
import ImageWithBadge from '../components/ImageWithBadge';

const DeviceItem = props => {
  const getDeviceIcon = () => {
    return require('../assets/laptop-solid.png');
  };

  const getDeviceStatusColor = () => {
    // Random choice for the moment, until the actual device parsing
    // is implemented
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
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 5,
      paddingHorizontal: 10,
      height: 50,
    },
    icon: {
      width: 30,
      height: 30,
    },
    textContainer: {
      flexDirection: 'column',
      flexWrap: 'nowrap',
      flex: 2,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      marginLeft: 10,
    },
    text: {
      height: 18,
    },
  });

  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={deviceItemStyle.container}>
        <ImageWithBadge
          style={deviceItemStyle.icon}
          source={getDeviceIcon()}
          badgeSource={require('../assets/wifi-solid.png')}
          badgeTintColor={whiteColor}
          badgeBackgroundColor={getDeviceStatusColor()}
          badgeSize="small"
        />

        <View style={deviceItemStyle.textContainer}>
          <Text style={deviceItemStyle.text}>{getDeviceName()}</Text>
          <Text style={deviceItemStyle.text}>{getDeviceType()}</Text>
        </View>

        <Image style={deviceItemStyle.icon} source={require('../assets/angle-right-solid.png')} />
      </View>
    </TouchableOpacity>
  );
};

export default DeviceItem;
