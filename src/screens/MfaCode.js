import React, { useState } from 'react';
import { strings } from '../localization/LocalizationStrings';
import { pageItemStyle, pageStyle, primaryColor } from '../AppStyle';
import { SafeAreaView, ScrollView, ActivityIndicator, Text, TextInput, View } from 'react-native';
import { authenticationApi, handleApiError } from '../api/apiHandler';
import { logStringifyPretty, showGeneralMessage, completeSignIn } from '../Utils';
import ButtonStyled from '../components/ButtonStyled';

export default function MfaCode(props) {
  const userId = props.route.params.userId;
  const mfaInfo = props.route.params.mfaInfo;
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState();

  const getDescription = () => {
    if (mfaInfo) {
      switch (mfaInfo.method) {
        case 'email':
          return strings.mfaCode.descriptionEmail;
        case 'sms':
          return strings.mfaCode.descriptionSms;
      }
    }

    return strings.mfaCode.descriptionDefault;
  };

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
        throw new Error(strings.errors.invalidResponse);
      }

      logStringifyPretty(response.data, response.request.responseURL);

      await completeSignIn(props.navigation, userId, null, response.data, setLoading);
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
        throw new Error(strings.errors.invalidResponse);
      }

      logStringifyPretty(response.data, response.request.responseURL);

      if (response.data.Code === 0) {
        let message = strings.mfaCode.validationCodeResendDefault;

        if (mfaInfo) {
          switch (mfaInfo.method) {
            case 'email':
              message = strings.mfaCode.validationCodeResendEmail;
              break;

            case 'sms':
              message = strings.mfaCode.validationCodeResendSms;
              break;
          }
        }

        showGeneralMessage(message);
      } else {
        throw new Error(strings.errors.invalidResponse);
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
        <View style={pageStyle.containerPreLogin}>
          <View style={pageItemStyle.container}>
            <Text style={pageItemStyle.description}>{getDescription()}</Text>
          </View>
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
