import React, { useEffect, useRef, useState } from 'react';
import { strings } from '../localization/LocalizationStrings';
import { pageStyle, pageItemStyle } from '../AppStyle';
import { StyleSheet, View, Text, TextInput, Alert, ActivityIndicator } from 'react-native';
import ButtonStyled from '../components/ButtonStyled';
import { authenticationApi, handleApiError } from '../api/apiHandler';
import { logStringifyPretty, showGeneralMessage } from '../Utils';

export default function ResetPassword(props) {
  const { userId, password } = props.route.params;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pattern, setPattern] = useState();
  const [loading, setLoading] = useState(false);
  const confirmRef = useRef();

  useEffect(() => {
    getPattern();
    // No dependencies as this is only to run once on mount. There are plenty of
    // hacks around this eslint warning, but disabling it makes the most sense.
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getPattern = async () => {
    try {
      const response = await authenticationApi.getAccessToken(
        {
          userId: userId,
          password: password,
        },
        undefined,
        undefined,
        true,
      );
      logStringifyPretty(response.data);
      setPattern(response.data.passwordPattern);
    } catch (error) {
      handleApiError('Profile Error', error);
    }
  };

  const onSubmit = async () => {
    if (checkPassword()) {
      setLoading(true);
      try {
        const response = await authenticationApi.getAccessToken(
          {
            userId: userId,
            password: password,
          },
          newPassword,
        );
        logStringifyPretty(response.data);
        setLoading(false);
        if (response.status === 200) {
          showGeneralMessage(strings.messages.requestSent);
          props.navigation.replace('SignIn');
        }
      } catch (error) {
        handleApiError(strings.errors.titleResetPassword, error);
        setLoading(false);
      }
    }
  };

  const checkPassword = () => {
    const valid = validatePassword(newPassword);

    if (newPassword === password) {
      Alert.alert(strings.errors.titleResetPassword, strings.errors.samePassword);
      return false;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert(strings.errors.titleResetPassword, strings.errors.mismatchPassword);
      return false;
    }
    if (!valid) {
      Alert.alert(strings.errors.titleResetPassword, strings.errors.badFormat);
      return false;
    }
    return valid && newPassword !== password && newPassword === confirmPassword;
  };

  const validatePassword = passwordToCheck => {
    // const reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    const reg = new RegExp(pattern, 'g');
    return reg.test(passwordToCheck);
  };

  const resetPasswordStyle = StyleSheet.create({
    requirementsContainer: {
      marginTop: 20,
    },
  });

  return (
    <View style={pageStyle.container}>
      {loading && (
        <View style={pageItemStyle.loadingContainer}>
          <ActivityIndicator size="large" animating={loading} />
        </View>
      )}
      <View style={pageItemStyle.container}>
        <TextInput
          style={pageItemStyle.inputText}
          placeholder={strings.placeholders.newPassword}
          secureTextEntry={true}
          onChangeText={text => setNewPassword(text)}
          autoCapitalize="none"
          textContentType="newPassword"
          returnKeyType="next"
          onSubmitEditing={() => confirmRef.current.focus()}
        />
      </View>
      <View style={pageItemStyle.container}>
        <TextInput
          style={pageItemStyle.inputText}
          ref={confirmRef}
          placeholder={strings.placeholders.confirmPassword}
          secureTextEntry={true}
          onChangeText={text => setConfirmPassword(text)}
          autoCapitalize="none"
          textContentType="none"
          returnKeyType="go"
          onSubmitEditing={onSubmit}
        />
      </View>
      <View style={pageItemStyle.containerButton}>
        <ButtonStyled
          title={strings.buttons.submit}
          type="filled"
          onPress={onSubmit}
          disabled={loading || !newPassword || !confirmPassword}
        />
      </View>
      <View style={pageItemStyle.container}>
        <View style={resetPasswordStyle.requirementsContainer}>
          <Text>{`\u2022 ${strings.passwordRequirements.req1}`}</Text>
          <Text>{`\u2022 ${strings.passwordRequirements.req2}`}</Text>
          <Text>{`\u2022 ${strings.passwordRequirements.req3}`}</Text>
          <Text>{`\u2022 ${strings.passwordRequirements.req4}`}</Text>
          <Text>{`\u2022 ${strings.passwordRequirements.req5}`}</Text>
        </View>
      </View>
    </View>
  );
}
