import React, { useState, useEffect, createRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectBrandInfo } from '../store/BrandInfoSlice';
import { clearSession } from '../store/SessionSlice';
import { clearSubscriber } from '../store/SubscriberInformationSlice';
import { strings } from '../localization/LocalizationStrings';
import { pageStyle, pageItemStyle, primaryColor } from '../AppStyle';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Image, TextInput, ActivityIndicator } from 'react-native';
import ButtonStyled from '../components/ButtonStyled';
import { logStringifyPretty, showGeneralError, completeSignIn } from '../Utils';
import {
  handleApiError,
  authenticationApi,
  hasCredentials,
  setCredentials,
  getCredentials,
  clearCredentials,
} from '../api/apiHandler';
import Divider from '../components/Divider';

const SignIn = props => {
  const dispatch = useDispatch();
  const brandInfo = useSelector(selectBrandInfo);
  const accessPoint = null; //useSelector(selectCurrentAccessPoint);
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
    if (!email || !password) {
      showGeneralError(strings.errors.titleSignIn, strings.errors.emptyFields);
    } else {
      // Save the credentials, and start the sign-in process (which will use the credentials)
      await setCredentials(email, password);
      signIn();
    }
  };

  const signIn = async () => {
    try {
      setLoading(true);

      // Make sure to clear any session/subscriber information (this will ensure proper API error message as well, see 403 errors)
      dispatch(clearSession());
      dispatch(clearSubscriber());

      const credentials = await getCredentials();
      if (!credentials) {
        // Credentials are expected at this point, return an error if not found
        clearCredentials();
        showGeneralError(strings.errors.titleSignIn, strings.errors.noCredentials);
        return;
      }

      const response = await authenticationApi.getAccessToken({
        userId: credentials.username,
        password: credentials.password,
      });

      if (!response || !response.data) {
        console.log(response);
        console.error('Invalid response from getAccessToken (sign-in)');
        setLoading(false);
        showGeneralError(strings.errors.titleSignIn, strings.errors.invalidResponse);
        return;
      }

      logStringifyPretty(response.data, response.request.responseURL);

      if (response.data.method) {
        // If the data returns a 'method' then we must handle Multi-Factor Authentication, in the response
        // there are three items: method, uuid, created, this will be passed to the MFA handler
        props.navigation.navigate('MfaCode', {
          mfaInfo: response.data,
        });

        // Clear the loading state in case we come back to this view
        setLoading(false);
      } else if (response.data.access_token) {
        // No registered device, go to registration
        if (!accessPoint) {
          props.navigation.navigate('DeviceRegistration', { session: response.data });
          return;
        }

        // Process the rest of the sign in process
        await completeSignIn(props.navigation, response.data);
      } else {
        console.log(response);
        // Throw an error if we do not get what is expected
        throw new Error(strings.errors.invalidResponse);
      }
    } catch (error) {
      // Clear the loading state
      setLoading(false);

      // Clear any saved credentials, make them re-enter them
      clearCredentials();

      handleApiError(strings.errors.titleSignIn, error);
    }
  };

  const onForgotPasswordPress = async () => {
    props.navigation.navigate('ForgotPassword');
  };

  const onSignUp = () => {
    props.navigation.navigate('SignUp');
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

  const componentStyles = StyleSheet.create({
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
            <Image style={componentStyles.headerImage} source={{ uri: brandInfo.iconUri }} />
          </View>
          <View style={pageItemStyle.container}>
            <Text style={pageItemStyle.title}>{strings.signIn.title}</Text>
          </View>
          {loading ? (
            <View style={[pageItemStyle.container, componentStyles.fillView]}>
              <ActivityIndicator size="large" color={primaryColor} animating={loading} />
            </View>
          ) : (
            <View style={componentStyles.containerForm}>
              <View style={pageItemStyle.container}>
                <Text style={pageItemStyle.description}>{strings.signIn.description}</Text>
              </View>
              <View style={pageItemStyle.container}>
                <TextInput
                  style={pageItemStyle.inputText}
                  placeholder={strings.placeholders.email}
                  autoComplete="email"
                  autoCapitalize="none"
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

              <Divider marginVertical={20} />

              {/* Sign Up */}
              <Text>{strings.signIn.noAccount}</Text>
              <View style={pageItemStyle.containerButton}>
                <ButtonStyled title={strings.buttons.signUp} type={'outline'} onPress={onSignUp} />
              </View>
            </View>
          )}

          {/* Bottom Buttons */}
          <View style={componentStyles.fillView} />
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
