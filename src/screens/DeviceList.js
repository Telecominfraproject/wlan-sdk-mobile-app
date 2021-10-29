import React, { useState, useEffect } from 'react';
import { strings } from '../localization/LocalizationStrings';
import { pageStyle, pageItemStyle } from '../AppStyle';
import { View, Text, FlatList } from 'react-native';
import { devicesApi, handleApiError } from '../api/apiHandler';
import DeviceItem from '../components/DeviceItem';

const DeviceList = props => {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    getDevices();
  }, []);

  const onDevicePress = async () => {
    props.navigation.navigate('DeviceDetails');
  };

  const getDevices = async () => {
    try {
      const response = await devicesApi.getDeviceList();
      setDevices(response.data.devices);
      console.log(response.data);
    } catch (error) {
      handleApiError(strings.errors.titleDeviceList, error);
    }
  };

  return (
    <View style={pageStyle.container}>
      <View style={pageItemStyle.container}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Devices</Text>
      </View>
      <View style={pageItemStyle.container}>
        <FlatList data={devices} renderItem={({ item }) => <DeviceItem device={item} onPress={onDevicePress} />} />
      </View>
    </View>
  );
};

export default DeviceList;
