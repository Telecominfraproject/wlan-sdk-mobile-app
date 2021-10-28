import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Image } from 'react-native';

export class DeviceItem extends Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={deviceItemStyle.container}>
          <Image style={deviceItemStyle.icon} source={this.getDeviceIcon()} />

          <View style={deviceItemStyle.textContainer}>
            <Text>{this.getDeviceName()}</Text>
            <Text>{this.getDeviceType()}</Text>
          </View>

          <Image style={deviceItemStyle.icon} source={this.getDeviceStatusIcon()} />

          <Text>&gt;</Text>
        </View>
      </TouchableOpacity>
    );
  }

  getDeviceIcon() {
    return require('../assets/server-solid.png');
  }

  getDeviceName() {
    return this.props.device.compatible;
  }

  getDeviceType() {
    return this.props.device.manufacturer;
  }

  getDeviceStatusIcon() {
    return require('../assets/wifi-solid.png');
  }
}

const deviceItemStyle = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 5,
    padding: 10,
  },
  textContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    flexWrap: 'nowrap',
    flex: 2,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
    marginLeft: 10,
  },
});
