import React, { Component } from 'react';
import { pageStyle, pageItemStyle, primaryColor } from '../AppStyle';
import { View, TextInput, Button, ActivityIndicator, Alert } from 'react-native';
import { strings } from '../localization/LocalizationStrings';
import { authenticationApi, handleApiError } from '../api/apiHandler';
import { useStore } from '../Store';
import { showGeneralMessage } from '../Utils';

export default class ForgotPassword extends Component {
  state = {
    email: '',
    loading: false,
  };

  render() {
    return (
      <View style={pageStyle.container}>
        <View style={pageItemStyle.container}>
          <ActivityIndicator size="large" animating={this.state.loading} />
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
            onChangeText={text => this.setState({ email: text })}
            onSubmitEditing={() => {
              this.state.email && this.onSubmit;
            }}
          />
        </View>
        <View style={pageItemStyle.containerButton}>
          <Button
            title={strings.buttons.sendEmail}
            color={primaryColor()}
            onPress={this.onSubmit}
            disabled={this.state.loading || !this.state.email}
          />
        </View>
      </View>
    );
  }

  validateEmail = () => {
    const re = /\S+@\S+\.\S+/;
    const valid = re.test(this.state.email);
    if (!valid) {
      Alert.alert(strings.errors.titleForgotPassword, strings.errors.badEmail);
    }
    return valid;
  };

  onSubmit = async () => {
    if (this.validateEmail()) {
      this.setState({ loading: true });
      try {
        useStore.getState().clearSession();

        const response = await authenticationApi.getAccessToken(
          {
            userId: this.state.email,
          },
          undefined,
          true,
        );
        showGeneralMessage(strings.messages.resetEmail);
      } catch (error) {
        handleApiError(strings.errors.titleForgotPassword, error);
      }
      this.setState({ loading: false });
    }
  };
}
