import React, { useState } from 'react';
import { strings } from '../localization/LocalizationStrings';
import { ActivityIndicator, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';
import { pageItemStyle, pageStyle, primaryColor } from '../AppStyle';
import { useSelector } from 'react-redux';
import {
  selectAccessPoint,
  selectAccessPoints,
  selectSubscriberInformation,
  selectSubscriberInformationLoading,
} from '../store/SubscriberInformationSlice';
import { handleApiError } from '../api/apiHandler';
import { logStringifyPretty, modifyAccessPoint, modifySubscriberInformation } from '../Utils';
import ButtonStyled from '../components/ButtonStyled';

export default function DeviceRegistration({ navigation, route }) {
  const [macAddress, setMacAddress] = useState();
  const subscriberInformation = useSelector(selectSubscriberInformation);
  const subscriberInformationLoading = useSelector(selectSubscriberInformationLoading);
  const accessPoint = useSelector(selectAccessPoint);
  const accessPoints = useSelector(selectAccessPoints);

  const onChangeText = text => {
    // alphanumeric only
    let formatted = text.toLowerCase().replace(/[^a-z0-9]/gi, '');
    setMacAddress(formatted);
  };

  const onSubmitPress = async () => {
    try {
      if (hasAccessPoint()) {
        await addAccessPoint();
        navigation.goBack();
      } else {
        await modifyAccessPoint(null, { macAddress: macAddress });
      }
    } catch (error) {
      handleApiError(strings.errors.titleAccessPointRegistration, error);
    }
  };

  const hasAccessPoint = () => {
    return accessPoint && accessPoint.macAddress !== '000000000000';
  };

  const addAccessPoint = async () => {
    if (!macAddress) {
      return;
    }
    // TODO add new access point
    let newAccessPoint = { ...accessPoint, macAddress };
    let updatedSubscriberInformation = JSON.parse(JSON.stringify(subscriberInformation));
    updatedSubscriberInformation.accessPoints.list.push(newAccessPoint);
    logStringifyPretty(updatedSubscriberInformation);
    await modifySubscriberInformation(updatedSubscriberInformation);
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
            <Text style={pageItemStyle.description}>
              {hasAccessPoint() ? strings.deviceRegistration.description : strings.deviceRegistration.descriptionAdd}
            </Text>
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
