import React, { useState } from 'react';
import { ScrollView, View, SafeAreaView, TextInput, ActivityIndicator } from 'react-native';
import { handleApiError } from '../api/apiHandler';
import { logStringifyPretty, showGeneralError, showGeneralMessage } from '../Utils';
import { strings } from '../localization/LocalizationStrings';
import { pageItemStyle, pageStyle, primaryColor } from '../AppStyle';
import ButtonStyled from '../components/ButtonStyled';

export default function PhoneVerification(props) {
  const { phone, profile } = props.route.params;
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState();

  const validatePhone = async () => {
    try {
      setLoading(true);
      // TODO: Need updated API
      //const response = await emailApi.sendATestSMS(undefined, true, code, { to: phone });
      //logStringifyPretty(response.data);
      //showGeneralMessage(response.data.Details);
      setLoading(false);
      updateUser();
    } catch (err) {
      showGeneralError(strings.errors.validationError, strings.errors.invalidCode);
      setLoading(false);
    }
  };

  const updateUser = async () => {
    const mfa = profile.userTypeProprietaryInfo.mfa;
    // let mobiles = profile.userTypeProprietaryInfo.mobiles;
    let mobile = {
      number: phone,
      verified: true,
      primary: true,
    };
    let userInfo = {
      id: profile.Id,
      userTypeProprietaryInfo: { mfa, mobiles: [mobile] },
    };

    try {
      setLoading(true);

      // TODO: Need updated API
      //const response = await userManagementApi.updateUser(profile.Id, undefined, userInfo);
      //logStringifyPretty(response.data);

      setLoading(false);
      props.navigation.navigate('Profile');
    } catch (err) {
      handleApiError('updateUser', err);
      setLoading(false);
    }
  };

  const resendCode = async () => {
    try {
      setLoading(true);

      // TODO: Need updated API
      //const response = await emailApi.sendATestSMS(true, undefined, undefined, { to: phone });
      //logStringifyPretty(response.data);
      //showGeneralMessage(response.data.Details);
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
        <View style={pageStyle.container}>
          <TextInput
            style={pageItemStyle.inputText}
            placeholder={strings.placeholders.code}
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
