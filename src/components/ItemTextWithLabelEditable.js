import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { heightCellDefault, paddingHorizontalDefault, primaryColor, placeholderColor } from '../AppStyle';

export default function ItemTextWithLabelEditable(props) {
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [value, setValue] = useState(props.value);
  const inputRef = useRef();

  // If the props.value changes, make sure to update the internal value
  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  // If the edit state is changed and made to be set, then automatically
  // focus on the input.
  useEffect(() => {
    if (edit) {
      inputRef.current.focus();
    }
  }, [edit]);

  const onEditComplete = async () => {
    if (value === props.value) {
      // If the new value is the same as the initial value, just return.
      setEdit(false);
      return;
    }

    try {
      setLoading(true);

      if (props.onEdit) {
        let updatedValue = null;
        if (props.editKey) {
          updatedValue = { [props.editKey]: value };
        } else {
          updatedValue = value;
        }

        // The following should work with async and non-async functions alike. It'll ensure
        // that the function completes before it continuing
        await Promise.resolve(props.onEdit(updatedValue));
      }
    } catch (error) {
      // Do nothing
    } finally {
      setLoading(false);
      setEdit(false);
    }
  };

  const showEditIcon = () => {
    return props.disabled ? false : true;
  };

  const showPlaceholder = () => {
    return props.value ? false : true;
  };

  const onPress = () => {
    if (props.disabled) {
      Alert.alert(props.label, props.value, undefined, { cancelable: true });
    } else {
      setEdit(true);
    }
  };

  const componentStyles = StyleSheet.create({
    container: {
      height: heightCellDefault,
      width: '100%',
      // Layout
      flexDirection: 'row',
      flexWrap: 'nowrap',
      flex: 0,
      alignItems: 'center',
      justifyContent: 'space-between',
      // Visual
      paddingHorizontal: paddingHorizontalDefault,
    },
    containerText: {
      // Layout
      flexDirection: 'column',
      flexWrap: 'nowrap',
      flex: 1,
      justifyContent: 'space-evenly',
      marginRight: paddingHorizontalDefault,
    },
    input: {
      height: 28,
      padding: 0,
      // Visual
      fontSize: 14,
      borderLeftWidth: 0,
      borderTopWidth: 0,
      borderRightWidth: 0,
      borderBottomWidth: 0,
    },
    textLabel: {
      fontSize: 11,
      color: primaryColor,
    },
    textValue: {
      height: 28,
      fontSize: 14,
      textAlignVertical: 'center',
    },
    textValuePlaceholder: {
      color: placeholderColor,
    },
    activityIndicator: {
      width: 16,
      height: 16,
    },
    editIcon: {
      width: 16,
      height: 16,
      resizeMode: 'contain',
    },
  });

  return (
    <Pressable style={componentStyles.container} disabled={loading} onPress={onPress}>
      <View style={componentStyles.containerText}>
        <Text style={componentStyles.textLabel} numberOfLines={1}>
          {props.label}
        </Text>
        {edit ? (
          <TextInput
            ref={inputRef}
            style={componentStyles.input}
            value={value}
            editable={!loading}
            placeholder={props.placeholder}
            onChangeText={text => setValue(text)}
            onEndEditing={onEditComplete}
            onSubmitEditing={onEditComplete}
          />
        ) : (
          <Text
            style={[componentStyles.textValue, showPlaceholder() ? componentStyles.textValuePlaceholder : '']}
            numberOfLines={1}>
            {showPlaceholder() ? props.placeholder : props.value}
          </Text>
        )}
      </View>
      {loading ? (
        <ActivityIndicator style={componentStyles.activityIndicator} color={primaryColor} animating={loading} />
      ) : (
        showEditIcon() && <Image style={componentStyles.editIcon} source={require('../assets/edit_black.png')} />
      )}
    </Pressable>
  );
}
