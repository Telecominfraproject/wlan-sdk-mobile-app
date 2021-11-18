import React from 'react';
import { marginTopDefault, paddingHorizontalDefault, borderRadiusDefault, whiteColor } from '../AppStyle';
import { StyleSheet, TouchableOpacity, View, Text, Image } from 'react-native';

const ItemBrand = props => {
  const getCompanyIconUri = () => {
    return props.brand.iconUri;
  };

  const getCompanyName = () => {
    return props.brand.name;
  };

  const componentStyles = StyleSheet.create({
    container: {
      marginTop: marginTopDefault,
      // Layout
      flexDirection: 'column',
      flexWrap: 'nowrap',
      flex: 0,
      alignItems: 'center',
      width: '100%',
      // Visual
      padding: paddingHorizontalDefault,
      borderRadius: borderRadiusDefault,
      backgroundColor: whiteColor,
    },
    icon: {
      marginTop: marginTopDefault,
      height: 75,
      width: '100%',
      resizeMode: 'contain',
    },
    text: {
      marginTop: marginTopDefault,
      fontSize: 14,
    },
  });

  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={componentStyles.container}>
        <Image style={componentStyles.icon} source={{ uri: getCompanyIconUri() }} />
        <Text style={componentStyles.text}>{getCompanyName()}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ItemBrand;