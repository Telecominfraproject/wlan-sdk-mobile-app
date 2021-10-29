import React from 'react';
import { pageStyle, pageItemStyle } from '../AppStyle';
import { View, Text } from 'react-native';

const DeviceDetails = props => {
  return (
    <View style={pageStyle.container}>
      <View style={pageItemStyle.container}>
        <Text>Device Details</Text>
      </View>
    </View>
  );
};

export default DeviceDetails;
