import React, { useState, useEffect, createRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearSession, setSession } from '../store/SessionSlice';
import { selectBrandInfo } from '../store/BrandInfoSlice';
import { strings } from '../localization/LocalizationStrings';
import { pageStyle, pageItemStyle, primaryColor } from '../AppStyle';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Image, TextInput, ActivityIndicator } from 'react-native';
import ButtonStyled from '../components/ButtonStyled';
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
      props.navigation.reset({
        index: 0,
        routes: [{ name: 'BrandSelector' }],
      });
    }

    async function checkCredentials() {
      let foundCredentials = await hasCredentials();
      if (foundCredentials) {
        signIn();
      }
    }
    checkCredentials();
    // No dependencies as this is only to run once on mount. There are plenty of
    // hacks around this eslint warning, but disabling it makes the most sense.
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

        if (response.data.method && response.data.created) {
          // MFA
          props.navigation.navigate('MFACode', { uuid: response.data.uuid, credentials });
        } else if (response.data.userMustChangePassword) {
          // Must reset password
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
      // Need to wait for this to complete before navigating
      await setApiSystemInfo(response.data);

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

  const onChangeBrandPress = async () => {
    props.navigation.reset({
      index: 0,
      routes: [{ name: 'BrandSelector' }],
    });
  };

  const onPrivacyPolicyPress = async () => {
    props.navigation.navigate('PrivacyPolicy');
  };

  const onTermsConditionsPress = async () => {
    props.navigation.navigate('TermsConditions');
  };

  const signInStyle = StyleSheet.create({
    containerForm: {
      flexDirection: 'column',
      flexWrap: 'nowrap',
      flex: 0,
      width: '100%',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    headerImage: {
      marginTop: 20,
      // Layout
      height: 75,
      width: '100%',
      resizeMode: 'contain',
    },
    fillView: {
      flex: 3,
    },
  });

  return (
    <SafeAreaView style={pageStyle.safeAreaView}>
      <ScrollView contentContainerStyle={pageStyle.scrollView}>
        <View style={pageStyle.container}>
          <View style={pageItemStyle.container}>
            <Image style={signInStyle.headerImage} source={{ uri: brandInfo.iconUri }} />
          </View>
          <View style={pageItemStyle.container}>
            <Text style={pageItemStyle.title}>{strings.signIn.title}</Text>
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
                <ButtonStyled title={strings.buttons.forgotPassword} type="text" onPress={onForgotPasswordPress} />
              </View>
              <View style={pageItemStyle.containerButton}>
                <ButtonStyled title={strings.buttons.signIn} type="filled" onPress={onSignInPress} />
              </View>
            </View>
          )}
          <View style={signInStyle.fillView} />
          <View style={pageItemStyle.containerButton}>
            <ButtonStyled title={strings.buttons.changeBrand} type="text" onPress={onChangeBrandPress} />
          </View>
          <View style={pageItemStyle.containerButtons}>
            <ButtonStyled title={strings.buttons.privacyPolicy} type="text" onPress={onPrivacyPolicyPress} />
            <ButtonStyled title={strings.buttons.termsConditions} type="text" onPress={onTermsConditionsPress} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
