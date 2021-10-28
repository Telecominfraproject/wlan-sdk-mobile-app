import React, { useEffect, useRef, useState } from "react";
import {pageStyle, pageItemStyle} from '../AppStyle';
import { View, Text, TextInput, Button, Alert, ActivityIndicator } from "react-native";
import {strings} from '../localization/LocalizationStrings';
import { authenticationApi, handleApiError } from "../api/apiHandler";


export default function ResetPassword(props) {
  const {userId, password} = props.route.params;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const confirmRef = useRef();

  useEffect(() => {
    console.log(userId, password);
  }, []);

  const onCancel = () => {
    props.navigation.replace('SignIn');
  };

  const onSubmit = async () => {
    if(checkPassword()) {
      setLoading(true);
      try {
        const response = await authenticationApi.getAccessToken(
          {
            userId: userId,
            password: password
          },
          newPassword
        );
        console.log(JSON.stringify(response.data, null, '\t'))
        if(response.status === 200) {
          Alert.alert(strings.messages.message, strings.messages.requestSent);
        }
      } catch (error) {
        handleApiError(strings.errors.resetPasswordTitle, error);
      }
      setLoading(false);
    }
  };

  const checkPassword = () => {
    if(newPassword === password) {
      Alert.alert(strings.errors.resetPasswordTitle, strings.errors.samePassword);
      return false;
    }
    if(newPassword !== confirmPassword) {
      Alert.alert(strings.errors.resetPasswordTitle, strings.errors.mismatchPassword);
      return false;
    }
    return newPassword !== password && newPassword === confirmPassword;
  };



  return (
    <View style={pageStyle.container}>
      <View style={pageItemStyle.container}>
        <Text>Reset Password</Text>
      </View>
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
        <Button title={strings.buttons.submit}
                onPress={onSubmit}
                disabled={loading || !newPassword || !confirmPassword} />
      </View>
      <View style={pageItemStyle.containerButton}>
        <Button title={strings.buttons.cancel}
                onPress={onCancel}
                disabled={loading} />
      </View>
    </View>
  );
}
