import React, { useEffect, useRef, useState } from 'react';
import { strings } from '../localization/LocalizationStrings';
import { pageStyle, pageItemStyle } from '../AppStyle';
import { StyleSheet, View, TextInput, ActivityIndicator } from 'react-native';
import ButtonStyled from '../components/ButtonStyled';
import { authenticationApi, clearCredentials, handleApiError } from '../api/apiHandler';
import { logStringifyPretty, showGeneralError, showGeneralMessage } from '../Utils';
import BulletList from '../components/BulletList';

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
            password: password,
            newPassword: newPassword,
          },
          newPassword,
        );
        logStringifyPretty(response.data, 'getAccessToken');

        // Clear any current credentials - as the password has now changed
        clearCredentials();

        // Show the succcess message
        showGeneralMessage(strings.messages.passwordChanged);

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
    } else if (newPassword === password) {
      showGeneralError(strings.errors.titleResetPassword, strings.errors.samePassword);
      return false;
    }

    return true;
  };

  const validatePassword = passwordToCheck => {
    const reg = new RegExp(pattern, 'g');
    return reg.test(passwordToCheck);
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
        <ButtonStyled title={strings.buttons.submit} type="filled" onPress={onSubmit} disabled={loading} />
      </View>
      <BulletList containerStyle={componentStyles.requirementsContainer} />
    </View>
  );
}
