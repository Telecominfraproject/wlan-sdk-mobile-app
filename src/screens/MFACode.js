import React, { useState } from 'react';
import { pageItemStyle, pageStyle, primaryColor } from '../AppStyle';
import { SafeAreaView, ScrollView, ActivityIndicator, TextInput, View } from 'react-native';
import ButtonStyled from '../components/ButtonStyled';
import { strings } from '../localization/LocalizationStrings';
import { authenticationApi, handleApiError, setApiSystemInfo } from '../api/apiHandler';
import { logStringifyPretty, showGeneralMessage, signOut } from '../Utils';
import { store } from '../store/Store';
import { useDispatch } from 'react-redux';
import { setSession } from '../store/SessionSlice';

export default function MFACode(props) {
  const state = store.getState();
  const session = state.session.value;
  const uuid = session.uuid;
  const { credentials } = props.route.params;
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');
  const dispatch = useDispatch();

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
      logStringifyPretty(response.data, response.request.responseURL);

      dispatch(setSession(response.data));

      if (response.data.userMustChangePassword) {
        // Must reset password
        props.navigation.navigate('ResetPassword', {
          userId: credentials.username,
          password: credentials.password,
        });
      } else if (response.status === 200) {
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

      logStringifyPretty(response.data, response.request.responseURL);

      // Set the system info - this will validate as well, so an error might be thrown.
      // Need to wait for this to complete before navigating
      await setApiSystemInfo(response.data);

      setLoading(false);

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
      logStringifyPretty(response.data, response.request.responseURL);
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
              onSubmitEditing={validateCode}
            />
          </View>
          <View style={pageItemStyle.containerButton}>
            <ButtonStyled title={strings.buttons.resendCode} type="text" onPress={resendValidationCode} />
          </View>
          <View style={pageItemStyle.containerButton}>
            <ButtonStyled title={strings.buttons.submit} type="filled" onPress={validateCode} disabled={loading} />
          </View>
          <View style={pageItemStyle.containerButton}>
            <ButtonStyled title={strings.buttons.signOut} type="outline" onPress={onSignOutPress} disabled={loading} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
