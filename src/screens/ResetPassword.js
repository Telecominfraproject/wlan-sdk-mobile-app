import React, { useRef, useState } from 'react';
import { pageStyle, pageItemStyle, primaryColor } from '../AppStyle';
import { View, Text, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import { strings } from '../localization/LocalizationStrings';
import { authenticationApi, handleApiError } from '../api/apiHandler';
import { logStringifyPretty, showGeneralMessage } from '../Utils';

export default function ResetPassword(props) {
  const { userId, password } = props.route.params;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const confirmRef = useRef();

  const onSubmit = async () => {
    if (checkPassword()) {
      setLoading(true);
      try {
        const response = await authenticationApi.getAccessToken(
          {
            userId: userId,
            password: password,
          },
          newPassword,
        );
        logStringifyPretty(response.data);
        setLoading(false);
        if (response.status === 200) {
          showGeneralMessage(strings.messages.requestSent);
          props.navigation.replace('SignIn');
        }
      } catch (error) {
        handleApiError(strings.errors.titleResetPassword, error);
        setLoading(false);
      }
    }
  };

  const checkPassword = () => {
    const valid = validatePassword(newPassword);

    if (newPassword === password) {
      Alert.alert(strings.errors.titleResetPassword, strings.errors.samePassword);
      return false;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert(strings.errors.titleResetPassword, strings.errors.mismatchPassword);
      return false;
    }
    if (!valid) {
      Alert.alert(strings.errors.titleResetPassword, strings.errors.badFormat);
      return false;
    }
    return valid && newPassword !== password && newPassword === confirmPassword;
  };

  const validatePassword = password => {
    const reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    return reg.test(password);
  };

  return (
    <View style={pageStyle.container}>
      <View style={pageItemStyle.container}>
        <ActivityIndicator size="large" animating={loading} />
      </View>
      <View style={pageItemStyle.container}>
        <TextInput
          style={pageItemStyle.inputText}
          placeholder={strings.placeholders.newPassword}
          secureTextEntry={true}
          onChangeText={text => setNewPassword(text)}
          autoCapitalize="none"
          textContentType="newPassword"
          returnKeyType="next"
          onSubmitEditing={() => confirmRef.current.focus()}
        />
      </View>
      <View style={pageItemStyle.container}>
        <TextInput
          style={pageItemStyle.inputText}
          ref={confirmRef}
          placeholder={strings.placeholders.confirmPassword}
          secureTextEntry={true}
          onChangeText={text => setConfirmPassword(text)}
          autoCapitalize="none"
          textContentType="none"
          returnKeyType="go"
          onSubmitEditing={onSubmit}
        />
      </View>
      <View style={pageItemStyle.containerButton}>
        <Button
          title={strings.buttons.submit}
          color={primaryColor}
          onPress={onSubmit}
          disabled={loading || !newPassword || !confirmPassword}
        />
      </View>
      <View style={pageItemStyle.container}>
        <View>
          <Text>{`\u2022 ${strings.passwordRequirements.req1}`}</Text>
          <Text>{`\u2022 ${strings.passwordRequirements.req2}`}</Text>
          <Text>{`\u2022 ${strings.passwordRequirements.req3}`}</Text>
          <Text>{`\u2022 ${strings.passwordRequirements.req4}`}</Text>
          <Text>{`\u2022 ${strings.passwordRequirements.req5}`}</Text>
        </View>
      </View>
    </View>
  );
}
