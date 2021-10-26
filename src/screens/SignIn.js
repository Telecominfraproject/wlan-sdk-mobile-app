import React, {Component} from 'react';
import {strings} from '../localization/LocalizationStrings';
import {useStore} from '../Store';
import {page, pageItem} from '../AppStyle';
import {View, Image, Button, TextInput} from 'react-native';
import {handleApiError, authenticationApi, setApiSystemInfo} from '../api/apiHandler';

export default class SignIn extends Component {
  state = {
    email: '',
    password: '',
  };

  constructor(props) {
    super(props);
    this.passwordRef = React.createRef();
  }

  render() {
    return (
      <View style={page.container}>
        <View style={pageItem.container}>
          <Image
            style={{
              height: 100,
            }}
            source={require('../assets/OpenWiFi_LogoLockup_Black.png')}
          />
        </View>
        <View style={pageItem.container}>
          <TextInput
            placeholder={strings.placeholders.username}
            autoComplete="email"
            autoCapitalize="none"
            autoFocus={true}
            keyboardType="email-address"
            textContentType="username"
            returnKeyType="next"
            onChangeText={text => this.setState({email: text})}
            onSubmitEditing={() => this.passwordRef.current.focus()}
          />
          <TextInput
            ref={this.passwordRef}
            placeholder={strings.placeholders.password}
            secureTextEntry={true}
            autoCapitalize="none"
            textContentType="password"
            returnKeyType="go"
            onChangeText={text => this.setState({password: text})}
            onSubmitEditing={() => this.onSignInPress()}
          />
          <Button title={strings.buttons.signIn} onPress={this.onSignInPress} />
          <Button title={strings.buttons.forgotPassword} onPress={this.onForgotPasswordPress} />
        </View>
      </View>
    );
  }

  onSignInPress = async () => {
    try {
      // Make sure to clear any session information, this ensures error messaging is handled properly as well      
      useStore.getState().clearSession();

      const response = await authenticationApi.getAccessToken({
        userId: this.state.email,
        password: this.state.password,
      });
      useStore.getState().setSession(response.data);

      // Update the system endpoints and navigate to the main view.
      this.getSystemEndpointsNavigateToMain();
    } catch (error) {
      // Clear the current password
      this.passwordRef.current.clear();

      handleApiError(strings.errors.signInTitle, error);
    }
  };

  getSystemEndpointsNavigateToMain = async () => {
    try {
      // The system info is necessary before moving on to the next view as it'll provide
      // the endpoints needed for communicating with the other systems
      const response = await authenticationApi.getSystemInfo();

      // Set the system info - this will validate as well, so an error might be thrown.
      setApiSystemInfo(response.data);

      // Replace to the main screen. Use replace to ensure no back button
      this.props.navigation.replace('Main');
    } catch (error) {
      handleApiError(strings.errors.systemSetupTitle, error);
    }
  };

  onForgotPasswordPress = async () => {
    this.props.navigation.navigate('ForgotPassword');
  };
}
