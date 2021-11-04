import React from 'react';
import { strings } from '../localization/LocalizationStrings';
import { pageStyle, pageItemStyle } from '../AppStyle';
import { SafeAreaView, ScrollView, View, Text } from 'react-native';

const PrivacyPolicy = props => {
  return (
    <SafeAreaView style={pageStyle.safeAreaView}>
      <ScrollView contentContainerStyle={pageStyle.scrollView}>
        <View style={pageStyle.container}>
          <View style={pageItemStyle.container}>
            <Text style={pageItemStyle.title}>{strings.privacyPolicy.title}</Text>
          </View>
          <View style={pageItemStyle.container}>
            <Text style={pageItemStyle.description}>{strings.privacyPolicy.content}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicy;
