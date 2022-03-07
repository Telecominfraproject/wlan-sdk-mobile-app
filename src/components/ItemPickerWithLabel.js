import React, { useEffect, useState, useRef } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  grayColor,
  heightCellDefault,
  paddingHorizontalDefault,
  primaryColor,
  whiteColor,
  blackColor,
} from '../AppStyle';
import ButtonStyled from '../components/ButtonStyled';
import DropDownPicker from 'react-native-dropdown-picker';
import isEqual from 'lodash.isequal';

const ItemPickerWithLabel = props => {
  const { label = '', disabled = false, disabledReason } = props;
  const [changeLoading, setChangeLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(props.items ?? []);
  const placeholder = props.placeholder ?? 'Select an item';
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  const onChangeValue = async value => {
    try {
      setChangeLoading(true);

      if (props.onChangeValue) {
        let updateValue = props.changeKey ? { [props.changeKey]: value } : value;
        // Use a promise to ensure we can call Async functions. By using Promise.resolve
        // it ensures the caller is async regardless of wether it is or not.
        await Promise.resolve(props.onChangeValue(updateValue));
      }
    } catch (error) {
      // Do nothing
    } finally {
      // The onEdit call may result in a re-render of the parent and having this component be
      // unmounted. In this case we have no need to update the information and it will result
      // in a warning if we do. So detect this condition
      if (isMounted.current) {
        setChangeLoading(false);
      }
    }
  };

  const disabledAlert = () => {
    if (disabled && disabledReason) {
      Alert.alert(label, disabledReason, undefined, { cancelable: true });
    }
  };

  const getCurrentValue = () => {
    if (items && props.value) {
      for (let i = 0; i < items.length; i++) {
        let item = items[i];
        let itemValue = item.value;

        if (itemValue === props.value) {
          return item.label;
        }
      }
    }

    return '';
  };

  const componentStyles = StyleSheet.create({
    container: {
      height: heightCellDefault,
      width: '100%',
      // Layout
      flexDirection: 'row',
      flexWrap: 'nowrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      // Visual
      paddingHorizontal: paddingHorizontalDefault,
      zIndex: props.zIndex,
    },
    containerText: {
      flex: 1,
      // Layout
      flexDirection: 'column',
      flexWrap: 'nowrap',
      justifyContent: 'space-evenly',
    },
    activityIndicatorContainer: {
      width: '100%',
      // Layout
      flexDirection: 'row',
      flexWrap: 'nowrap',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    activityIndicator: {
      width: 16,
      height: 16,
    },
    textLabel: {
      fontSize: 11,
      color: primaryColor,
    },
    textValue: {
      height: 28,
      lineHeight: 28,
      fontSize: 14,
      textAlignVertical: 'center',
      color: blackColor,
    },
    picker: {
      height: 28,
      paddingHorizontal: 0,
      borderWidth: props.style && props.style.borderWidth ? props.style.borderWidth : undefined,
      borderRadius: props.style && props.style.borderRadius ? props.style.borderRadius : undefined,
    },
    pickerDisabled: {
      opacity: 0.4,
    },
    dropDownContainer: {
      borderWidth: 1,
      borderRadius: 0,
      backgroundColor: whiteColor,
      borderColor: grayColor,
    },
    buttonRight: {
      marginLeft: paddingHorizontalDefault,
    },
  });

  return (
    <View style={componentStyles.container}>
      <Pressable style={componentStyles.containerText} onPress={disabledAlert}>
        <Text style={componentStyles.textLabel} numberOfLines={1}>
          {label}
        </Text>
        {changeLoading || props.loading ? (
          <View style={componentStyles.activityIndicatorContainer}>
            <Text style={componentStyles.textValue} numberOfLines={1}>
              {getCurrentValue()}
            </Text>
            <ActivityIndicator
              style={componentStyles.activityIndicator}
              size="large"
              color={primaryColor}
              animating={props.loading}
            />
          </View>
        ) : (
          <DropDownPicker
            listMode={'SCROLLVIEW'}
            mode={props.multiple ? 'BADGE' : 'SIMPLE'}
            style={componentStyles.picker}
            disabledStyle={componentStyles.pickerDisabled}
            placeholder={placeholder}
            disabled={disabled}
            multiple={props.multiple ? props.multiple : false}
            items={items}
            setItems={setItems}
            open={open}
            setOpen={setOpen}
            value={props.value}
            setValue={props.setValue}
            zIndex={props.zIndex}
            dropDownDirection="BOTTOM"
            dropDownContainerStyle={componentStyles.dropDownContainer}
            onChangeValue={value => onChangeValue(value)}
          />
        )}
      </Pressable>
      {props.buttonTitle && (
        <ButtonStyled
          style={componentStyles.buttonRight}
          title={props.buttonTitle}
          type={props.buttonType}
          size="small"
          onPress={props.onButtonPress}
          loading={props.buttonLoading}
          disabled={props.buttonDisabled}
        />
      )}
    </View>
  );
};

export default React.memo(ItemPickerWithLabel, (prevProps, nextProps) => {
  return isEqual(prevProps, nextProps);
});
