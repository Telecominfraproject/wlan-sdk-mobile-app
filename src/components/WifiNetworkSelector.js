import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { borderRadiusDefault, grayColor, whiteColor } from '../AppStyle';
import ButtonStyled from './ButtonStyled';
import DropDownPicker from 'react-native-dropdown-picker';

export default function WifiNetworkSelector(props) {
  const [open, setOpen] = useState(false);
  const [networkItems, setNetworkItems] = useState([]);
  const [selected, setSelected] = useState(0);
  const networks = props.networks ?? [];

  // Update network options
  useEffect(() => {
    getNetworkItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [networks]);

  const getNetworkItems = () => {
    if (networks.length > 0) {
      let items = networks.map((network, index) => ({ label: network.name, value: index }));
      setNetworkItems(items);
    } else {
      setNetworkItems([]);
    }
  };

  const getNetworkButtons = () => {
    if (networks.length > 2) {
      return (
        <DropDownPicker
          listMode={'SCROLLVIEW'}
          loading={props.loading ?? false}
          open={open}
          value={selected}
          items={networkItems}
          setOpen={setOpen}
          setValue={setSelected}
          setItems={setNetworkItems}
          style={componentStyles.dropdown}
          dropDownContainerStyle={componentStyles.dropdownContainer}
          labelStyle={componentStyles.dropdownLabel}
          onChangeValue={value => onSelect(value)}
        />
      );
    } else {
      return networks.map((network, index) => (
        <ButtonStyled
          style={componentStyles.buttons}
          key={index}
          title={network.name}
          type={selected === index ? 'filled' : 'outline'}
          size={'small'}
          onPress={() => {
            if (selected !== index) {
              onSelect(index);
            }
          }}
        />
      ));
    }
  };

  const onSelect = index => {
    setSelected(index);
    if (props.onSelect) {
      props.onSelect(networks[index]);
    }
  };

  // Styles
  const componentStyles = StyleSheet.create({
    container: {
      flexDirection: 'row',
    },
    buttons: {
      flex: 1,
    },
    dropdown: {
      borderWidth: 0,
      borderRadius: borderRadiusDefault,
      paddingHorizontal: 0,
    },
    dropdownContainer: {
      borderWidth: 1,
      borderRadius: 0,
      backgroundColor: whiteColor,
      borderColor: grayColor,
    },
    dropdownLabel: {
      fontSize: 16,
      textAlign: 'center',
    },
  });

  return <View style={componentStyles.container}>{getNetworkButtons()}</View>;
}
