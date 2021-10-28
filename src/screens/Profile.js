import React, { Component } from 'react';
import { strings } from '../localization/LocalizationStrings';
import { useStore } from '../Store';
import { pageStyle, pageItemStyle, primaryColor } from '../AppStyle';
import { View, Button } from 'react-native';

export default class Profile extends Component {
  render() {
    return (
      <View style={pageStyle.container}>
        <View style={pageItemStyle.containerButton}>
          <Button title={strings.buttons.signOut} color={primaryColor()} onPress={this.onSignOutPress} />
        </View>
      </View>
    );
  }

  onSignOutPress = async () => {
    // Clear the session information and go back to the sign in pageStyle
    useStore.getState().clearSession();
    this.props.navigation.replace('BrandSelector');
  };
}
