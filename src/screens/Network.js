import React from 'react';
import { strings } from '../localization/LocalizationStrings';
import { pageStyle, pageItemStyle } from '../AppStyle';
import { SafeAreaView, ScrollView, View, Text } from 'react-native';

const Network = props => {
  return (
    <SafeAreaView style={pageStyle.safeAreaView}>
      <ScrollView contentContainerStyle={pageStyle.scrollView}>
        <View style={pageStyle.container}>
          <View style={pageItemStyle.containerButton}>
            <Text>Network</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Network;