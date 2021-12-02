import React, { useEffect, useRef, useState } from 'react';
import { strings } from '../localization/LocalizationStrings';
import { pageStyle, pageItemStyle } from '../AppStyle';
import { StyleSheet, View, TextInput, ActivityIndicator } from 'react-native';
import { authenticationApi, clearCredentials, handleApiError } from '../api/apiHandler';
import { logStringifyPretty, showGeneralError, showGeneralMessage } from '../Utils';
import BulletList from '../components/BulletList';
import ButtonStyled from '../components/ButtonStyled';

export default function ResetPassword(props) {
  const userId = props.route.params.userId;
  const [currentPassword, setCurrentPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [pattern, setPattern] = useState();
  const [loading, setLoading] = useState(false);
  const newPasswordRef = useRef();
  const confirmPasswordRef = useRef();

  useEffect(() => {
    getPasswordPattern();
  }, []);

  const getPasswordPattern = async () => {
    try {
      const response = await authenticationApi.getAccessToken({}, undefined, undefined, true);

      if (!response || !response.data) {
        throw new Error(strings.errors.invalidResponse);
      }

      logStringifyPretty(response.data);
      setPattern(response.data.passwordPattern);
    } catch (error) {
      handleApiError(strings.errors.titleResetPassword, error);
    }
  };

  const onSubmit = async () => {
    if (checkPassword()) {
      try {
        setLoading(true);

        const response = await authenticationApi.getAccessToken(
          {
            userId: userId,
            password: currentPassword,
            newPassword: newPassword,
          },
          newPassword,
        );

        if (!response || !response.data) {
          throw new Error(strings.errors.invalidResponse);
        }

        logStringifyPretty(response.data, 'getAccessToken (Password)');

        // Clear any current credentials - as the password has now changed
        clearCredentials();

        // Show the succcess message
        showGeneralMessage(strings.messages.passwordChanged);

        // Clear any loading flag
        setLoading(false);

        props.navigation.replace('SignIn');
      } catch (error) {
        setLoading(false);
        handleApiError(strings.errors.titleResetPassword, error);
      }
    }
  };

  const checkPassword = () => {
    const valid = validatePassword(newPassword);

    if (newPassword !== confirmPassword) {
      showGeneralError(strings.errors.titleResetPassword, strings.errors.mismatchPassword);
      return false;
    } else if (!valid) {
      showGeneralError(strings.errors.titleResetPassword, strings.errors.badFormat);
      return false;
    }

    return true;
  };

  const validatePassword = passwordToCheck => {
    if (pattern) {
      const reg = new RegExp(pattern, 'g');
      return reg.test(passwordToCheck);
    } else {
      return true;
    }
  };

  const componentStyles = StyleSheet.create({
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
          placeholder={strings.placeholders.currentPassword}
          secureTextEntry={true}
          onChangeText={text => setCurrentPassword(text)}
          autoCapitalize="none"
          textContentType="password"
          returnKeyType="next"
          onSubmitEditing={() => newPasswordRef.current.focus()}
        />
      </View>
      <View style={pageItemStyle.container}>
        <TextInput
          style={pageItemStyle.inputText}
          ref={newPasswordRef}
          placeholder={strings.placeholders.newPassword}
          secureTextEntry={true}
          onChangeText={text => setNewPassword(text)}
          autoCapitalize="none"
          textContentType="newPassword"
          returnKeyType="next"
          onSubmitEditing={() => confirmPasswordRef.current.focus()}
        />
      </View>
      <View style={pageItemStyle.container}>
        <TextInput
          style={pageItemStyle.inputText}
          ref={confirmPasswordRef}
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
        <ButtonStyled title={strings.buttons.submit} type="filled" onPress={onSubmit} disabled={loading} />
      </View>
      <BulletList containerStyle={componentStyles.requirementsContainer} />
    </View>
  );
}
