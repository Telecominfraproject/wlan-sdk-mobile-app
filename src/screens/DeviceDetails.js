import React from 'react';
import { pageStyle, pageItemStyle } from '../AppStyle';
import { SafeAreaView, ScrollView, View, Text } from 'react-native';

const DeviceDetails = props => {
  return (
    <SafeAreaView style={pageStyle.safeAreaView}>
      <ScrollView contentContainerStyle={pageStyle.scrollView}>
        <View style={pageStyle.container}>
          <View style={pageItemStyle.container}>
            <Text>Device Details</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DeviceDetails;
