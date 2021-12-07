import React, { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text } from 'react-native';
import { blackColor, grayColor } from '../AppStyle';

export default function RadioCheckbox(props) {
  const [checked, setChecked] = useState(props.checked);
  const label = props.label ?? '';
  const onChange = props.onChange;
  const fontSize = props.fontSize ?? 16;
  const disabled = props.disabled;

  useEffect(() => {
    setChecked(props.checked);
  }, [props.checked]);

  const getSource = () => {
    return checked ? require('../assets/radio-button-checked.png') : require('../assets/radio-button-unchecked.png');
  };

  const onPress = () => {
    if (!checked) {
      setChecked(true);
      if (onChange) {
        onChange();
      }
    }
  };

  const componentStyles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      alignSelf: 'stretch',
    },
    radio: {
      height: fontSize,
      width: fontSize,
      resizeMode: 'contain',
      marginHorizontal: 5,
    },
    label: {
      fontSize: fontSize,
      color: disabled ? grayColor : blackColor,
    },
  });

  return (
    <Pressable style={componentStyles.container} onPress={onPress} disabled={disabled}>
      <Image style={componentStyles.radio} source={getSource()} />
      <Text style={componentStyles.label}>{label}</Text>
    </Pressable>
  );
}
