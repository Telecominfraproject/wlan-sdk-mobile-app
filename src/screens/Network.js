import React from 'react';
import { strings } from '../localization/LocalizationStrings';
import { pageStyle, pageItemStyle, primaryColor } from '../AppStyle';
import { View, Text } from 'react-native';

const Network = props => {
  return (
    <View style={pageStyle.container}>
      <View style={pageItemStyle.containerButton}>
        <Text>Network</Text>
      </View>
    </View>
  );
};

export default Network;
