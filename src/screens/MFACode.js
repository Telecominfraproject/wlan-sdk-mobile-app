import React, { useState } from 'react';
import { ActivityIndicator, Button, Text, TextInput, View } from 'react-native';
import { pageItemStyle, pageStyle, primaryColor, primaryColorStyle } from '../AppStyle';
import { strings } from '../localization/LocalizationStrings';
import { authenticationApi, handleApiError } from '../api/apiHandler';
import { logStringifyPretty, showGeneralMessage } from '../Utils';

export default function MFACode(props) {
  const { uuid } = props.route.params;
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');

  const validateCode = async () => {
    setLoading(true);
    try {
      const response = await authenticationApi.getAccessToken(
        {
          uuid: uuid,
          answer: code,
        },
        undefined,
        undefined,
        undefined,
        undefined,
        true,
      );
      logStringifyPretty(response.data);
      if (response.status === 200) {
        showGeneralMessage(strings.messages.requestSent);
      }
    } catch (error) {
      handleApiError(strings.errors.titleMFA, error);
    }
    setLoading(false);
  };

  const resendValidationCode = async () => {
    setLoading(true);
    try {
      const response = await authenticationApi.getAccessToken(
        {
          uuid: uuid,
        },
        undefined,
        undefined,
        undefined,
        true,
      );
      logStringifyPretty(response.data);
      if (response.status === 200) {
        showGeneralMessage(strings.messages.requestSent);
      }
    } catch (error) {
      handleApiError(strings.errors.titleMFA, error);
    }
    setLoading(false);
  };

  return (
    <View style={pageStyle.container}>
      {loading && (
        <View style={pageItemStyle.loadingContainer}>
          <ActivityIndicator size="large" color={primaryColor} animating={loading} />
        </View>
      )}
      <View style={pageItemStyle.container}>
        <TextInput
          style={pageItemStyle.inputText}
          placeholder={strings.placeholders.code}
          secureTextEntry={true}
          onChangeText={text => setCode(text)}
          autoCapitalize="none"
          textContentType="oneTimeCode"
          returnKeyType="send"
          onSubmitEditing={validateCode}
        />
      </View>
      <View style={pageItemStyle.containerButton}>
        <Text style={[pageItemStyle.buttonText, primaryColorStyle]} onPress={resendValidationCode}>
          {strings.buttons.resendCode}
        </Text>
      </View>
      <View style={pageItemStyle.containerButton}>
        <Button title={strings.buttons.submit} color={primaryColor} onPress={validateCode} disabled={loading || !code} />
      </View>
    </View>
  );
}
