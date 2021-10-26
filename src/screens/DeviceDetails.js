import React, {Component} from 'react';
import {pageStyle, pageItemStyle} from '../AppStyle';
import {View, Text} from 'react-native';

export default class DeviceDetails extends Component {
  render() {
    return (
      <View style={pageStyle.container}>
        <View style={pageItemStyle.container}>
          <Text>Device Details</Text>
        </View>
      </View>
    );
  }
}
