import React from 'react';
import {
  marginTopDefault,
  paddingHorizontalDefault,
  borderRadiusDefault,
  primaryColor,
  whiteColor,
  blackColor,
  grayDarkColor,
} from '../AppStyle';
import { StyleSheet, View, Text, Modal, ActivityIndicator } from 'react-native';
import { strings } from '../localization/LocalizationStrings';
import ButtonStyled from './ButtonStyled';

const ProgressModal = props => {
  const componentStyles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    containerItem: {
      width: '75%',
      paddingTop: marginTopDefault,
      paddingBottom: marginTopDefault,
      paddingLeft: paddingHorizontalDefault,
      paddingRight: paddingHorizontalDefault,
      // Visual
      backgroundColor: whiteColor,
      borderRadius: borderRadiusDefault,
      borderWidth: 1,
      borderColor: grayDarkColor,
    },
    messageText: {
      fontSize: 16,
      color: blackColor,
      textAlign: 'center',
    },
    activityIndicator: {
      marginTop: marginTopDefault,
    },
    buttonCancel: {
      marginTop: marginTopDefault,
      marginLeft: paddingHorizontalDefault,
      marginRight: paddingHorizontalDefault,
    },
  });

  return (
    <Modal onRequestClose={() => null} visible={props.visible} transparent={true}>
      <View style={componentStyles.container}>
        <View style={componentStyles.containerItem}>
          <Text style={componentStyles.messageText}>{props.message}</Text>
          <ActivityIndicator
            style={componentStyles.activityIndicator}
            color={primaryColor}
            size="large"
            animating="true"
          />
          {props.onCancelPress && (
            <ButtonStyled
              style={componentStyles.buttonCancel}
              title={strings.buttons.cancel}
              type="filled"
              size="large"
              onPress={props.onCancelPress}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

export default ProgressModal;
