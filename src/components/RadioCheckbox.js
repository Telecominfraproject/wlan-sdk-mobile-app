import React, { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
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
    return checked
      ? require('../assets/radio_button_checked_black.png')
      : require('../assets/radio_button_unchecked_black.png');
  };

  const onPress = () => {
    if (!checked) {
      setChecked(true);
      if (onChange) {
        onChange();
      }
    }
  };

  const styles = StyleSheet.create({
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
    <Pressable style={styles.container} onPress={onPress} disabled={disabled}>
      <Image style={styles.radio} source={getSource()} />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}
