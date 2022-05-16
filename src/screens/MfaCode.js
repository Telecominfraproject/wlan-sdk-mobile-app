import React, { useState, useRef, useEffect } from 'react';
import { strings } from '../localization/LocalizationStrings';
import { pageItemStyle, pageStyle, primaryColor, placeholderColor } from '../AppStyle';
import { SafeAreaView, ScrollView, ActivityIndicator, Text, TextInput, View } from 'react-native';
import { authenticationApi, handleApiError, SubMfaConfigTypeEnum } from '../api/apiHandler';
import { logStringifyPretty, showGeneralMessage, completeSignIn, sanitizeCode } from '../Utils';
import ButtonStyled from '../components/ButtonStyled';

export default function MfaCode(props) {
  // Refs
  const isMounted = useRef(false);
  // Route params
  const userId = props.route.params.userId;
  const mfaInfo = props.route.params.mfaInfo;
  // State
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState();

  // Keep track of whether the screen is mounted or not so async tasks know to access state or not.
  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  const getDescription = () => {
    if (mfaInfo) {
      switch (mfaInfo.method) {
        case SubMfaConfigTypeEnum.Email:
          return strings.mfaCode.descriptionEmail;

        case SubMfaConfigTypeEnum.Sms:
          return strings.mfaCode.descriptionSms;
      }
    }

    return strings.mfaCode.descriptionDefault;
  };

  const onSubmitPress = async () => {
    try {
      setLoading(true);

      // Send in the MFA Code to complete the sign in and get the session information
      const response = await authenticationApi.getAccessToken(
        {
          uuid: mfaInfo.uuid,
          answer: sanitizeCode(code, true),
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

      // The response is the session information, pass that into the completeSignIn
      await completeSignIn(props.navigation, userId, null, response.data, setLoadingWrapper);
    } catch (error) {
      if (isMounted.current) {
        setLoading(false);
        handleApiError(strings.errors.titleMfa, error, props.navigation);
      }
    }
  };

  const setLoadingWrapper = state => {
    if (isMounted.current) {
      setLoading(state);
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
            case SubMfaConfigTypeEnum.Email:
              message = strings.mfaCode.validationCodeResendEmail;
              break;

            case SubMfaConfigTypeEnum.Sms:
              message = strings.mfaCode.validationCodeResendSms;
              break;
          }
        }

        if (isMounted.current) {
          showGeneralMessage(strings.messages.titleSuccess, message);
          setLoading(false);
        }
      } else {
        throw new Error(strings.errors.invalidResponse);
      }
    } catch (error) {
      if (isMounted.current) {
        handleApiError(strings.errors.titleMfa, error, props.navigation);
        setLoading(false);
      }
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
              placeholderTextColor={placeholderColor}
              keyboardType="number-pad"
              value={code}
              onChangeText={text => setCode(text)}
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect={false}
              textContentType="oneTimeCode"
              returnKeyType="send"
              onSubmitEditing={onSubmitPress}
              maxLength={6}
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
