import React, {Component} from 'react';
import {pageStyle, pageItemStyle} from '../AppStyle';
import {View, Text} from 'react-native';

export default class ForgotPassword extends Component {
  render() {
    return (
      <View style={pageStyle.container}>
        <View style={pageItemStyle.container}>
          <Text>Forgot Password</Text>
        </View>
      </View>
    );
  }
}
