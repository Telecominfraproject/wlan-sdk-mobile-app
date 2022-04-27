import React, { createRef, useState, useRef, useEffect } from 'react';
import { strings } from '../localization/LocalizationStrings';
import { pageStyle, pageItemStyle, placeholderColor } from '../AppStyle';
import { StyleSheet, SafeAreaView, ScrollView, View, TextInput, Image, Text } from 'react-native';
import { subscriberRegistrationApi, handleApiError } from '../api/apiHandler';
import { useSelector } from 'react-redux';
import { selectBrandInfo } from '../store/BrandInfoSlice';
import {
  getDeviceUuid,
  logStringifyPretty,
  sanitizeEmailInput,
  sanitizeMacAddressInput,
  showGeneralMessage,
} from '../Utils';
import ButtonStyled from '../components/ButtonStyled';
import ProgressModal from '../components/ProgressModal';

export default function SignUp(props) {
  // Refs
  const isMounted = useRef(false);
  const macAddressRef = createRef();
  // State
  const brandInfo = useSelector(selectBrandInfo);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState();
  const [macAddress, setMacAddress] = useState();
  const [signUpStatus, setSignUpStatus] = useState();

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  // The following was taken from a blog post about using setInterval with React-Native and react hooks
  // https://overreacted.io/making-setinterval-declarative-with-react-hooks/
  useInterval(() => onSignUpIntervalCheck(), 2500);

  function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }

      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  const onSignUpPress = async () => {
    try {
      setLoading(true);
      const deviceUuid = await getDeviceUuid();

      // Check to see if a process is already running
      let response = null;
      try {
        response = await subscriberRegistrationApi.getSignup(
          sanitizeEmailInput(email, true),
          sanitizeMacAddressInput(macAddress, true),
          null,
          false,
          deviceUuid,
        );
        logStringifyPretty(response, 'Sign Up Get Pre-Check');
      } catch (error) {
        logStringifyPretty(response, 'Sign Up Get Pre-Check');
        // If the GET was not successful, then try the POST
        response = await subscriberRegistrationApi.postSignup(
          sanitizeEmailInput(email, true),
          sanitizeMacAddressInput(macAddress, true),
          brandInfo.registration_id,
          deviceUuid,
        );
      }

      if (!response || !response.data) {
        throw new Error(strings.errors.invalidResponse);
      }

      logStringifyPretty(response.data, 'Sign Up');

      if (response.data.error !== 0) {
        throw new Error(response.data.description);
      }

      if (isMounted.current) {
        // Set the sign up status, which will have the periodic checks works
        setSignUpStatus(response.data);
      }
    } catch (error) {
      if (isMounted.current) {
        handleApiError(strings.errors.titleSignUp, error);
        setLoading(false);
      }
    }
  };

  const onSignUpCancelPress = async () => {
    try {
      if (signUpStatus) {
        const deviceUuid = await getDeviceUuid();
        await subscriberRegistrationApi.modifySignup(signUpStatus.id, 'cancel', deviceUuid);
      }

      // Delete the signup before completing
      await deleteSignUp();

      if (isMounted.current) {
        showGeneralMessage(strings.messages.titleCancelled, strings.signUp.statusCancelled);
      }
    } catch (error) {
      // Delete the signup on error
      await deleteSignUp();

      if (isMounted.current) {
        handleApiError(strings.errors.titleSignUp, error);
      }
    }
  };

  const onSignUpIntervalCheck = async () => {
    try {
      if (signUpStatus) {
        const deviceUuid = await getDeviceUuid();
        const response = await subscriberRegistrationApi.getSignup(
          sanitizeEmailInput(email, true),
          sanitizeMacAddressInput(macAddress, true),
          signUpStatus.id,
          false,
          deviceUuid,
        );

        if (!response || !response.data) {
          throw new Error(strings.errors.invalidResponse);
        }

        logStringifyPretty(response.data, 'Sign Up Check');

        if (response.data.error !== 0) {
          throw new Error(response.data.description);
        }

        if (isMounted.current) {
          setSignUpStatus(response.data);

          if (response.data.statusCode === 3) {
            // This is the completion state, clean up and navigate back to the Sign In

            // Delete the current sign-in process
            await deleteSignUp();

            if (isMounted.current) {
              // Navigate back to Sign-In
              showGeneralMessage(strings.messages.titleSuccess, strings.signUp.statusSignUpComplete);
              props.navigation.navigate('SignIn');
            }
          }
        }
      }
    } catch (error) {
      await deleteSignUp();

      if (isMounted.current) {
        handleApiError(strings.errors.titleSignUp, error);
      }
    }
  };

  const deleteSignUp = async () => {
    try {
      if (signUpStatus) {
        // Delete the current sign-up process upon success or failure. This may be removed in the future.
        const deviceUuid = await getDeviceUuid();
        await subscriberRegistrationApi.deleteSignup(
          sanitizeEmailInput(email, true),
          sanitizeMacAddressInput(macAddress, true),
          signUpStatus.id,
          deviceUuid,
        );
      }
    } catch (error) {
      if (isMounted.current) {
        handleApiError(strings.errors.titleSignUp, error);
      }
    } finally {
      if (isMounted.current) {
        // Upon successful or failed deletion clear all the inputs
        setSignUpStatus(null);
        setEmail(null);
        setMacAddress(null);
        setLoading(false);
      }
    }
  };

  const getStatusDescription = () => {
    if (signUpStatus) {
      switch (signUpStatus.statusCode) {
        case 1: // Waiting for Email Verification
          return strings.signUp.statusEmailVerificationNeed;

        case 2: // Email verified, looking for device
          return strings.signUp.statusEmailVerified;

        case 3: // Completed
          return null;

        default:
          // Unexpected just show the status message
          return signUpStatus.status;
      }
    }

    return null;
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
            <Text style={pageItemStyle.title}>{strings.signUp.title}</Text>
          </View>
          {loading ? (
            <ProgressModal message={getStatusDescription()} visible={loading} onCancelPress={onSignUpCancelPress} />
          ) : (
            <View style={componentStyles.containerForm}>
              <View style={pageItemStyle.container}>
                <Text style={pageItemStyle.description}>{strings.signUp.description}</Text>
              </View>
              <View style={pageItemStyle.container}>
                <TextInput
                  style={pageItemStyle.inputText}
                  placeholder={strings.placeholders.email}
                  placeholderTextColor={placeholderColor}
                  autoComplete="email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  returnKeyType="go"
                  value={email}
                  onChangeText={text => setEmail(text)}
                  onSubmitEditing={() => macAddressRef.current.focus()}
                  maxLength={255}
                />
              </View>
              <View style={pageItemStyle.container}>
                <TextInput
                  style={pageItemStyle.inputText}
                  ref={macAddressRef}
                  placeholder={strings.placeholders.macAddress}
                  placeholderTextColor={placeholderColor}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="go"
                  value={macAddress}
                  onChangeText={text => setMacAddress(text)}
                  onSubmitEditing={() => onSignUpPress()}
                  maxLength={17}
                />
              </View>
              <View style={pageItemStyle.containerButton}>
                <ButtonStyled title={strings.buttons.signUp} type="filled" onPress={() => onSignUpPress()} />
              </View>
            </View>
          )}

          {/* Bottom Buttons */}
          <View style={componentStyles.fillView} />
          <View style={pageItemStyle.containerButton}>
            <ButtonStyled title={strings.buttons.termsConditions} type="text" onPress={onTermsConditionsPress} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
