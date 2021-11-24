import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { strings } from '../localization/LocalizationStrings';
import { authenticationApi, handleApiError } from '../api/apiHandler';
import { showGeneralMessage, showGeneralError } from '../Utils';
import { selectBrandInfo } from '../store/BrandInfoSlice';
import { pageStyle, pageItemStyle, primaryColor } from '../AppStyle';
import { StyleSheet, SafeAreaView, ScrollView, View, TextInput, ActivityIndicator, Image, Text } from 'react-native';
import ButtonStyled from '../components/ButtonStyled';

const ForgotPassword = props => {
  const brandInfo = useSelector(selectBrandInfo);
  const [email, setEmail] = useState();
  const [loading, setLoading] = useState(false);

  const validateEmail = emailToCheck => {
    const re = /\S+@\S+\.\S+/;
    return re.test(emailToCheck);
  };

  const onSubmit = async () => {
    if (!email) {
      showGeneralError(
        strings.errors.titleForgotPassword,
        strings.formatString(strings.errors.emptyField, strings.placeholders.email),
      );
    } else if (!validateEmail(email)) {
      showGeneralError(strings.errors.titleForgotPassword, strings.errors.invalidEmail);
    } else {
      try {
        setLoading(true);

        await authenticationApi.getAccessToken(
          {
            userId: email,
          },
          undefined,
          true,
        );
        showGeneralMessage(strings.messages.resetEmailSent);
      } catch (error) {
        handleApiError(strings.errors.titleForgotPassword, error);
      } finally {
        // Make sure to always clear the loading flag
        setLoading(false);
      }
    }
  };

  const onPrivacyPolicyPress = async () => {
    props.navigation.navigate('PrivacyPolicy');
  };

  const onTermsConditionsPress = async () => {
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
        <View style={pageStyle.container}>
          <View style={pageItemStyle.container}>
            <Image style={pageItemStyle.headerImage} source={{ uri: brandInfo.iconUri }} />
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
                  autoComplete="email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  returnKeyType="go"
                  onChangeText={text => setEmail(text)}
                  onSubmitEditing={() => onSubmit()}
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
