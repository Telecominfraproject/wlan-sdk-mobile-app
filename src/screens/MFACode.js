import React, { useState } from 'react';
import { pageItemStyle, pageStyle, primaryColor } from '../AppStyle';
import { SafeAreaView, ScrollView, ActivityIndicator, TextInput, View } from 'react-native';
import ButtonStyled from '../components/ButtonStyled';
import { strings } from '../localization/LocalizationStrings';
import { authenticationApi, handleApiError, setApiSystemInfo } from '../api/apiHandler';
import { logStringifyPretty, showGeneralMessage, signOut } from '../Utils';

export default function MFACode(props) {
  const { uuid, credentials } = props.route.params;
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');

  const validateCode = async () => {
    try {
      setLoading(true);
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
      setLoading(false);
      logStringifyPretty(response);

      if (response.data.userMustChangePassword) {
        // Must reset password
        props.navigation.navigate('ResetPassword', {
          userId: credentials.email,
          password: credentials.password,
        });
      } else if (response.status === 200) {
        // showGeneralMessage(strings.messages.requestSent);
        getSystemEndpointsNavigateToMain();
      }
    } catch (error) {
      setLoading(false);
      handleApiError(strings.errors.titleMFA, error);
    }
  };

  const getSystemEndpointsNavigateToMain = async () => {
    try {
      // The system info is necessary before moving on to the next view as it'll provide
      // the endpoints needed for communicating with the other systems
      const response = await authenticationApi.getSystemInfo();

      console.log(response.data);

      // Set the system info - this will validate as well, so an error might be thrown.
      // Need to wait for this to complete before navigating
      await setApiSystemInfo(response.data);

      // Replace to the main screen. Use replace to ensure no back button
      props.navigation.replace('Main');
    } catch (error) {
      // Make sure the loading state is done in all cases
      setLoading(false);

      handleApiError(strings.errors.titleSystemSetup, error);
    }
  };

  const resendValidationCode = async () => {
    try {
      setLoading(true);
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
      setLoading(false);
    } catch (error) {
      handleApiError(strings.errors.titleMFA, error);
      signOut(props.navigation);
    }
  };

  const onSignOutPress = async () => {
    signOut(props.navigation);
  };

  return (
    <SafeAreaView style={pageStyle.safeAreaView}>
      <ScrollView contentContainerStyle={pageStyle.scrollView}>
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
            <ButtonStyled title={strings.buttons.resendCode} type="text" onPress={resendValidationCode} />
          </View>
          <View style={pageItemStyle.containerButton}>
            <ButtonStyled
              title={strings.buttons.submit}
              type="filled"
              onPress={validateCode}
              disabled={loading || !code}
            />
          </View>
          <View style={pageItemStyle.containerButton}>
            <ButtonStyled title={strings.buttons.signOut} type="outline" onPress={onSignOutPress} disabled={loading} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
