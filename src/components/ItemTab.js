import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  borderRadiusDefault,
  heightCellDefault,
  paddingHorizontalDefault,
  primaryColor,
  whiteColor,
} from '../AppStyle';

export default function ItemTab(props) {
  const { tabs = [], titleKey, onChange, height = heightCellDefault, label } = props;
  const [selected, setSelected] = useState(props.selected ?? 0);

  const onPress = index => {
    if (selected === index) {
      return;
    }
    setSelected(index);

    if (onChange) {
      onChange(tabs[index]);
    }
  };

  const getButtonStyles = index => {
    if (tabs.length > 1) {
      switch (index) {
        case 0:
          return componentStyles.firstButton;
        case tabs.length - 1:
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
      minHeight: heightCellDefault,
      width: '100%',
      // Layout
      flexWrap: 'nowrap',
      justifyContent: 'space-evenly',
      // Visual
      paddingHorizontal: paddingHorizontalDefault,
    },
    containerTabs: {
      height,
      // Layout
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    // label
    textLabel: {
      fontSize: 11,
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
      {label && (
        <Text style={componentStyles.textLabel} numberOfLines={1}>
          {label}
        </Text>
      )}
      <View style={componentStyles.containerTabs}>
        {tabs.map((tab, index) => (
          <Pressable
            key={index}
            style={[componentStyles.buttons, getButtonStyles(index), getButtonColor(index)]}
            onPress={() => onPress(index)}>
            <Text numberOfLines={1} style={getTextColor(index)}>
              {titleKey ? tab[titleKey] : tab}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
