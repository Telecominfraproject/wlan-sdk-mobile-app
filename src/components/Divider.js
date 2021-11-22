import React from 'react';
import { StyleSheet, View } from 'react-native';
import { grayColor } from '../AppStyle';

export default function Divider(props) {
  const containerStyle = props.containerStyle ?? {};
  const lineStyle = props.lineStyle ?? {};
  const color = props.color ?? grayColor;
  const width = props.width ?? '100%';
  const height = props.height ?? 2;
  const paddingHorizontal = props.paddingHorizontal ?? 0;
  const paddingVertical = props.paddingVertical ?? 0;
  const marginHorizontal = props.marginHorizontal ?? 0;
  const marginVertical = props.marginVertical ?? 5;

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal,
      paddingVertical,
      width: '100%',
      marginHorizontal,
      marginVertical,
    },
    default: {
      // flex: 1,
      backgroundColor: color,
      width,
      height,
    },
  });

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.default, lineStyle]} />
    </View>
  );
}
