import React, { useState } from 'react';
import { strings } from '../localization/LocalizationStrings';
import { pageItemStyle, pageStyle, primaryColor } from '../AppStyle';
import { SafeAreaView, ScrollView, ActivityIndicator, TextInput, View } from 'react-native';
import { authenticationApi, handleApiError } from '../api/apiHandler';
import { logStringifyPretty, showGeneralMessage, showGeneralError, completeSignIn } from '../Utils';
import ButtonStyled from '../components/ButtonStyled';

export default function MfaCode(props) {
  const mfaInfo = props.route.params.mfaInfo;
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState();

  const onSubmitPress = async () => {
    try {
      setLoading(true);

      // Send in the MFA Code to get the session information
      const response = await authenticationApi.getAccessToken(
        {
          uuid: mfaInfo.uuid,
          answer: code,
        },
        undefined,
        undefined,
        undefined,
        undefined,
        true,
      );

      if (!response || !response.data) {
        console.log(response);
        console.error('Invalid response from getAccessToken (send MFA)');
        setLoading(false);
        showGeneralError(strings.errors.titleMfa, strings.errors.invalidResponse);
        return;
      }

      logStringifyPretty(response.data, response.request.responseURL);

      if (response.data.access_token) {
        // Process the rest of the sign in process
        await completeSignIn(props.navigation, response.data);
      } else {
        // Throw an error if we do not get what is expected
        throw new Error(strings.errors.invalidResponse);
      }
    } catch (error) {
      setLoading(false);

      handleApiError(strings.errors.titleMfa, error);
    }
  };

  const onResendCodePress = async () => {
    try {
      setLoading(true);

      // Resend the code to the user via the method they have configured
      const response = await authenticationApi.getAccessToken(
        {
          uuid: mfaInfo.uuid,
        },
        undefined,
        undefined,
        undefined,
        true,
      );

      if (!response || !response.data) {
        console.log(response);
        console.error('Invalid response from getAccessToken (resend code)');
        showGeneralError(strings.errors.titleMfa, strings.errors.invalidResponse);
        return;
      }

      logStringifyPretty(response.data, response.request.responseURL);

      if (response.data.Code === 0) {
        showGeneralMessage(strings.messages.requestSent);
      } else {
        showGeneralError(strings.errors.titleMfa, strings.errors.invalidResponse);
      }
    } catch (error) {
      handleApiError(strings.errors.titleMfa, error);
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
        <View style={pageStyle.container}>
          <View style={pageItemStyle.container}>
            <TextInput
              style={pageItemStyle.inputText}
              placeholder={strings.placeholders.code}
              onChangeText={text => setCode(text)}
              autoCapitalize="none"
              textContentType="oneTimeCode"
              returnKeyType="send"
              onSubmitEditing={onSubmitPress}
            />
          </View>
          <View style={pageItemStyle.containerButton}>
            <ButtonStyled title={strings.buttons.resendCode} type="text" onPress={onResendCodePress} />
          </View>
          <View style={pageItemStyle.containerButton}>
            <ButtonStyled title={strings.buttons.submit} type="filled" onPress={onSubmitPress} disabled={loading} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
