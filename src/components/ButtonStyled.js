import React from 'react';
import {
  paddingHorizontalDefault,
  borderRadiusDefault,
  cellHeightDefault,
  primaryColor,
  whiteColor,
  grayColor,
  grayDarkColor,
  grayLightColor,
} from '../AppStyle';
import { StyleSheet, TouchableOpacity, View, Text, ActivityIndicator } from 'react-native';
import isEqual from 'lodash.isequal';

const ButtonStyled = props => {
  // Supports the following props:
  // title: <string> which is the button title
  // onPress: <callback> for any onPress event
  // style: <style> for the component, in general margins will handled
  // color: <string> override color for the button, will use primaryColor as default
  // type: one of ['filled', 'text', 'outline'] - default is 'filled'
  // size: one of ['large', 'small'] - default is 'large'
  // disabled: <boolean>

  const getTouchableStyle = () => {
    switch (props.type) {
      case 'text':
        return [componentStyles.touchableStyle];

      case 'outline':
      case 'filled':
      default:
        return [componentStyles.touchableStyle, componentStyles.touchableButtonTypeStyle];
    }
  };

  const getContainerStyle = () => {
    let containerSize = props.size === 'small' ? componentStyles.containerSmall : componentStyles.containerLarge;

    if (props.disabled) {
      switch (props.type) {
        case 'text':
          return [componentStyles.containerTextOnly];

        case 'outline':
        case 'filled':
        default:
          return [componentStyles.container, containerSize, componentStyles.containerDisabled];
      }
    } else {
      switch (props.type) {
        case 'text':
          return [componentStyles.containerTextOnly];

        case 'outline':
          return [componentStyles.container, containerSize, componentStyles.containerOutline];

        case 'filled':
        default:
          return [componentStyles.container, containerSize, componentStyles.containerFilled];
      }
    }
  };

  const getTextStyle = () => {
    if (props.disabled) {
      switch (props.type) {
        case 'text':
        case 'outline':
        case 'filled':
        default:
          return [componentStyles.text, componentStyles.textDisabled];
      }
    } else {
      switch (props.type) {
        case 'text':
        case 'outline':
          return [componentStyles.text, componentStyles.textOutline];

        default:
        case 'filled':
          return [componentStyles.text, componentStyles.textFilled];
      }
    }
  };

  const componentStyles = StyleSheet.create({
    touchableStyle: {
      // Include all margins from the passed in style, if it exists
      margin: props.style ? props.style.margin : 0,
      marginBottom: props.style ? props.style.marginBottom : 0,
      marginTop: props.style ? props.style.marginTop : 0,
      marginLeft: props.style ? props.style.marginLeft : 0,
      marginRight: props.style ? props.style.marginRight : 0,
    },
    touchableButtonTypeStyle: {
      flex: props.style ? props.style.flex : 0,
      justifyContent: 'flex-start',
    },
    container: {
      // Layout
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'center',
      alignItems: 'center',
    },
    containerLarge: {
      paddingHorizontal: paddingHorizontalDefault,
      height: cellHeightDefault,
      borderRadius: borderRadiusDefault,
    },
    containerSmall: {
      paddingHorizontal: paddingHorizontalDefault,
      height: 30,
      borderRadius: borderRadiusDefault,
      minWidth: 77,
    },
    activityIndicatorLarge: {
      position: 'absolute',
      opacity: 0.8,
    },
    activityIndicatorSmall: {
      position: 'absolute',
      opacity: 0.8,
      transform: [{ scale: 0.8 }],
    },
    text: {
      fontSize: 14,
    },
    // Text Only Styles
    containerTextOnly: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    // Outline Styles
    containerOutline: {
      borderColor: props.color ? props.color : primaryColor,
      backgroundColor: whiteColor,
      borderWidth: 1,
    },
    textOutline: {
      color: props.color ? props.color : primaryColor,
    },
    // Filled Styles
    containerFilled: {
      backgroundColor: props.color ? props.color : primaryColor,
    },
    textFilled: {
      color: whiteColor,
    },
    // Disabled Styles
    containerDisabled: {
      borderColor: grayColor,
      backgroundColor: grayLightColor,
      borderWidth: 1,
    },
    textDisabled: {
      color: grayDarkColor,
    },
  });

  return (
    <TouchableOpacity style={getTouchableStyle()} onPress={props.onPress} disabled={props.disabled}>
      <View style={getContainerStyle()}>
        <Text style={getTextStyle()}>{props.title}</Text>
        {props.loading && (
          <ActivityIndicator
            style={
              props.size === 'small' ? componentStyles.activityIndicatorSmall : componentStyles.activityIndicatorLarge
            }
            size="large"
            color={primaryColor}
            animating={props.isLoading}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(ButtonStyled, (prevProps, nextProps) => {
  return isEqual(prevProps, nextProps);
});
