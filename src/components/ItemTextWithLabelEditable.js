import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import {
  heightCellDefault,
  paddingHorizontalDefault,
  primaryColor,
  placeholderColor,
  blackColor,
  errorColor,
} from '../AppStyle';
import { strings } from '../localization/LocalizationStrings';

export default function ItemTextWithLabelEditable(props) {
  const { type = '' } = props;
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [value, setValue] = useState(props.value);
  const [valid, setValid] = useState(true);
  const isMounted = useRef(false);
  const inputRef = useRef();

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

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

  const onChangeText = text => {
    // First validate the input to ensure they only using proper characters for the type
    if (validateInputAcceptedCharacters(text)) {
      // Value has accepted characters, see if it the text is fully valid
      setValue(text);
      setValid(validateInputFullText(text));
    } else {
      // Value has unacceptable characters, so just use the previous value and validate against that
      setValid(validateInputFullText(value));
    }
  };

  // acceptable inputs
  const validateInputAcceptedCharacters = text => {
    if (!text) {
      return true;
    }

    let re = null;
    switch (type) {
      case 'email':
        re = /^[\S]*$/;
        break;

      case 'ipv4':
        re = /^[.0-9]*$/;
        break;

      case 'ipv6':
      case 'ipv4|ipv6':
        re = /^[.:0-9a-fA-F]*$/;
        break;

      case 'mac':
        re = /^[0-9a-f]*$/;
        break;

      case 'phone':
        re = /^[0-9 ()+-]*$/;
        break;

      case 'firstName':
        re = /^[a-zA-Z-]+$/;
        break;

      case 'lastName':
        re = /^[a-zA-Z- ]+$/;
        break;
    }

    return re ? re.test(text) : true;
  };

  // validates whole text
  const validateInputFullText = text => {
    if (!text) {
      return true;
    }

    let re = null;
    switch (type) {
      case 'email':
        re = /\S+@\S+\.\S+/;
        break;

      case 'ipv4':
        re = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)(\.(?!$)|$)){4}$/;
        break;

      case 'ipv6':
        re =
          /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/;
        break;

      case 'ipv4|ipv6':
        re =
          /(^\s*((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))\s*$)|(^\s*((?=.{1,255}$)[0-9A-Za-z](?:(?:[0-9A-Za-z]|\b-){0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:(?:[0-9A-Za-z]|\b-){0,61}[0-9A-Za-z])?)*\.?)\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$)/;
        break;

      case 'mac':
        re = /^([0-9a-f]{1,2}){5}([0-9a-f]{1,2})$/;
        break;

      case 'phone':
        re = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
        break;

      case 'firstName':
        re = /^[a-zA-Z-]{2,}$/;
        break;

      case 'lastName':
        re = /^[a-zA-Z- ]{2,}$/;
        break;
    }

    return re ? re.test(text) : true;
  };

  const onEditComplete = async () => {
    if (value && !valid) {
      Alert.alert(strings.errors.validationError, strings.errors.invalidField, undefined, { cancelable: true });
      return;
    }

    if (value === props.value) {
      // If the new value is the same as the initial value, just return.
      setEdit(false);
      return;
    }

    try {
      setLoading(true);

      if (props.onEdit) {
        let updatedValue;
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
      // The onEdit call may result in a re-render of the parent and having this component be
      // unmounted. In this case we have no need to update the information and it will result
      // in a warning if we do. So detect this condition
      if (isMounted.current) {
        setLoading(false);
        setEdit(false);
      }
    }
  };

  const showEditIcon = () => {
    return !props.disabled;
  };

  const showPlaceholder = () => {
    return !props.value;
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
      color: valid ? blackColor : errorColor,
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
            onChangeText={onChangeText}
            onEndEditing={onEditComplete}
            onSubmitEditing={onEditComplete}
            maxLength={type === 'firstName' || type === 'lastName' ? 26 : null}
          />
        ) : (
          <Text
            style={[componentStyles.textValue, showPlaceholder() ? componentStyles.textValuePlaceholder : '']}
            numberOfLines={1}>
            {showPlaceholder() ? props.placeholder : value}
          </Text>
        )}
      </View>
      {loading ? (
        <ActivityIndicator style={componentStyles.activityIndicator} color={primaryColor} animating={loading} />
      ) : (
        showEditIcon() && <Image style={componentStyles.editIcon} source={require('../assets/pen-solid.png')} />
      )}
    </Pressable>
  );
}
