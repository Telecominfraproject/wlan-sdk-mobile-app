import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { blackColor, whiteColor } from '../AppStyle';
import isEqual from 'lodash.isequal';

const ImageWithBadge = props => {
  const isBadgeSizeSmall = () => {
    return props.badgeSize === 'small';
  };

  const componentStyles = StyleSheet.create({
    container: {
      // Include all margins from the passed in style
      margin: props.style ? props.style.margin : 0,
      marginBottom: props.style ? props.style.marginBottom : 0,
      marginTop: props.style ? props.style.marginTop : 0,
      marginLeft: props.style ? props.style.marginLeft : 0,
      marginRight: props.style ? props.style.marginRight : 0,
      // Border Support
      borderWidth: props.style ? props.style.borderWidth : 0,
      borderRadius: props.style ? props.style.borderRadius : 0,
      borderColor: props.style ? props.style.borderColor : whiteColor,
      // Background Color
      backgroundColor: props.style ? props.style.backgroundColor : whiteColor,
    },
    image: {
      // Main container should be width/height passed in
      width: props.style ? props.style.width : 'auto',
      height: props.style ? props.style.height : 'auto',
      resizeMode: props.style ? props.style.resizeMode : 'contain',
      tintColor: props.style ? props.style.tintColor : blackColor,
    },
    badgeContainerLarge: {
      width: 30,
      height: 30,
      position: 'absolute',
      top: -8,
      right: -8,
      // Contents
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'center',
      alignItems: 'center',
      // Visual properties
      borderRadius: 15,
      backgroundColor: props.badgeBackgroundColor,
    },
    badgeLarge: {
      width: 20,
      height: 20,
      tintColor: props.badgeTintColor,
    },
    badgeTextLarge: {
      fontSize: 18,
      fontWeight: 'bold',
      color: props.badgeTintColor,
    },
    badgeContainerSmall: {
      width: 16,
      height: 16,
      position: 'absolute',
      top: -6,
      right: -6,
      // Contents
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'center',
      alignItems: 'center',
      // Visual properties
      borderRadius: 8,
      backgroundColor: props.badgeBackgroundColor,
    },
    badgeSmall: {
      width: 12,
      height: 12,
      tintColor: props.badgeTintColor,
    },
    badgeTextSmall: {
      fontSize: 10,
      fontWeight: 'bold',
      color: props.badgeTintColor,
    },
  });

  return (
    <View style={componentStyles.container}>
      <Image style={componentStyles.image} source={props.source} />
      <View style={isBadgeSizeSmall() ? componentStyles.badgeContainerSmall : componentStyles.badgeContainerLarge}>
        {props.badgeSource ? (
          <Image
            style={isBadgeSizeSmall() ? componentStyles.badgeSmall : componentStyles.badgeLarge}
            source={props.badgeSource}
          />
        ) : (
          <Text style={isBadgeSizeSmall() ? componentStyles.badgeTextSmall : componentStyles.badgeTextLarge}>
            {props.badgeText}
          </Text>
        )}
      </View>
    </View>
  );
};

export default React.memo(ImageWithBadge, (prevProps, nextProps) => {
  return isEqual(prevProps, nextProps);
});
