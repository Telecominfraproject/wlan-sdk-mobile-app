import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';

const ImageWithBadge = props => {
  const isBadgeSizeSmall = () => {
    return props.badgeSize === 'small';
  };

  const imageWithBadgeStyle = StyleSheet.create({
    container: {
      // Main container should be width/height passed in
      width: props.style.width,
      height: props.style.height,
      // Include all margins from the passed in style
      margin: props.style.margin,
      marginBottom: props.style.marginBottom,
      marginTop: props.style.marginTop,
      marginLeft: props.style.marginLeft,
      marginRight: props.style.marginRight,
    },
    badgeContainerLarge: {
      width: 30,
      height: 30,
      position: 'absolute',
      top: -10,
      right: -10,
      // Contents
      flexDirection: 'row',
      flexWrap: 'nowrap',
      flex: 0,
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
      flex: 0,
      justifyContent: 'center',
      alignItems: 'center',
      // Visual properties
      borderRadius: 10,
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
    <View style={imageWithBadgeStyle.container}>
      <Image style={props.style} source={props.source} />
      <View
        style={isBadgeSizeSmall() ? imageWithBadgeStyle.badgeContainerSmall : imageWithBadgeStyle.badgeContainerLarge}>
        {props.badgeSource ? (
          <Image
            style={isBadgeSizeSmall() ? imageWithBadgeStyle.badgeSmall : imageWithBadgeStyle.badgeLarge}
            source={props.badgeSource}
          />
        ) : (
          <Text style={isBadgeSizeSmall() ? imageWithBadgeStyle.badgeTextSmall : imageWithBadgeStyle.badgeTextLarge}>
            {props.badgeText}
          </Text>
        )}
      </View>
    </View>
  );
};

export default ImageWithBadge;
