import React, {Component} from 'react';
import {strings} from '../localization/LocalizationStrings';
import {useStore} from '../Store';
import {page, pageItem} from '../AppStyle';
import {View, Button} from 'react-native';

export default class Settings extends Component {
  render() {
    return (
      <View style={page.container}>
        <View style={pageItem.container}>
          <Button title={strings.buttons.signOut} onPress={this.onSignOutPress} />
        </View>
      </View>
    );
  }

  onSignOutPress = async () => {
    // Clear the session information and go back to the sign in page
    useStore.getState().clearSession();
    this.props.navigation.replace('SignIn');
  };
}
