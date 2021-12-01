import React, { useRef, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, TextInput, View } from 'react-native';
import { pageItemStyle, pageStyle, primaryColor } from '../AppStyle';
import { strings } from '../localization/LocalizationStrings';
import ButtonStyled from '../components/ButtonStyled';
import { accessPointsApi, handleApiError, subscriberInformationApi } from '../api/apiHandler';
import { completeSignIn, logStringifyPretty } from '../Utils';

export default function DeviceRegistration(props) {
  const { session } = props.route.params;
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [serial, setSerial] = useState('');
  const serialRef = useRef();

  const onSubmitPress = async () => {
    try {
      setLoading(true);

      // Get subscriber's info
      let response = await subscriberInformationApi.getSubscriberInfo();
      if (!response || !response.data) {
        console.log(response);
        console.error('Invalid response from subscriberInformationApi.getSubscriberInfo');
        throw new Error(strings.errors.invalidResponse);
      }
      logStringifyPretty(response.data, response.request.responseURL);
      let subscriberInfo = response.data;

      // Register a new access point
      let data = { macAddress: serial, name: name, id: '', address: subscriberInfo.serviceAddress };
      response = await accessPointsApi.addSubscriberAccessPoint(data);
      if (!response || !response.data) {
        console.log(response);
        console.error('Invalid response from accessPointsApi.addSubscriberAccessPoint');
        throw new Error(strings.errors.invalidResponse);
      }
      logStringifyPretty(response.data, response.request.responseURL);

      // Process the rest of the sign in process
      await completeSignIn(props.navigation, session);
    } catch (error) {
      handleApiError(strings.errors.titleDeviceRegistration, error);
    } finally {
      setLoading(false);

      // TODO: remove when API is available
      await completeSignIn(props.navigation, session);
    }
  };

  const onChangeText = text => {
    // alphanumeric only
    let formatted = text.toLowerCase().replace(/[^a-z0-9]/gi, '');
    setSerial(formatted);
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
            <TextInput
              style={pageItemStyle.inputText}
              placeholder={strings.placeholders.deviceName}
              onChangeText={text => setName(text)}
              autoCapitalize="none"
              textContentType="none"
              returnKeyType="next"
              onSubmitEditing={() => serialRef.current.focus()}
            />
          </View>
          <View style={pageItemStyle.container}>
            <TextInput
              ref={serialRef}
              style={pageItemStyle.inputText}
              placeholder={strings.placeholders.macAddress}
              value={serial}
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
