import React from 'react';
import { paddingHorizontalDefault, heightCellDefault, primaryColor } from '../AppStyle';
import { StyleSheet, View, Text, Pressable, Alert } from 'react-native';
import ButtonStyled from '../components/ButtonStyled';

const ItemTextWithLabel = props => {
  const onPress = () => {
    Alert.alert(props.label, props.value, undefined, { cancelable: true });
  };

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
      flex: 1,
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
      <Pressable style={componentStyles.containerText} onPress={onPress}>
        <Text style={componentStyles.textLabel} numberOfLines={1}>
          {props.label}
        </Text>
        <Text style={componentStyles.textValue} numberOfLines={1}>
          {props.value}
        </Text>
      </Pressable>
      {props.buttonTitle ? (
        <ButtonStyled
          title={props.buttonTitle}
          type={props.buttonType}
          onPress={props.onButtonPress}
          size="small"
          disabled={props.buttonDisabled}
        />
      ) : (
        <></>
      )}
    </View>
  );
};

export default ItemTextWithLabel;
