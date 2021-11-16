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
  const margin = props.margin ?? 5;

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal,
      paddingVertical,
    },
    default: {
      flex: 1,
      backgroundColor: color,
      width,
      height,
      margin,
    },
  });

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.default, lineStyle]} />
    </View>
  );
}
