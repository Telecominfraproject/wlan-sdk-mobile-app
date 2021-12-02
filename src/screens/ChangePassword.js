import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { strings } from '../localization/LocalizationStrings';
import { pageStyle, pageItemStyle, primaryColor } from '../AppStyle';
import { SafeAreaView, ScrollView, View, TextInput, ActivityIndicator, Text, Image } from 'react-native';
import { authenticationApi, clearCredentials, handleApiError } from '../api/apiHandler';
import { selectBrandInfo } from '../store/BrandInfoSlice';
import { logStringifyPretty, showGeneralError, showGeneralMessage } from '../Utils';
import ButtonStyled from '../components/ButtonStyled';

export default function ResetPassword(props) {
  const userId = props.route.params.userId;
  const forced = props.route.params.forced ?? false;
  const brandInfo = useSelector(selectBrandInfo);
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
      handleApiError(strings.errors.titleChangePassword, error);
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

        // Clear any loading flag
        setLoading(false);

        // Show the succcess message
        showGeneralMessage(strings.messages.passwordChanged);

        props.navigation.goBack();
      } catch (error) {
        setLoading(false);
        handleApiError(strings.errors.titleChangePassword, error);
      }
    }
  };

  const checkPassword = () => {
    if (newPassword !== confirmPassword) {
      showGeneralError(strings.errors.titleChangePassword, strings.errors.mismatchPassword);
      return false;
    } else if (!validatePassword(newPassword)) {
      showGeneralError(strings.errors.titleChangePassword, strings.errors.badFormat);
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

  return (
    <SafeAreaView style={pageStyle.safeAreaView}>
      <ScrollView contentContainerStyle={pageStyle.scrollView}>
        <View style={pageStyle.container}>
          {forced ? (
            <>
              <View style={pageItemStyle.container}>
                <Image style={pageItemStyle.headerImage} source={{ uri: brandInfo.iconUri }} />
              </View>
              <View style={pageItemStyle.container}>
                <Text style={pageItemStyle.title}>{strings.passwordChange.title}</Text>
              </View>
            </>
          ) : (
            <></>
          )}

          <View style={pageItemStyle.container}>
            <Text style={pageItemStyle.description}>
              {forced ? strings.passwordChange.descriptionForced : strings.passwordChange.description}
            </Text>
          </View>
          {loading ? (
            <View style={pageItemStyle.loadingContainer}>
              <ActivityIndicator size="large" color={primaryColor} animating={loading} />
            </View>
          ) : (
            <>
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
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
