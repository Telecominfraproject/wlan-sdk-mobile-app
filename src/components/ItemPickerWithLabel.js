import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { grayColor, heightCellDefault, paddingHorizontalDefault, primaryColor, whiteColor } from '../AppStyle';
import DropDownPicker from 'react-native-dropdown-picker';

export default function ItemPickerWithLabel(props) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(props.items ?? []);
  const placeholder = props.placeholder ?? 'Select an item';
  const label = props.label ?? '';
  const borderWidth = props.borderWidth ?? 0;
  const borderRadius = props.borderRadius ?? 0;

  const onChangeValue = value => {
    if (props.onChangeValue) {
      props.onChangeValue(value);
    }
  };

  const componentStyles = StyleSheet.create({
    container: {
      width: '100%',
      height: heightCellDefault,
      // Layout
      flexDirection: 'column',
      flexWrap: 'nowrap',
      flex: 1,
      justifyContent: 'space-evenly',
      // Visual
      paddingHorizontal: paddingHorizontalDefault,
    },
    textLabel: {
      fontSize: 11,
      color: primaryColor,
    },
    picker: {
      height: 28,
      borderWidth,
      borderRadius,
      paddingHorizontal: 0,
    },
    dropDownContainer: {
      borderWidth: 1,
      borderRadius: 0,
      backgroundColor: whiteColor,
      borderColor: grayColor,
    },
  });

  return (
    <View style={componentStyles.container}>
      <Text style={componentStyles.textLabel} numberOfLines={1}>
        {label}
      </Text>
      <DropDownPicker
        listMode={'SCROLLVIEW'}
        loading={props.loading ?? false}
        placeholder={placeholder}
        open={open}
        value={props.value}
        items={items}
        setOpen={setOpen}
        setValue={props.setValue}
        setItems={setItems}
        style={componentStyles.picker}
        dropDownContainerStyle={componentStyles.dropDownContainer}
        onChangeValue={value => onChangeValue(value)}
      />
    </View>
  );
}
