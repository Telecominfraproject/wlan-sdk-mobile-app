import React, { useMemo } from 'react';
import { paddingHorizontalDefault, heightCellDefault, primaryColor, errorColor } from '../AppStyle';
import { StyleSheet, View, Pressable, Text, Alert, TouchableOpacity, Image } from 'react-native';

const ItemColumnswithValues = props => {
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
      // Layout
      flexDirection: 'row',
      flexWrap: 'nowrap',
      alignItems: 'center',
      justifyContent: 'flex-start',
      height: heightCellDefault,
      width: '100%',
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
    deleteIcon: {
      width: 16,
      height: 16,
      resizeMode: 'contain',
      tintColor: errorColor,
      marginRight: paddingHorizontalDefault,
    },
    editIcon: {
      width: 16,
      height: 16,
      resizeMode: 'contain',
      marginLeft: paddingHorizontalDefault,
    },
  });

  return (
    <View style={componentStyles.container}>
      {/* Only show the delete icon if there is an OnPressDelete, otherwise just reserve the space so columns line up */}
      {props.showDelete &&
        (props.onDeletePress ? (
          <TouchableOpacity key="delete_button" onPress={props.onDeletePress}>
            <Image style={componentStyles.deleteIcon} source={require('../assets/times-solid.png')} />
          </TouchableOpacity>
        ) : (
          <View key="delete_button" style={componentStyles.deleteIcon} />
        ))}
      {formattedValues &&
        formattedValues.map((item, index) => {
          return (
            <Pressable key={'column_' + index} style={componentStyles.textColumn} onPress={() => onPress(item)}>
              <Text style={getTextStyle()} numberOfLines={1}>
                {item}
              </Text>
            </Pressable>
          );
        })}
      {/* Only show the delete icon if there is an OnPressEdit, otherwise just reserve the space so columns line up */}
      {props.showEdit &&
        (props.onEditPress ? (
          <TouchableOpacity key="edit_button" onPress={props.onEditPress}>
            <Image style={componentStyles.editIcon} source={require('../assets/pen-solid.png')} />
          </TouchableOpacity>
        ) : (
          <View key="edit_button" style={componentStyles.editIcon} />
        ))}
    </View>
  );
};

export default ItemColumnswithValues;