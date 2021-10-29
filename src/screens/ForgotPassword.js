import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { clearSession } from '../store/SessionSlice';
import { pageStyle, pageItemStyle, primaryColor } from '../AppStyle';
import { View, TextInput, Button, ActivityIndicator, Alert } from 'react-native';
import { strings } from '../localization/LocalizationStrings';
import { authenticationApi, handleApiError } from '../api/apiHandler';
import { showGeneralMessage } from '../Utils';

const ForgotPassword = props => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState();
  const [loading, setLoading] = useState(false);

  const validateEmail = () => {
    const re = /\S+@\S+\.\S+/;
    const valid = re.test(email);
    if (!valid) {
      Alert.alert(strings.errors.titleForgotPassword, strings.errors.badEmail);
    }
    return valid;
  };

  const onSubmit = async () => {
    if (validateEmail()) {
      setLoading(true);

      try {
        // Clear the session information
        dispatch(clearSession());

        const response = await authenticationApi.getAccessToken(
          {
            userId: email,
          },
          undefined,
          true,
        );
        showGeneralMessage(strings.messages.resetEmail);
      } catch (error) {
        handleApiError(strings.errors.titleForgotPassword, error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={pageStyle.container}>
      <View style={pageItemStyle.container}>
        <ActivityIndicator size="large" animating={loading} />
      </View>
      <View style={pageItemStyle.container}>
        <TextInput
          style={pageItemStyle.inputText}
          placeholder={strings.placeholders.email}
          autoComplete="email"
          autoCapitalize="none"
          autoFocus={true}
          keyboardType="email-address"
          textContentType="emailAddress"
          returnKeyType="go"
          onChangeText={text => setEmail(text)}
          onSubmitEditing={() => {
            email && onSubmit;
          }}
        />
      </View>
      <View style={pageItemStyle.containerButton}>
        <Button
          title={strings.buttons.sendEmail}
          color={primaryColor}
          onPress={onSubmit}
          disabled={loading || !email}
        />
      </View>
    </View>
  );
};

export default ForgotPassword;
