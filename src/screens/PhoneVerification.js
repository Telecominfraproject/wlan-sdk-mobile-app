import React, { useState } from 'react';
import { strings } from '../localization/LocalizationStrings';
import { ScrollView, View, SafeAreaView, TextInput, ActivityIndicator, Text } from 'react-native';
import { handleApiError, mfaApi } from '../api/apiHandler';
import { logStringifyPretty, showGeneralError, showGeneralMessage } from '../Utils';
import { pageItemStyle, pageStyle, primaryColor } from '../AppStyle';
import ButtonStyled from '../components/ButtonStyled';

export default function PhoneVerification(props) {
  const { mfaConfig } = props.route.params;
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState();

  const validatePhone = async () => {
    try {
      setLoading(true);

      // Complete validation
      console.log(mfaConfig);
      const response = await mfaApi.modifyMFS(undefined, true, code, mfaConfig);
      if (!response || !response.data) {
        throw new Error(strings.errors.invalidResponse);
      }

      logStringifyPretty(response.data, response.request.responseURL);
      props.navigation.goBack();
    } catch (err) {
      setCode();
      setLoading(false);
      showGeneralError(strings.errors.validationError, strings.errors.invalidCode);
    }
  };

  const resendCode = async () => {
    try {
      setLoading(true);

      // Send a new code
      const response = await mfaApi.modifyMFS(true, undefined, undefined, mfaConfig);
      if (!response || !response.data) {
        throw new Error(strings.errors.invalidResponse);
      }

      logStringifyPretty(response.data, response.request.responseURL);
      showGeneralMessage(response.data.Details);
    } catch (err) {
      handleApiError(strings.errors.titleResendCode, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={pageStyle.safeAreaView}>
      {loading && (
        <View style={pageItemStyle.loadingContainer}>
          <ActivityIndicator size="large" color={primaryColor} animating={loading} />
        </View>
      )}
      <ScrollView contentContainerStyle={pageStyle.scrollView}>
        <View style={pageStyle.containerPreLogin}>
          <View style={pageItemStyle.container}>
            <Text style={pageItemStyle.description}>{strings.phoneVerification.description}</Text>
          </View>
          <View style={pageItemStyle.container}>
            <TextInput
              style={pageItemStyle.inputText}
              placeholder={strings.placeholders.code}
              value={code}
              keyboardType="number-pad"
              onChangeText={text => setCode(text)}
              autoCapitalize="none"
              textContentType="oneTimeCode"
              returnKeyType="send"
              onSubmitEditing={validatePhone}
            />
          </View>

          <View style={pageItemStyle.containerButton}>
            <ButtonStyled title={strings.buttons.validate} type="filled" onPress={validatePhone} />
          </View>

          <View style={pageItemStyle.containerButton}>
            <ButtonStyled title={strings.buttons.resendCode} type="text" onPress={resendCode} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
