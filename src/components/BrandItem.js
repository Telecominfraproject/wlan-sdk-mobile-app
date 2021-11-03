import React from 'react';
import { whiteColor } from '../AppStyle';
import { StyleSheet, TouchableOpacity, View, Text, Image } from 'react-native';

const BrandItem = props => {
  const getCompanyIconUri = () => {
    return props.brand.iconUri;
  };

  const getCompanyName = () => {
    return props.brand.name;
  };

  const brandItemStyle = StyleSheet.create({
    container: {
      flexDirection: 'column',
      flexWrap: 'nowrap',
      flex: 0,
      alignItems: 'center',
      width: '100%',
      marginBottom: 18,
      padding: 10,
      backgroundColor: whiteColor,
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

  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={brandItemStyle.container}>
        <Image style={brandItemStyle.icon} source={{ uri: getCompanyIconUri() }} />
        <Text style={brandItemStyle.text}>{getCompanyName()}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default BrandItem;
