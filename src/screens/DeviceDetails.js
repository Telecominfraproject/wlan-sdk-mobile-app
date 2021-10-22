import React, {Component} from 'react';
import {page, pageItem} from '../AppStyle';
import {View, Text} from 'react-native';

export default class DeviceDetails extends Component {
  render() {
    return (
      <View style={page.container}>
        <View style={pageItem.container}>
          <Text>Device Details</Text>
        </View>
      </View>
    );
  }
}
