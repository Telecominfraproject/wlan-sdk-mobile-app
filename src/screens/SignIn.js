import React, { useState, useEffect, createRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearSession, setSession } from '../store/SessionSlice';
import { selectBrandInfo } from '../store/BrandInfoSlice';
import { strings } from '../localization/LocalizationStrings';
import * as Keychain from 'react-native-keychain';
import { pageStyle, pageItemStyle, primaryColor, primaryColorStyle } from '../AppStyle';
import { StyleSheet, Text, View, Image, Button, TextInput, ActivityIndicator } from 'react-native';
import { logStringifyPretty, showGeneralError } from '../Utils';
import {
  handleApiError,
  authenticationApi,
  setApiSystemInfo,
  hasCredentials,
  setCredentials,
  getCredentials,
  clearCredentials,
} from '../api/apiHandler';

const SignIn = props => {
  const dispatch = useDispatch();
  const brandInfo = useSelector(selectBrandInfo);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const passwordRef = createRef();

  useEffect(() => {
    // If the brand is not selected, then resort back to the brand selector
    if (brandInfo === null) {
      props.navigation.replace('BrandSelector');
    }

    async function checkCredentials() {
      let foundCredentials = await hasCredentials();
      if (foundCredentials) {
        signIn();
      }
    }
    checkCredentials();
  });

  const onSignInPress = async () => {
    await setCredentials(email, password);
    signIn();
  };

  const signIn = async () => {
    try {
      setLoading(true);

      // Make sure to clear any session information, this ensures error messaging is handled properly as well
      dispatch(clearSession());

      const credentials = await getCredentials();
      if (!credentials) {
        clearCredentials();
        showGeneralError(strings.errors.titleSignIn, 'No credentials');
      } else {
        const response = await authenticationApi.getAccessToken({
          userId: credentials.username,
          password: credentials.password,
        });
        dispatch(setSession(response.data));

        logStringifyPretty(response.data);

        // must reset password
        if (response.data.userMustChangePassword) {
          props.navigation.navigate('ResetPassword', {
            userId: email,
            password: password,
          });
        } else {
          // Update the system endpoints and navigate to the main view.
          getSystemEndpointsNavigateToMain();
        }
      }
    } catch (error) {
      // Clear the loading state
      setLoading(false);

      clearCredentials();

      handleApiError(strings.errors.titleSignIn, error);
    }
  };

  const getSystemEndpointsNavigateToMain = async () => {
    try {
      // The system info is necessary before moving on to the next view as it'll provide
      // the endpoints needed for communicating with the other systems
      const response = await authenticationApi.getSystemInfo();

      console.log(response.data);

      // Set the system info - this will validate as well, so an error might be thrown.
      setApiSystemInfo(response.data);

      // Replace to the main screen. Use replace to ensure no back button
      props.navigation.replace('Main');
    } catch (error) {
      // Make sure the loading state is done in all cases
      setLoading(false);

      handleApiError(strings.errors.titleSystemSetup, error);
    }
  };

  const onForgotPasswordPress = async () => {
    props.navigation.navigate('ForgotPassword');
  };

  return (
    <View style={pageStyle.container}>
      <View style={pageItemStyle.container}>
        <Image style={signInStyle.headerImage} source={{ uri: brandInfo.iconUri }} />
      </View>
      {loading ? (
        <View style={pageItemStyle.container}>
          <ActivityIndicator size="large" color={primaryColor} animating={loading} />
        </View>
      ) : (
        <View style={signInStyle.containerForm}>
          <View style={pageItemStyle.container}>
            <Text style={pageItemStyle.description}>{strings.signIn.description}</Text>
          </View>
          <View style={pageItemStyle.container}>
            <TextInput
              style={pageItemStyle.inputText}
              placeholder={strings.placeholders.username}
              autoComplete="email"
              autoCapitalize="none"
              autoFocus={true}
              keyboardType="email-address"
              textContentType="username"
              returnKeyType="next"
              value={email}
              onChangeText={text => setEmail(text)}
              onSubmitEditing={() => passwordRef.current.focus()}
            />
          </View>
          <View style={pageItemStyle.container}>
            <TextInput
              style={pageItemStyle.inputText}
              ref={passwordRef}
              placeholder={strings.placeholders.password}
              secureTextEntry={true}
              autoCapitalize="none"
              textContentType="password"
              returnKeyType="go"
              onChangeText={text => setPassword(text)}
              onSubmitEditing={() => onSignInPress()}
            />
          </View>
          <View style={pageItemStyle.containerButton}>
            <Text style={[pageItemStyle.buttonText, primaryColorStyle]} onPress={onForgotPasswordPress}>
              {strings.buttons.forgotPassword}
            </Text>
          </View>
          <View style={pageItemStyle.containerButton}>
            <Button title={strings.buttons.signIn} color={primaryColor} onPress={onSignInPress} />
          </View>
        </View>
      )}
    </View>
  );
};

const signInStyle = StyleSheet.create({
  containerForm: {
    flexDirection: 'column',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    alignItems: 'center',
    flex: 0,
    width: '100%',
  },
  headerImage: {
    height: 75,
    width: '100%',
    resizeMode: 'contain',
    marginBottom: 10,
  },
});

export default SignIn;
