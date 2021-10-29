import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Image } from 'react-native';

const BrandItem = props => {
  const getCompanyIconUri = () => {
    return props.brand.iconUri;
  };

  const getCompanyName = () => {
    return props.brand.name;
  };

  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={brandItemStyle.container}>
        <Image style={brandItemStyle.icon} source={{ uri: getCompanyIconUri() }} />
        <Text style={brandItemStyle.text}>{getCompanyName()}</Text>
      </View>
    </TouchableOpacity>
  );
};

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

export default BrandItem;
