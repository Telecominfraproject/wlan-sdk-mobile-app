import React, { createRef, useState, useRef, useEffect } from 'react';
import { strings } from '../localization/LocalizationStrings';
import {
  pageStyle,
  pageItemStyle,
  primaryColor,
  marginTopDefault,
  paddingHorizontalDefault,
  blackColor,
  placeholderColor,
} from '../AppStyle';
import { StyleSheet, SafeAreaView, ScrollView, View, TextInput, ActivityIndicator, Image, Text } from 'react-native';
import { subscriberRegistrationApi, handleApiError } from '../api/apiHandler';
import { useSelector } from 'react-redux';
import { selectBrandInfo } from '../store/BrandInfoSlice';
import { getDeviceUuid, logStringifyPretty, showGeneralMessage } from '../Utils';
import ButtonStyled from '../components/ButtonStyled';

export default function SignUp(props) {
  const brandInfo = useSelector(selectBrandInfo);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState();
  const [macAddress, setMacAddress] = useState();
  const [signUpStatus, setSignUpStatus] = useState();
  const macAddressRef = createRef();
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  // The following was taken from a blog post about using setInterval with React-Native and react hooks
  // https://overreacted.io/making-setinterval-declarative-with-react-hooks/
  useInterval(() => onCheck(), 2500);

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

  const onCheck = async () => {
    try {
      if (signUpStatus) {
        const deviceUuid = await getDeviceUuid();
        const response = await subscriberRegistrationApi.getSignup(
          getEmailSanitized(),
          getMacAddressSanitized(),
          signUpStatus.id,
          false,
          deviceUuid,
        );
        logStringifyPretty(response, 'Sign Up Check');

        if (!response || !response.data) {
          throw new Error(strings.errors.invalidResponse);
        }

        if (response.data.error !== 0) {
          throw new Error(response.data.description);
        }

        if (isMounted.current) {
          if (response.data.statusCode === 3) {
            showGeneralMessage(strings.signUp.statusSignUpComplete);
            deleteSignUp();
          } else {
            setSignUpStatus(response.data);
          }
        }
      }
    } catch (error) {
      if (isMounted.current) {
        handleApiError(strings.errors.titleSignUp, error);
        deleteSignUp();
      }
    }
  };

  const deleteSignUp = async () => {
    try {
      const deviceUuid = await getDeviceUuid();
      // Delete the current sign-up process upon success or failure. This may be removed in the future.
      await subscriberRegistrationApi.deleteSignup(
        getEmailSanitized(),
        getMacAddressSanitized(),
        signUpStatus.id,
        deviceUuid,
      );

      if (isMounted.current) {
        // Navigate back to Sign-In
        props.navigation.navigate('SignIn');
      }
    } catch (error) {
      if (isMounted.current) {
        handleApiError(strings.errors.titleSignUp, error);
      }
    } finally {
      setSignUpStatus(null);
      setLoading(false);
    }
  };

  const onSubmit = async () => {
    try {
      let macAddressSanitized = getMacAddressSanitized();

      if (!macAddressSanitized || macAddressSanitized.length !== 12) {
        throw new Error(strings.errors.invalidMac);
      }

      setLoading(true);
      const deviceUuid = await getDeviceUuid();
      const response = await subscriberRegistrationApi.postSignup(
        getEmailSanitized(),
        getMacAddressSanitized(),
        deviceUuid,
      );
      logStringifyPretty(response, 'Sign Up');

      if (!response || !response.data) {
        throw new Error(strings.errors.invalidResponse);
      }

      if (response.data.error !== 0) {
        throw new Error(response.data.description);
      }

      if (isMounted.current) {
        setSignUpStatus(response.data);
      }
    } catch (error) {
      if (isMounted.current) {
        handleApiError(strings.errors.titleSignUp, error);
        setLoading(false);
      }
    }
  };

  const getEmailSanitized = () => {
    let emailSanitized = email;

    if (emailSanitized) {
      emailSanitized = emailSanitized.trim();
    }

    return emailSanitized;
  };

  const getMacAddressSanitized = () => {
    let macAddressSanitized = macAddress;

    if (macAddressSanitized) {
      macAddressSanitized = macAddressSanitized.trim();
      macAddressSanitized = macAddressSanitized.toLowerCase();
      macAddressSanitized = macAddressSanitized.replace(/[^0-9a-f]/g, '');
    }

    return macAddressSanitized;
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
          // Unexpected - just show the status message
          return signUpStatus.status;
      }
    }

    return null;
  };

  const onPrivacyPolicyPress = async () => {
    props.navigation.navigate('PrivacyPolicy');
  };

  const onTermsConditionsPress = async () => {
    props.navigation.navigate('TermsConditions');
  };

  const componentStyles = StyleSheet.create({
    fillView: {
      flex: 3,
    },
    statusText: {
      fontSize: 20,
      color: blackColor,
      textAlign: 'center',
      marginTop: marginTopDefault,
      paddingLeft: paddingHorizontalDefault,
      paddingRight: paddingHorizontalDefault,
    },
  });

  return (
    <SafeAreaView style={pageStyle.safeAreaView}>
      {loading && (
        <View style={pageItemStyle.loadingContainer}>
          <ActivityIndicator size="large" color={primaryColor} animating={loading} />
          <Text style={componentStyles.statusText}>{getStatusDescription()}</Text>
        </View>
      )}
      <ScrollView contentContainerStyle={pageStyle.scrollView}>
        <View style={pageStyle.containerPreLogin}>
          <View style={pageItemStyle.container}>
            <Image style={pageItemStyle.headerImage} source={{ uri: brandInfo.large_org_logo }} />
          </View>
          <View style={pageItemStyle.container}>
            <Text style={pageItemStyle.title}>{strings.signUp.title}</Text>
          </View>
          {loading ? (
            <View style={pageItemStyle.loadingContainer}>
              <ActivityIndicator size="large" color={primaryColor} animating={loading} />
            </View>
          ) : (
            <>
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
                  returnKeyType="go"
                  onChangeText={text => setMacAddress(text)}
                  onSubmitEditing={() => onSubmit()}
                  maxLength={17}
                />
              </View>
              <View style={pageItemStyle.containerButton}>
                <ButtonStyled title={strings.buttons.signUp} type="filled" onPress={onSubmit} />
              </View>
            </>
          )}
          <View style={componentStyles.fillView} />
          <View style={pageItemStyle.containerButtons}>
            <ButtonStyled title={strings.buttons.privacyPolicy} type="text" onPress={onPrivacyPolicyPress} />
            <ButtonStyled title={strings.buttons.termsConditions} type="text" onPress={onTermsConditionsPress} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
