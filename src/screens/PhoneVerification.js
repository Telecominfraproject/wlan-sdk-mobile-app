import React, { useState } from 'react';
import { ScrollView, View, SafeAreaView, TextInput, ActivityIndicator } from 'react-native';
import { handleApiError, mfaApi } from '../api/apiHandler';
import { logStringifyPretty, modifySubscriberInformation, showGeneralError, showGeneralMessage } from '../Utils';
import { strings } from '../localization/LocalizationStrings';
import { pageItemStyle, pageStyle, primaryColor } from '../AppStyle';
import ButtonStyled from '../components/ButtonStyled';
import { useSelector } from 'react-redux';
import { selectSubscriberInformation } from '../store/SubscriberInformationSlice';

export default function PhoneVerification(props) {
  const { mfaConfig } = props.route.params;
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState();
  const subscriberInformation = useSelector(selectSubscriberInformation);

  const validatePhone = async () => {
    try {
      setLoading(true);
      // complete validation
      const response = await mfaApi.modifyMFS(undefined, true, code, mfaConfig);
      if (response && response.data) {
        logStringifyPretty(response.data, response.request.responseURL);
        updateSubscriber();
      } else {
        console.log(response);
        console.error('Invalid response from modifyMFS');
        showGeneralError(strings.errors.titleSms, strings.errors.invalidResponse);
      }
    } catch (err) {
      showGeneralError(strings.errors.validationError, strings.errors.invalidCode);
    } finally {
      setCode('');
      setLoading(false);
    }
  };

  const updateSubscriber = async () => {
    try {
      setLoading(true);
      let updatedSubsciberInformation = { ...subscriberInformation, phoneNumber: mfaConfig.sms };
      await modifySubscriberInformation(updatedSubsciberInformation);
      setLoading(false);

      props.navigation.navigate('Profile');
    } catch (err) {
      handleApiError(strings.errors.titleUpdate, err);
    }
  };

  const resendCode = async () => {
    try {
      setLoading(true);
      const response = await mfaApi.modifyMFS(true, undefined, undefined, mfaConfig);
      if (response && response.data) {
        logStringifyPretty(response.data, response.request.responseURL);
        showGeneralMessage(response.data.Details);
      } else {
        console.log(response);
        console.error('Invalid response from modifyMFS');
        showGeneralError(strings.errors.titleSms, strings.errors.invalidResponse);
      }
    } catch (err) {
      handleApiError('resendCode', err);
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
          <TextInput
            style={pageItemStyle.inputText}
            placeholder={strings.placeholders.code}
            value={code}
            onChangeText={text => setCode(text)}
            autoCapitalize="none"
            textContentType="oneTimeCode"
            returnKeyType="send"
            onSubmitEditing={validatePhone}
          />

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
