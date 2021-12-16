import React, { useState } from 'react';
import { strings } from '../localization/LocalizationStrings';
import { ActivityIndicator, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';
import { pageItemStyle, pageStyle, primaryColor } from '../AppStyle';
import { useSelector } from 'react-redux';
import { selectSubscriberInformationLoading } from '../store/SubscriberInformationSlice';
import { handleApiError } from '../api/apiHandler';
import { modifyAccessPoint } from '../Utils';
import ButtonStyled from '../components/ButtonStyled';

export default function DeviceRegistration(props) {
  const [macAddress, setMacAddress] = useState();
  const subscriberInformationLoading = useSelector(selectSubscriberInformationLoading);

  const onSubmitPress = async () => {
    try {
      await modifyAccessPoint(null, { macAddress: macAddress });
    } catch (error) {
      handleApiError(strings.errors.titleAccessPointRegistration, error);
    }
  };

  const onChangeText = text => {
    // alphanumeric only
    let formatted = text.toLowerCase().replace(/[^a-z0-9]/gi, '');
    setMacAddress(formatted);
  };

  return (
    <SafeAreaView style={pageStyle.safeAreaView}>
      {subscriberInformationLoading && (
        <View style={pageItemStyle.loadingContainer}>
          <ActivityIndicator size="large" color={primaryColor} animating={subscriberInformationLoading} />
        </View>
      )}
      <ScrollView contentContainerStyle={pageStyle.scrollView}>
        <View style={pageStyle.containerPostLogin}>
          <View style={pageItemStyle.container}>
            <Text style={pageItemStyle.description}>{strings.deviceRegistration.description}</Text>
          </View>

          <View style={pageItemStyle.container}>
            <TextInput
              style={pageItemStyle.inputText}
              placeholder={strings.placeholders.macAddress}
              value={macAddress}
              onChangeText={onChangeText}
              autoCapitalize="none"
              returnKeyType="send"
              onSubmitEditing={onSubmitPress}
              maxLength={255}
            />
          </View>
          <View style={pageItemStyle.containerButton}>
            <ButtonStyled
              title={strings.buttons.register}
              type="filled"
              onPress={onSubmitPress}
              disabled={subscriberInformationLoading}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
