import React from 'react';
import { blackColor, paddingHorizontalDefault, heightCellDefault } from '../AppStyle';
import { StyleSheet, TouchableOpacity, View, Text, Image } from 'react-native';

const ItemTextWithIcon = props => {
  const componentStyles = StyleSheet.create({
    container: {
      height: heightCellDefault,
      // Layout
      flexDirection: 'row',
      flexWrap: 'nowrap',
      flex: 0,
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      // Visual
      paddingHorizontal: paddingHorizontalDefault,
    },
    textLabel: {
      flex: 3,
      marginRight: paddingHorizontalDefault,
      // Visual
      fontSize: 14,
    },
    icon: {
      width: 20,
      height: 20,
      marginRight: paddingHorizontalDefault,
      // Visual
      tintColor: props.iconTintColor ? props.iconTintColor : blackColor,
    },
    iconCaret: {
      width: 22,
      height: 22,
    },
  });

  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={componentStyles.container}>
        <Text style={componentStyles.textLabel} numberOfLines={1}>
          {props.label}
        </Text>
        <Image style={componentStyles.icon} source={props.icon} />
        <Image style={componentStyles.iconCaret} source={require('../assets/angle-right-solid.png')} />
      </View>
    </TouchableOpacity>
  );
};

export default ItemTextWithIcon;
