import React, { useState, useEffect, createRef, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectBrandInfo } from '../store/BrandInfoSlice';
import { strings } from '../localization/LocalizationStrings';
import { pageStyle, pageItemStyle, primaryColor, placeholderColor } from '../AppStyle';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Image, TextInput, ActivityIndicator } from 'react-native';
import { showGeneralError, completeSignIn, sanitizeEmailInput, sanitizePasswordInput } from '../Utils';
import { handleApiError, hasCredentials, setCredentials, getCredentials } from '../api/apiHandler';
import ButtonStyled from '../components/ButtonStyled';
import Divider from '../components/Divider';

export default function SignIn(props) {
  // Refs
  const isMounted = useRef(false);
  const passwordRef = createRef();
  // State
  const brandInfo = useSelector(selectBrandInfo);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    isMounted.current = true;

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

    // Check credentials
    checkCredentials();

    return () => {
      isMounted.current = false;
    };
    // No dependencies as this is only to run once on mount. There are plenty of
    // hacks around this eslint warning, but disabling it makes the most sense.
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onSignInPress = async () => {
    try {
      // Save the credentials, and start the sign-in process (which will use the credentials)
      await setCredentials(sanitizeEmailInput(email, true), sanitizePasswordInput(password, null, true));
      signIn();
    } catch (error) {
      showGeneralError(strings.errors.titleSignIn, error.message);
    }
  };

  const signIn = async () => {
    try {
      const credentials = await getCredentials();
      if (!credentials) {
        // Credentials are expected at this point, return an error if not found
        throw new Error(strings.errors.noCredentials);
      }

      // Handle the sign in process
      await completeSignIn(props.navigation, credentials.username, credentials.password, null, setLoadingWrapper);
    } catch (error) {
      if (isMounted.current) {
        // Handle the error.
        handleApiError(strings.errors.titleSignIn, error, props.navigation);
        setLoading(false);
      }
    }
  };

  const setLoadingWrapper = state => {
    if (isMounted.current) {
      setLoading(state);
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
    fillView: {
      flex: 3,
    },
  });

  return (
    <SafeAreaView style={pageStyle.safeAreaView}>
      <ScrollView contentContainerStyle={pageStyle.scrollView}>
        <View style={pageStyle.containerPreLogin}>
          <View style={pageItemStyle.container}>
            <Image style={pageItemStyle.headerImage} source={{ uri: brandInfo.large_org_logo }} />
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
                  placeholderTextColor={placeholderColor}
                  autoComplete="email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="username"
                  returnKeyType="next"
                  value={email}
                  onChangeText={text => setEmail(text)}
                  onSubmitEditing={() => passwordRef.current.focus()}
                  maxLength={255}
                />
              </View>
              <View style={pageItemStyle.container}>
                <TextInput
                  style={pageItemStyle.inputText}
                  ref={passwordRef}
                  placeholder={strings.placeholders.password}
                  placeholderTextColor={placeholderColor}
                  secureTextEntry={true}
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect={false}
                  textContentType="password"
                  returnKeyType="go"
                  onChangeText={text => setPassword(text)}
                  onSubmitEditing={() => onSignInPress()}
                  maxLength={255}
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
                <ButtonStyled title={strings.buttons.signUp} type="outline" onPress={onSignUp} />
              </View>
            </View>
          )}

          {/* Bottom Buttons */}
          <View style={componentStyles.fillView} />
          <View style={pageItemStyle.containerButtons}>
            <ButtonStyled title={strings.buttons.changeBrand} type="text" onPress={onChangeBrandPress} />
            <ButtonStyled title={strings.buttons.termsConditions} type="text" onPress={onTermsConditionsPress} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
