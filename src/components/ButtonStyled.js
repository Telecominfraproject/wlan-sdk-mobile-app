import React from 'react';
import { borderRadiusDefault, primaryColor, whiteColor, grayColor, grayDarkColor, grayLightColor } from '../AppStyle';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';

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
        return [buttonStyledStyle.touchableStyle];

      case 'outline':
      case 'filled':
      default:
        return [buttonStyledStyle.touchableStyle, buttonStyledStyle.touchableButtonTypeStyle];
    }
  };

  const getContainerStyle = () => {
    let containerSize = props.size === 'small' ? buttonStyledStyle.containerSmall : buttonStyledStyle.containerLarge;

    if (props.disabled) {
      switch (props.type) {
        case 'text':
          return [buttonStyledStyle.containerTextOnly];

        case 'outline':
        case 'filled':
        default:
          return [buttonStyledStyle.container, containerSize, buttonStyledStyle.containerDisabled];
      }
    } else {
      switch (props.type) {
        case 'text':
          return [buttonStyledStyle.containerTextOnly];

        case 'outline':
          return [buttonStyledStyle.container, containerSize, buttonStyledStyle.containerOutline];

        case 'filled':
        default:
          return [buttonStyledStyle.container, containerSize, buttonStyledStyle.containerFilled];
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
          return [buttonStyledStyle.text, buttonStyledStyle.textDisabled];
      }
    } else {
      switch (props.type) {
        case 'text':
        case 'outline':
          return [buttonStyledStyle.text, buttonStyledStyle.textOutline];

        default:
        case 'filled':
          return [buttonStyledStyle.text, buttonStyledStyle.textFilled];
      }
    }
  };

  const buttonStyledStyle = StyleSheet.create({
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
      paddingHorizontal: 10,
      height: 44,
      borderRadius: borderRadiusDefault,
    },
    containerSmall: {
      paddingHorizontal: 10,
      height: 30,
      borderRadius: borderRadiusDefault,
      minWidth: 77,
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
      color: primaryColor,
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
      </View>
    </TouchableOpacity>
  );
};

export default ButtonStyled;
