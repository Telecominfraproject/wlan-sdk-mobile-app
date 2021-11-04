import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { pageItemStyle, primaryColor } from '../AppStyle';
import { handleApiError } from '../api/apiHandler';

export default function TextInputInPlaceEditing(props) {
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [value, setValue] = useState(props.value);
  const inputRef = useRef();
  const style = props.style ?? {};
  const objectKey = props.objectKey;

  useEffect(() => {
    if (edit) {
      inputRef.current.focus();
    }
  }, [edit]);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const onSubmit = () => {
    // same as initial
    if (value === props.value) {
      setEdit(false);
      return;
    }

    try {
      setLoading(true);
      if (objectKey) {
        props.onSubmit({ [objectKey]: value });
      } else {
        props.onSubmit(value);
      }
      setEdit(false);
    } catch (err) {
      handleApiError('TextInputInPlaceEditing Error', err);
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    line: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    input: {},
    loading: {
      ...StyleSheet.absoluteFill,
      alignItems: 'flex-end',
      zIndex: 10,
    },
  });

  return (
    <View style={style}>
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator color={primaryColor} animating={loading} />
        </View>
      )}
      <Pressable onPress={() => setEdit(true)}>
        {edit ? (
          <TextInput
            ref={inputRef}
            style={[pageItemStyle.inputText, styles.input]}
            value={value}
            onBlur={onSubmit}
            onChangeText={text => setValue(text)}
            onSubmitEditing={onSubmit}
          />
        ) : (
          <Text style={styles.input}>{value}</Text>
        )}
      </Pressable>
    </View>
  );
}
