import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function BulletList(props) {
  const [items, setItems] = useState(props.items ?? []);
  const indent = props.indent ?? 0;
  const gap = props.gap ?? 5;
  const containerStyle = props.containerStyle ?? {};
  const fontSize = props.fontSize ?? 16;

  useEffect(() => {
    if (props.items) {
      setItems(props.items);
    }
  }, [props.items]);

  const componentStyles = StyleSheet.create({
    container: {},
    list: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    bullet: {
      marginLeft: indent,
      fontSize,
    },
    text: {
      marginLeft: gap,
      fontSize,
    },
  });

  return (
    <View style={[componentStyles.container, containerStyle]}>
      {items.map((item, index) => (
        <View style={componentStyles.list} key={index}>
          <Text style={componentStyles.bullet}>{'\u2022'}</Text>
          <Text style={componentStyles.text}>{item}</Text>
        </View>
      ))}
    </View>
  );
}
