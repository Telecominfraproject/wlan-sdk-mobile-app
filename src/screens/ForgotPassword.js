import React, { useState, useRef, useEffect } from 'react';
import { strings } from '../localization/LocalizationStrings';
import { pageStyle, pageItemStyle, primaryColor, placeholderColor } from '../AppStyle';
import { StyleSheet, SafeAreaView, ScrollView, View, TextInput, ActivityIndicator, Image, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { selectBrandInfo } from '../store/BrandInfoSlice';
import { authenticationApi, handleApiError } from '../api/apiHandler';
import { showGeneralMessage } from '../Utils';
import ButtonStyled from '../components/ButtonStyled';

const ForgotPassword = props => {
  // Refs
  const isMounted = useRef(false);
  // State
  const brandInfo = useSelector(selectBrandInfo);
  const [email, setEmail] = useState();
  const [loading, setLoading] = useState(false);

  // Keep track of whether the screen is mounted or not so async tasks know to access state or not.
  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  const validateEmail = emailToCheck => {
    const re = /\S+@\S+\.\S+/;
    return re.test(emailToCheck);
  };

  const onSubmit = async () => {
    try {
      if (!email) {
        throw new Error(strings.formatString(strings.errors.emptyField, strings.placeholders.email));
      }

      if (!validateEmail(email)) {
        throw new Error(strings.errors.invalidEmail);
      }

      setLoading(true);

      await authenticationApi.getAccessToken(
        {
          userId: email,
        },
        undefined,
        true,
      );

      showGeneralMessage(strings.messages.titleSuccess, strings.messages.resetEmailSent);
    } catch (error) {
      handleApiError(strings.errors.titleForgotPassword, error);
    } finally {
      if (isMounted.current) {
        // Make sure to always clear the loading flag
        setLoading(false);
      }
    }
  };

  const onPrivacyPolicyPress = () => {
    props.navigation.navigate('PrivacyPolicy');
  };

  const onTermsConditionsPress = () => {
    props.navigation.navigate('TermsConditions');
  };

  const forgotPasswordStyle = StyleSheet.create({
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
            <Text style={pageItemStyle.title}>{strings.forgotPassword.title}</Text>
          </View>
          {loading ? (
            <View style={pageItemStyle.loadingContainer}>
              <ActivityIndicator size="large" color={primaryColor} animating={loading} />
            </View>
          ) : (
            <>
              <View style={pageItemStyle.container}>
                <Text style={pageItemStyle.description}>{strings.forgotPassword.description}</Text>
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
                  onSubmitEditing={() => onSubmit()}
                  maxLength={255}
                />
              </View>
              <View style={pageItemStyle.containerButton}>
                <ButtonStyled title={strings.buttons.resetPassword} type="filled" onPress={onSubmit} />
              </View>
            </>
          )}
          <View style={forgotPasswordStyle.fillView} />
          <View style={pageItemStyle.containerButtons}>
            <ButtonStyled title={strings.buttons.privacyPolicy} type="text" onPress={onPrivacyPolicyPress} />
            <ButtonStyled title={strings.buttons.termsConditions} type="text" onPress={onTermsConditionsPress} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgotPassword;
