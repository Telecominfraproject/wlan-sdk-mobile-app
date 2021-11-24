import React, { createRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { strings } from '../localization/LocalizationStrings';
import { accessProcessApi, handleApiError } from '../api/apiHandler';
import { logStringifyPretty } from '../Utils';
import { selectBrandInfo } from '../store/BrandInfoSlice';
import { pageStyle, pageItemStyle, primaryColor } from '../AppStyle';
import { StyleSheet, SafeAreaView, ScrollView, View, TextInput, ActivityIndicator, Image, Text } from 'react-native';
import ButtonStyled from '../components/ButtonStyled';

export default function SignUp(props) {
  const brandInfo = useSelector(selectBrandInfo);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const passwordRef = createRef();

  const onSubmit = async () => {
    try {
      setLoading(true);
      // TODO user id?
      const response = await accessProcessApi.userSignUp('signUp', email, undefined, { newPassword: password });
      logStringifyPretty(response);
    } catch (error) {
      handleApiError(strings.errors.titleSignUp, error);
    } finally {
      setLoading(false);
    }
  };

  const onPrivacyPolicyPress = async () => {
    props.navigation.navigate('PrivacyPolicy');
  };

  const onTermsConditionsPress = async () => {
    props.navigation.navigate('TermsConditions');
  };

  const signUpStyle = StyleSheet.create({
    fillView: {
      flex: 3,
    },
    requirementsContainer: {
      marginTop: 20,
    },
  });

  return (
    <SafeAreaView style={pageStyle.safeAreaView}>
      {loading && (
        <View style={pageItemStyle.loadingContainer}>
          <ActivityIndicator size="large" color={primaryColor} animating={loading} />
        </View>
      )}
      <ScrollView contentContainerStyle={pageStyle.scrollView}>
        <View style={pageStyle.container}>
          <View style={pageItemStyle.container}>
            <Image style={pageItemStyle.headerImage} source={{ uri: brandInfo.iconUri }} />
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
                  autoComplete="email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  returnKeyType="go"
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
                  onSubmitEditing={() => onSubmit()}
                />
              </View>
              <View style={pageItemStyle.containerButton}>
                <ButtonStyled title={strings.buttons.signUp} type="filled" onPress={onSubmit} />
              </View>
              <View style={pageItemStyle.container}>
                <View style={signUpStyle.requirementsContainer}>
                  <Text>{`\u2022 ${strings.passwordRequirements.req1}`}</Text>
                  <Text>{`\u2022 ${strings.passwordRequirements.req2}`}</Text>
                  <Text>{`\u2022 ${strings.passwordRequirements.req3}`}</Text>
                  <Text>{`\u2022 ${strings.passwordRequirements.req4}`}</Text>
                  <Text>{`\u2022 ${strings.passwordRequirements.req5}`}</Text>
                </View>
              </View>
            </>
          )}
          <View style={signUpStyle.fillView} />
          <View style={pageItemStyle.containerButtons}>
            <ButtonStyled title={strings.buttons.privacyPolicy} type="text" onPress={onPrivacyPolicyPress} />
            <ButtonStyled title={strings.buttons.termsConditions} type="text" onPress={onTermsConditionsPress} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
