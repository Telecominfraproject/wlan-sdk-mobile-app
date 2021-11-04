import React from 'react';
import { strings } from '../localization/LocalizationStrings';
import { pageStyle, pageItemStyle } from '../AppStyle';
import { SafeAreaView, ScrollView, View, Text } from 'react-native';

const TermsConditions = props => {
  return (
    <SafeAreaView style={pageStyle.safeAreaView}>
      <ScrollView contentContainerStyle={pageStyle.scrollView}>
        <View style={pageStyle.container}>
          <View style={pageItemStyle.container}>
            <Text style={pageItemStyle.title}>{strings.termsConditions.title}</Text>
          </View>
          <View style={pageItemStyle.container}>
            <Text style={pageItemStyle.description}>{strings.termsConditions.content}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsConditions;
