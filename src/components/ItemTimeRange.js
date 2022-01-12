import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { blackColor, errorColor, paddingHorizontalDefault, primaryColor } from '../AppStyle';
import { strings } from '../localization/LocalizationStrings';
import ItemPickerWithLabel from './ItemPickerWithLabel';
import { showGeneralError } from '../Utils';

export default function ItemTimeRange(props) {
  let zIndex = props.zIndex || 20;
  const { range, showDelete, onDeletePress, showEdit, onEditTime } = props;
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    let temp = range.split('-');
    setStart(Number(temp[0]) / 100);
    setEnd(Number(temp[1]) / 100);
  }, [range]);

  const getTimes = () => {
    // [0...24]
    let times = [...Array(25).keys()];

    return times.map(time => {
      let label = time + ':00';
      return { label, value: time };
    });
  };

  const onEditRange = () => {
    if (Number.isInteger(start) && Number.isInteger(end)) {
      // check if valid range
      if (start >= end) {
        showGeneralError(strings.errors.titleAccessScheduler, strings.errors.invalidAccessTime);
      }
      updateRange();
    }
  };

  const updateRange = () => {
    // let test = `${start}:00 - ${end}:00`;
    // console.log(test);
    let updated = `${start * 100}-${end * 100}`;
    onEditTime(updated);
  };

  const componentStyles = StyleSheet.create({
    container: {
      // height: heightCellDefault,
      width: '100%',
      // Layout
      flexDirection: 'row',
      flexWrap: 'nowrap',
      alignItems: 'center',
      justifyContent: 'flex-start',
      // Visual
      paddingHorizontal: paddingHorizontalDefault,
      zIndex: zIndex,
    },
    marginLeft: {
      marginLeft: paddingHorizontalDefault,
    },
    textColumn: {
      flex: 1,
    },
    textLabel: {
      fontSize: 14,
      color: primaryColor,
    },
    textValue: {
      height: 18,
      lineHeight: 18,
      fontSize: 14,
      textAlignVertical: 'center',
      color: blackColor,
    },
    deleteIcon: {
      width: 16,
      height: 16,
      resizeMode: 'contain',
      marginRight: paddingHorizontalDefault,
      tintColor: errorColor,
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
      {showDelete &&
        (onDeletePress ? (
          <TouchableOpacity key="delete_button" onPress={onDeletePress}>
            <Image style={componentStyles.deleteIcon} source={require('../assets/times-solid.png')} />
          </TouchableOpacity>
        ) : (
          <View key="delete_button" style={componentStyles.deleteIcon} />
        ))}
      <View style={componentStyles.textColumn}>
        <ItemPickerWithLabel
          key="start"
          label={strings.accessSchedule.startTime}
          value={start}
          setValue={setStart}
          items={getTimes()}
          onChangeValue={onEditRange}
          disabled={!edit}
          zIndex={zIndex--}
        />
        <ItemPickerWithLabel
          key="end"
          label={strings.accessSchedule.endTime}
          value={end}
          setValue={setEnd}
          items={getTimes()}
          onChangeValue={onEditRange}
          disabled={!edit}
          zIndex={zIndex--}
        />
      </View>
      {/* Only show the delete icon if there is an OnPressEdit, otherwise just reserve the space so columns line up */}
      {showEdit &&
        (onEditTime ? (
          <TouchableOpacity key="edit_button" onPress={() => setEdit(!edit)}>
            <Image style={componentStyles.editIcon} source={require('../assets/pen-solid.png')} />
          </TouchableOpacity>
        ) : (
          <View key="edit_button" style={componentStyles.editIcon} />
        ))}
    </View>
  );
}
