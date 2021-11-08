import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { strings } from '../localization/LocalizationStrings';
import { authenticationApi, handleApiError } from '../api/apiHandler';
import { showGeneralMessage, showGeneralError } from '../Utils';
import { selectBrandInfo } from '../store/BrandInfoSlice';
import { pageStyle, pageItemStyle, primaryColor } from '../AppStyle';
import { SafeAreaView, ScrollView, View, TextInput, ActivityIndicator, Image, Text } from 'react-native';
import ButtonStyled from '../components/ButtonStyled';

const ForgotPassword = () => {
  const brandInfo = useSelector(selectBrandInfo);
  const [email, setEmail] = useState();
  const [loading, setLoading] = useState(false);

  const validateEmail = () => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const onSubmit = async () => {
    if (!validateEmail()) {
      showGeneralError(strings.forgotPassword.title, strings.errors.invalidEmail);
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
        setLoading(false);
      }
    }
  };

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
                  autoFocus={true}
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgotPassword;
