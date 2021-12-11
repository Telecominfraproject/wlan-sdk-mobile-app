import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { grayColor, heightCellDefault, paddingHorizontalDefault, primaryColor, whiteColor } from '../AppStyle';
import ButtonStyled from '../components/ButtonStyled';
import DropDownPicker from 'react-native-dropdown-picker';

export default function ItemPickerWithLabel(props) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(props.items ?? []);
  const placeholder = props.placeholder ?? 'Select an item';
  const label = props.label ?? '';

  const onChangeValue = async value => {
    try {
      if (props.onChangeValue) {
        let updateValue = props.changeKey ? { [props.changeKey]: value } : value;
        // Use a promise to ensure we can call Async functions. By using Promise.resolve
        // it ensures the caller is async regardless of wether it is or not.
        await Promise.resolve(props.onChangeValue(updateValue));
      }
    } catch (error) {
      // Do nothing
    }
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
    picker: {
      height: 28,
      paddingHorizontal: 0,
      borderWidth: props.style && props.style.borderWidth ? props.style.borderWidth : undefined,
      borderRadius: props.style && props.style.borderRadius ? props.style.borderRadius : undefined,
    },
    dropDownContainer: {
      borderWidth: 1,
      borderRadius: 0,
      backgroundColor: whiteColor,
      borderColor: grayColor,
    },
    buttonRight: {
      marginLeft: paddingHorizontalDefault,
    },
  });

  return (
    <View style={componentStyles.container}>
      <View style={componentStyles.containerText}>
        <Text style={componentStyles.textLabel} numberOfLines={1}>
          {label}
        </Text>
        <DropDownPicker
          listMode={'SCROLLVIEW'}
          mode={props.multiple ? 'BADGE' : 'SIMPLE'}
          style={componentStyles.picker}
          loading={props.loading ?? false}
          placeholder={placeholder}
          disabled={props.disabled}
          multiple={props.multiple ? props.multiple : false}
          items={items}
          setItems={setItems}
          open={open}
          setOpen={setOpen}
          value={props.value}
          setValue={props.setValue}
          zIndex={props.zIndex}
          dropDownDirection="BOTTOM"
          dropDownContainerStyle={componentStyles.dropDownContainer}
          onChangeValue={value => onChangeValue(value)}
        />
      </View>
      {props.buttonTitle && (
        <ButtonStyled
          style={componentStyles.buttonRight}
          title={props.buttonTitle}
          type={props.buttonType}
          onPress={props.onButtonPress}
          size="small"
          disabled={props.buttonDisabled}
        />
      )}
    </View>
  );
}
