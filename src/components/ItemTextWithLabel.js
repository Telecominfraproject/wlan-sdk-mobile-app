import React from 'react';
import { paddingHorizontalDefault, heightCellDefault, primaryColor, blackColor } from '../AppStyle';
import { StyleSheet, View, Text, Pressable, Alert } from 'react-native';
import ButtonStyled from '../components/ButtonStyled';
import isEqual from 'lodash.isequal';

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
      alignItems: 'center',
      justifyContent: 'space-between',
      // Visual
      paddingHorizontal: paddingHorizontalDefault,
    },
    containerText: {
      flex: 1,
      // Layout
      flexDirection: 'column',
      flexWrap: 'nowrap',
      justifyContent: 'space-evenly',
    },
    textLabel: {
      fontSize: 11,
      color: primaryColor,
    },
    textValue: {
      height: 28,
      lineHeight: 28,
      fontSize: 14,
      textAlignVertical: 'center',
      color: blackColor,
    },
    buttonRight: {
      marginLeft: paddingHorizontalDefault,
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
      {props.buttonTitle && (
        <ButtonStyled
          style={componentStyles.buttonRight}
          title={props.buttonTitle}
          type={props.buttonType}
          size="small"
          onPress={props.onButtonPress}
          loading={props.buttonLoading}
          disabled={props.buttonDisabled}
        />
      )}
    </View>
  );
};

export default React.memo(ItemTextWithLabel, (prevProps, nextProps) => {
  return isEqual(prevProps, nextProps);
});
