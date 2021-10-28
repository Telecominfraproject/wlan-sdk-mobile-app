import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, View, Text, Image} from 'react-native';

export class BrandItem extends Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={brandItemStyle.container}>
          <Image style={brandItemStyle.icon} source={{uri: this.getCompanyIconUri()}} />
          <Text style={brandItemStyle.text}>{this.getCompanyName()}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  getCompanyIconUri() {
    return this.props.brand.iconUri;
  }

  getCompanyName() {
    return this.props.brand.name;
  }
}

const brandItemStyle = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flexWrap: 'nowrap',
    flex: 0,
    width: '100%',
    alignItems: 'center',
    marginBottom: 18,
  },
  icon: {
    height: 75,
    width: '100%',
    resizeMode: 'contain',
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
  },
});
