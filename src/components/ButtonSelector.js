import React, { useEffect, useState, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { borderRadiusDefault, heightCellDefault, primaryColor, whiteColor } from '../AppStyle';
import DropDownPicker from 'react-native-dropdown-picker';

export default function ButtonSelector(props) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(0);
  const options = props.options ?? [];
  const maxButtons = props.maxButtons ?? 2;
  const titleKey = props.titleKey ?? 'name';
  const height = props.style.height ?? heightCellDefault;
  const items = useMemo(() => getItems(options), [options]);

  // Update items when the options list change
  //auseEffect(() => {
  //  getItems();
  //}, [options]);a

  function getItems(optionsInput) {
    if (optionsInput.length > 0) {
      return optionsInput.map((option, index) => ({ label: option[titleKey], value: index }));
    } else {
      return [];
    }
  }

  const onSelect = index => {
    setSelected(index);
    if (props.onSelect) {
      props.onSelect(options[index]);
    }
  };

  const getButtonStyles = index => {
    if (options.length > 1) {
      switch (index) {
        case 0:
          return componentStyles.firstButton;
        case options.length - 1:
          return componentStyles.lastButton;
        default:
          return componentStyles.middleButton;
      }
    }
  };

  const getButtonColor = index => {
    return selected === index ? componentStyles.filled : componentStyles.outline;
  };
  const getTextColor = index => {
    return selected === index ? componentStyles.textFilled : componentStyles.textOutline;
  };

  // Styles
  const componentStyles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      margin: props.style ? props.style.margin : 0,
      marginBottom: props.style ? props.style.marginBottom : 0,
      marginTop: props.style ? props.style.marginTop : 0,
      marginLeft: props.style ? props.style.marginLeft : 0,
      marginRight: props.style ? props.style.marginRight : 0,
    },
    // dropdown
    dropdown: {
      height,
      borderWidth: 1,
      borderRadius: borderRadiusDefault,
      borderColor: primaryColor,
    },
    dropdownContainer: {
      borderWidth: 1,
      backgroundColor: whiteColor,
      borderColor: primaryColor,
    },
    dropdownLabel: {
      fontSize: 16,
      textAlign: 'center',
      color: primaryColor,
    },
    // buttons
    buttons: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      height,
      padding: 5,
      borderWidth: 1,
      borderRadius: borderRadiusDefault,
      borderColor: primaryColor,
    },
    firstButton: {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    },
    middleButton: {
      borderRadius: 0,
    },
    lastButton: {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
    },
    filled: {
      color: whiteColor,
      backgroundColor: primaryColor,
    },
    outline: {
      color: primaryColor,
      backgroundColor: whiteColor,
    },
    textOutline: {
      color: primaryColor,
    },
    textFilled: {
      color: whiteColor,
    },
  });

  return (
    <View style={componentStyles.container}>
      {options.length > maxButtons ? (
        <DropDownPicker
          listMode={'SCROLLVIEW'}
          loading={props.loading ?? false}
          open={open}
          value={selected}
          items={items}
          setOpen={setOpen}
          setValue={setSelected}
          setItems={setItems}
          style={componentStyles.dropdown}
          dropDownContainerStyle={componentStyles.dropdownContainer}
          labelStyle={componentStyles.dropdownLabel}
          onChangeValue={value => onSelect(value)}
        />
      ) : (
        options.map((option, index) => (
          <Pressable
            key={index}
            style={[componentStyles.buttons, getButtonStyles(index), getButtonColor(index)]}
            onPress={() => {
              if (selected !== index) {
                onSelect(index);
              }
            }}>
            <Text numberOfLines={1} style={getTextColor(index)}>
              {option[titleKey]}
            </Text>
          </Pressable>
        ))
      )}
    </View>
  );
}
