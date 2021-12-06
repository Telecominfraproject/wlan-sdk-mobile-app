import React, { useMemo } from 'react';
import { paddingHorizontalDefault, heightCellDefault, primaryColor } from '../AppStyle';
import { StyleSheet, View, Pressable, Text, Alert } from 'react-native';

const ItemTextWithLabel = props => {
  const formattedValues = useMemo(() => {
    if (props.max) {
      let values = [];
      for (let i = 0; i < props.max; i++) {
        if (props.values.length > i) {
          values[i] = props.values[i];
        } else {
          values[i] = '';
        }
      }

      return values;
    } else {
      return props.values ?? [];
    }
  }, [props.values, props.max]);

  const onPress = text => {
    Alert.alert(props.label, text, undefined, { cancelable: true });
  };

  const getTextStyle = () => {
    if (props.type === 'label') {
      return componentStyles.textLabel;
    } else {
      return componentStyles.textValue;
    }
  };

  const componentStyles = StyleSheet.create({
    container: {
      height: heightCellDefault,
      width: '100%',
      // Layout
      flexDirection: 'row',
      flexWrap: 'nowrap',
      alignItems: 'center',
      justifyContent: 'flex-start',
      flex: 0,
      // Visual
      paddingHorizontal: paddingHorizontalDefault,
    },
    textColumn: {
      flex: 1,
    },
    textLabel: {
      fontSize: 14,
      color: primaryColor,
    },
    textValue: {
      height: 28,
      fontSize: 14,
      textAlignVertical: 'center',
    },
  });

  return (
    <View style={componentStyles.container}>
      {formattedValues &&
        formattedValues.map(item => {
          return (
            <Pressable style={componentStyles.textColumn} onPress={() => onPress(item)}>
              <Text style={getTextStyle()} numberOfLines={1}>
                {item}
              </Text>
            </Pressable>
          );
        })}
    </View>
  );
};

export default ItemTextWithLabel;
