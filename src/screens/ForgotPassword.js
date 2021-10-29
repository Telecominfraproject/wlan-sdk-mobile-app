import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { clearSession } from '../store/SessionSlice';
import { pageStyle, pageItemStyle, primaryColor } from '../AppStyle';
import { View, Text, TextInput, Button, ActivityIndicator, Alert } from 'react-native';
import { strings } from '../localization/LocalizationStrings';
import { authenticationApi, handleApiError } from '../api/apiHandler';

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
        // console.log(JSON.stringify(response.data, null, '\t'));
        Alert.alert(strings.messages.message, strings.messages.resetEmail);
      } catch (error) {
        handleApiError(strings.errors.titleForgotPassword, error);
      } finally {
        setLoading(false);
      }
    }
  };

  const backToSignin = () => {
    props.navigation.replace('SignIn');
  };

  return (
    <View style={pageStyle.container}>
      <View style={pageItemStyle.container}>
        <Text>Forgot Password</Text>
      </View>
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
      <View style={pageItemStyle.containerButton}>
        <Button title={strings.buttons.signIn} color={primaryColor} onPress={backToSignin} disabled={loading} />
      </View>
    </View>
  );
};

export default ForgotPassword;
