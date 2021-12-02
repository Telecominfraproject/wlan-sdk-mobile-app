import React, { useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';
import { pageItemStyle, pageStyle, primaryColor } from '../AppStyle';
import { strings } from '../localization/LocalizationStrings';
import ButtonStyled from '../components/ButtonStyled';
import { handleApiError } from '../api/apiHandler';
import { getSubscriberInformation } from '../Utils';

export default function DeviceRegistration(props) {
  const [loading, setLoading] = useState(false);
  const [macAddress, setMacAddress] = useState('');

  const onSubmitPress = async () => {
    try {
      setLoading(true);

      // Register a new access point
      // TODO: Need an API here

      // Process the rest of the sign in process
      await getSubscriberInformation(true);
    } catch (error) {
      handleApiError(strings.errors.titleDeviceRegistration, error);
    } finally {
      setLoading(false);
    }
  };

  const onChangeText = text => {
    // alphanumeric only
    let formatted = text.toLowerCase().replace(/[^a-z0-9]/gi, '');
    setMacAddress(formatted);
  };

  return (
    <SafeAreaView style={pageStyle.safeAreaView}>
      {loading && (
        <View style={pageItemStyle.loadingContainer}>
          <ActivityIndicator size="large" color={primaryColor} animating={loading} />
        </View>
      )}
      <ScrollView contentContainerStyle={pageStyle.scrollView}>
        <View style={pageStyle.container}>
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
            />
          </View>
          <View style={pageItemStyle.containerButton}>
            <ButtonStyled title={strings.buttons.register} type="filled" onPress={onSubmitPress} disabled={loading} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
