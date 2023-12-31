import React, { useState } from 'react';
import { placeholderColor } from '../AppStyle';
import { StyleSheet, View, Image, TextInput } from 'react-native';
import isEqual from 'lodash.isequal';

const TextInputWithIcon = props => {
  const [textShown, setTextShown] = useState(false);

  const componentStyles = StyleSheet.create({
    container: {
      ...props.style,
    },
    icon: {
      position: 'absolute',
      top: (props.style.height - (props.style.fontSize + 8)) / 2,
      right: 0,
      marginRight: props.style.paddingLeft,
      height: props.style.fontSize + 8,
      width: props.style.fontSize + 8,
      resizeMode: 'contain',
      tintColor: placeholderColor,
    },
    text: {
      height: '100%',
      width: '100%',
    },
  });

  const onChangeTextInternal = text => {
    // Hide the icon once there is text being typed
    if (text) {
      setTextShown(true);
    } else {
      setTextShown(false);
    }

    if (props.onChangeText) {
      props.onChangeText(text);
    }
  };

  return (
    <View style={componentStyles.container}>
      {textShown ? <></> : <Image style={componentStyles.icon} source={props.source} />}
      <TextInput
        style={componentStyles.text}
        placeholder={props.placeholder}
        placeholderTextColor={placeholderColor}
        onChangeText={onChangeTextInternal}
        maxLength={props.maxLength !== undefined ? props.maxLength : 255}
      />
    </View>
  );
};

export default React.memo(TextInputWithIcon, (prevProps, nextProps) => {
  return isEqual(prevProps, nextProps);
});
