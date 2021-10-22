import React, {Component} from 'react';
import {page, pageItem} from '../AppStyle';
import {View, Text} from 'react-native';

export default class ForgotPassword extends Component {
  render() {
    return (
      <View style={page.container}>
        <View style={pageItem.container}>
          <Text>Forgot Password</Text>
        </View>
      </View>
    );
  }
}
