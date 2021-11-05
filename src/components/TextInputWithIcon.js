import React, { useState } from 'react';
import { StyleSheet, View, ImageBackground, Image, TextInput } from 'react-native';

const TextInputWithIcon = props => {
  const [textShown, setTextShown] = useState(false);

  const textInputWithIconStyle = StyleSheet.create({
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
      // This is the default placeholder text colour - if this needs to be changeable it can be updated
      tintColor: '#c7c7cd',
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
    <View style={textInputWithIconStyle.container}>
      {textShown ? <></> : <Image style={textInputWithIconStyle.icon} source={props.source} />}
      <TextInput style={textInputWithIconStyle.text} placeholder="Search" onChangeText={onChangeTextInternal} />
    </View>
  );
};

export default TextInputWithIcon;
