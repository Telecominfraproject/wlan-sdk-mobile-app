import React, {Component} from 'react';
import {strings} from '../localization/LocalizationStrings';
import {useStore} from '../Store';
import {pageStyle, pageItemStyle} from '../AppStyle';
import {StyleSheet, View, Image, Button, TextInput, ActivityIndicator} from 'react-native';
import {handleApiError, authenticationApi, setApiSystemInfo} from '../api/apiHandler';

export default class SignIn extends Component {
  state = {
    email: '',
    password: '',
    loading: false,
  };

  constructor(props) {
    super(props);
    this.passwordRef = React.createRef();
  }

  render() {
    return (
      <View style={pageStyle.container}>
        <View style={pageItemStyle.container}>
          <Image style={signInStyle.headerImage} source={require('../assets/OpenWiFi_LogoLockup_Black.png')} />
        </View>
        <View style={pageItemStyle.container}>
          <ActivityIndicator size="large" animating={this.state.loading} />
        </View>
        {!this.state.loading && (
          <View style={signInStyle.containerForm}>
            <View style={pageItemStyle.container}>
              <TextInput
                style={pageItemStyle.inputText}
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
            </View>
            <View style={pageItemStyle.container}>
              <TextInput
                style={pageItemStyle.inputText}
                ref={this.passwordRef}
                placeholder={strings.placeholders.password}
                secureTextEntry={true}
                autoCapitalize="none"
                textContentType="password"
                returnKeyType="go"
                onChangeText={text => this.setState({password: text})}
                onSubmitEditing={() => this.onSignInPress()}
              />
            </View>
            <View style={pageItemStyle.containerButton}>
              <Button title={strings.buttons.signIn} onPress={this.onSignInPress} />
            </View>
            <View style={pageItemStyle.containerButton}>
              <Button title={strings.buttons.forgotPassword} onPress={this.onForgotPasswordPress} />
            </View>
            {/*<View style={pageItemStyle.containerButton}>
              <Button title={"Reset"}
                      onPress={() => this.props.navigation.navigate("ResetPassword", {userId: this.state.email, password: this.state.password})} />
            </View>*/}
          </View>
        )}
      </View>
    );
  }

  onSignInPress = async () => {
    try {
      this.setState({loading: true});

      // Make sure to clear any session information, this ensures error messaging is handled properly as well
      useStore.getState().clearSession();

      const response = await authenticationApi.getAccessToken({
        userId: this.state.email,
        password: this.state.password,
      });
      useStore.getState().setSession(response.data);

      // must reset password
      console.log(JSON.stringify(response.data, null, "\t"));
      if (response.data.userMustChangePassword) {
        this.props.navigation.navigate('ResetPassword', {
          userId: this.state.email,
          password: this.state.password,
        });
      }
      else {
        // Update the system endpoints and navigate to the main view.
        this.getSystemEndpointsNavigateToMain();
      }
    } catch (error) {
      // Clear the current password
      this.passwordRef.current.clear();

      // Clear the loading state
      this.setState({loading: false});

      handleApiError(strings.errors.signInTitle, error);
    }
  };

  getSystemEndpointsNavigateToMain = async () => {
    try {
      // The system info is necessary before moving on to the next view as it'll provide
      // the endpoints needed for communicating with the other systems
      const response = await authenticationApi.getSystemInfo();

      console.log(response.data);

      // Set the system info - this will validate as well, so an error might be thrown.
      setApiSystemInfo(response.data);

      // Replace to the main screen. Use replace to ensure no back button
      this.props.navigation.replace('Main');
    } catch (error) {
      // Make sure the loading state is done in all cases
      this.setState({loading: false});

      handleApiError(strings.errors.systemSetupTitle, error);
    }
  };

  onForgotPasswordPress = async () => {
    this.props.navigation.navigate('ForgotPassword');
  };
}

const signInStyle = StyleSheet.create({
  containerForm: {
    flexDirection: 'column',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    alignItems: 'center',
    flex: 0,
  },
  headerImage: {
    height: 150,
    marginBottom: 10,
  },
});
