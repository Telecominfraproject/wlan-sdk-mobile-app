import React, { useState } from 'react';
import { strings } from '../localization/LocalizationStrings';
import { ActivityIndicator, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';
import { pageItemStyle, pageStyle, primaryColor, placeholderColor } from '../AppStyle';
import { useSelector } from 'react-redux';
import { selectSubscriberInformationLoading } from '../store/SubscriberInformationSlice';
import { handleApiError } from '../api/apiHandler';
import { addAccessPoint } from '../Utils';
import ButtonStyled from '../components/ButtonStyled';

export default function DeviceRegistration(props) {
  const [macAddress, setMacAddress] = useState();
  const subscriberInformationLoading = useSelector(selectSubscriberInformationLoading);

  const onChangeText = text => {
    // alphanumeric only
    let formatted = text.toLowerCase().replace(/[^a-z0-9]/gi, '');
    setMacAddress(formatted);
  };

  const onSubmitPress = async () => {
    try {
      // TODO: Needs to implement the new flow
      throw new Error('Not supported');
      //let response = await subscriberDeviceApi.deviceClaim(macAddress, 'Mobile App');

      //      if (response.data.errorCode !== 0) {
      //       throw new Error(response.data.errorText);
      //     }

      //await addAccessPoint({ macAddress: macAddress });
      //props.navigation.goBack();
    } catch (error) {
      handleApiError(strings.errors.titleAccessPointRegistration, error, props.navigation);
    }
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
            <Text style={pageItemStyle.description}>{strings.deviceRegistration.descriptionAdd}</Text>
          </View>

          <View style={pageItemStyle.container}>
            <TextInput
              style={pageItemStyle.inputText}
              placeholder={strings.placeholders.macAddress}
              placeholderTextColor={placeholderColor}
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
