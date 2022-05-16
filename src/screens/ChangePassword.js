import React, { useEffect, useRef, useState } from 'react';
import { strings } from '../localization/LocalizationStrings';
import { pageStyle, pageItemStyle, primaryColor, placeholderColor } from '../AppStyle';
import { SafeAreaView, ScrollView, View, TextInput, ActivityIndicator, Text, Image } from 'react-native';
import { authenticationApi, handleApiError } from '../api/apiHandler';
import { useSelector } from 'react-redux';
import { selectBrandInfo } from '../store/BrandInfoSlice';
import { logStringifyPretty, sanitizePasswordInput, showGeneralMessage } from '../Utils';
import ButtonStyled from '../components/ButtonStyled';

export default function ResetPassword(props) {
  // Route Params
  const userId = props.route.params.userId;
  const forced = props.route.params.forced ?? false;
  // Regs
  const isMounted = useRef(false);
  const newPasswordRef = useRef();
  const confirmPasswordRef = useRef();
  // State
  const brandInfo = useSelector(selectBrandInfo);
  const [currentPassword, setCurrentPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [pattern, setPattern] = useState();
  const [loading, setLoading] = useState(false);

  // Keep track of whether the screen is mounted or not so async tasks know to access state or not.
  useEffect(() => {
    isMounted.current = true;

    // Get the password pattern
    getPasswordPattern();

    return () => {
      isMounted.current = false;
    };
    // Disable the eslint warning, as we want to change only on navigation changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPasswordPattern = async () => {
    try {
      // This is done in the background, so no need for a loading flag. This is just to help with
      // an improved user experience, if this does not load then the expectation is the backend
      // will return an error if the new password does not fit with the expected guidelines
      const response = await authenticationApi.getAccessToken({}, undefined, undefined, true);

      if (!response || !response.data) {
        throw new Error(strings.errors.invalidResponse);
      }

      logStringifyPretty(response.data);

      if (isMounted.current) {
        setPattern(response.data.passwordPattern);
      }
    } catch (error) {
      if (isMounted.current) {
        // Error does not matter when not mounted - it is likely not important at all.
        handleApiError(strings.errors.titleChangePassword, error, props.navigation);
      }
    }
  };

  const onSubmit = async () => {
    try {
      setLoading(true);

      // Only use the pattern on the new passwords
      let sanitizedCurrentPassword = sanitizePasswordInput(currentPassword, null, true);
      let sanitizedNewPassword = sanitizePasswordInput(newPassword, pattern, true);
      let sanitizedConfirmPassword = sanitizePasswordInput(confirmPassword, pattern, true);

      if (sanitizedNewPassword !== sanitizedConfirmPassword) {
        throw new Error(strings.errors.mismatchPassword);
      } else if (sanitizedCurrentPassword === sanitizedNewPassword) {
        throw new Error(strings.errors.reuseCurrentPassword);
      }

      const response = await authenticationApi.getAccessToken(
        {
          userId: userId,
          password: sanitizedCurrentPassword,
          newPassword: sanitizedNewPassword,
        },
        sanitizedNewPassword,
      );

      if (!response || !response.data) {
        throw new Error(strings.errors.invalidResponse);
      }

      logStringifyPretty(response.data, 'getAccessToken (Password)');

      if (isMounted.current) {
        // Show the succcess message
        showGeneralMessage(strings.messages.titleSuccess, strings.messages.passwordChanged);
        setLoading(false);

        // Done - so navigate back
        props.navigation.goBack();
      }
    } catch (error) {
      if (isMounted.current) {
        handleApiError(strings.errors.titleChangePassword, error, props.navigation);
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={pageStyle.safeAreaView}>
      <ScrollView contentContainerStyle={pageStyle.scrollView}>
        <View style={pageStyle.containerPreLogin}>
          {forced ? (
            <>
              <View style={pageItemStyle.container}>
                <Image style={pageItemStyle.headerImage} source={{ uri: brandInfo.large_org_logo }} />
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
                  placeholderTextColor={placeholderColor}
                  secureTextEntry={true}
                  value={currentPassword}
                  onChangeText={text => setCurrentPassword(text)}
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect={false}
                  textContentType="password"
                  returnKeyType="next"
                  onSubmitEditing={() => newPasswordRef.current.focus()}
                  maxLength={255}
                />
              </View>
              <View style={pageItemStyle.container}>
                <TextInput
                  style={pageItemStyle.inputText}
                  ref={newPasswordRef}
                  placeholder={strings.placeholders.newPassword}
                  placeholderTextColor={placeholderColor}
                  secureTextEntry={true}
                  value={newPassword}
                  onChangeText={text => setNewPassword(text)}
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect={false}
                  textContentType="newPassword"
                  returnKeyType="next"
                  onSubmitEditing={() => confirmPasswordRef.current.focus()}
                  maxLength={255}
                />
              </View>
              <View style={pageItemStyle.container}>
                <TextInput
                  style={pageItemStyle.inputText}
                  ref={confirmPasswordRef}
                  placeholder={strings.placeholders.confirmPassword}
                  placeholderTextColor={placeholderColor}
                  secureTextEntry={true}
                  value={confirmPassword}
                  onChangeText={text => setConfirmPassword(text)}
                  autoCapitalize="none"
                  textContentType="none"
                  returnKeyType="go"
                  onSubmitEditing={onSubmit}
                  maxLength={255}
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
