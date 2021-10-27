import React, {Component} from 'react';
import {pageStyle, pageItemStyle} from '../AppStyle';
import {View, Text, TextInput, Button} from 'react-native';
import {strings} from '../localization/LocalizationStrings';
import {authenticationApi, handleApiError} from '../api/apiHandler';
import {useStore} from '../Store';

export default class ForgotPassword extends Component {
  state = {
    email: '',
    sent: false,
  };

  render() {
    return (
      <View style={pageStyle.container}>
        <View style={pageItemStyle.container}>
          <Text>Forgot Password</Text>
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
            onChangeText={text => this.setState({email: text})}
            onSubmitEditing={this.onSubmit}
          />
          <Text>{this.state.sent && strings.messages.resetEmail}</Text>
        </View>
        <View style={pageItemStyle.containerButton}>
          <Button title={strings.buttons.sendEmail} onPress={this.onSubmit} />
        </View>
        <View style={pageItemStyle.containerButton}>
          <Button title={strings.buttons.signIn} onPress={this.backToSignin} />
        </View>
      </View>
    );
  }

  onSubmit = async () => {
    try {
      useStore.getState().clearSession();

      const response = await authenticationApi.getAccessToken(
        {
          userId: this.state.email,
        },
        undefined,
        true,
      );
      console.log(JSON.stringify(response, null, '\t'));
      this.setState({sent: true});
    } catch (error) {
      handleApiError(strings.errors.forgotPasswordTitle, error);
    }
  };

  backToSignin = () => {
    this.props.navigation.replace('SignIn');
  };
}
