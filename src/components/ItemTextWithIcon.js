import React from 'react';
import { blackColor, paddingHorizontalDefault, heightCellDefault } from '../AppStyle';
import { StyleSheet, TouchableOpacity, View, Text, Image } from 'react-native';
import ImageWithBadge from '../components/ImageWithBadge';

const ItemTextWithIcon = props => {
  const componentStyles = StyleSheet.create({
    container: {
      height: heightCellDefault,
      width: '100%',
      // Layout
      flexDirection: 'row',
      flexWrap: 'nowrap',
      alignItems: 'center',
      justifyContent: 'space-between',
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
        <ImageWithBadge
          style={componentStyles.icon}
          source={props.icon}
          badgeSize="small"
          badgeSource={props.badgeSource}
          badgeBackgroundColor={props.badgeBackgroundColor}
          badgeTintColor={props.badgeTintColor}
        />
        <Image style={componentStyles.iconCaret} source={require('../assets/angle-right-solid.png')} />
      </View>
    </TouchableOpacity>
  );
};

export default ItemTextWithIcon;
