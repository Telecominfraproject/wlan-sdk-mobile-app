import React from 'react';
import { strings } from '../localization/LocalizationStrings';
import { pageStyle, pageItemStyle, primaryColor } from '../AppStyle';
import { View, Text } from 'react-native';

const Dashboard = props => {
  return (
    <View style={pageStyle.container}>
      <View style={pageItemStyle.containerButton}>
        <Text>Dashboard</Text>
      </View>
    </View>
  );
};

export default Dashboard;
