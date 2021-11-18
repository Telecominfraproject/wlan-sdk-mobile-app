import React from 'react';
import { paddingHorizontalDefault, heightCellDefault, primaryColor } from '../AppStyle';
import { StyleSheet, View, Text } from 'react-native';
import ButtonStyled from '../components/ButtonStyled';

const ItemTextWithLabel = props => {
  const componentStyles = StyleSheet.create({
    container: {
      height: heightCellDefault,
      width: '100%',
      // Layout
      flexDirection: 'row',
      flexWrap: 'nowrap',
      flex: 0,
      alignItems: 'center',
      justifyContent: 'space-between',
      // Visual
      paddingHorizontal: paddingHorizontalDefault,
    },
    containerText: {
      // Layout
      flexDirection: 'column',
      flexWrap: 'nowrap',
      flex: 0,
      justifyContent: 'space-evenly',
      marginRight: paddingHorizontalDefault,
    },
    textLabel: {
      fontSize: 11,
      color: primaryColor,
    },
    textValue: {
      height: 28,
      fontSize: 14,
      textAlignVertical: 'center',
    },
  });

  return (
    <View style={componentStyles.container}>
      <View style={componentStyles.containerText}>
        <Text style={componentStyles.textLabel}>{props.label}</Text>
        <Text style={componentStyles.textValue}>{props.value}</Text>
      </View>
      {props.buttonTitle ? (
        <ButtonStyled title={props.buttonTitle} type={props.buttonType} onPress={props.onButtonPress} size="small" />
      ) : (
        <></>
      )}
    </View>
  );
};

export default ItemTextWithLabel;
