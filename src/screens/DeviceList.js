import React, { useState, useEffect } from 'react';
import { strings } from '../localization/LocalizationStrings';
import { pageStyle } from '../AppStyle';
import { View, ScrollView, SafeAreaView } from 'react-native';
import { devicesApi, handleApiError } from '../api/apiHandler';
import DeviceItem from '../components/DeviceItem';
import AccordionSection from '../components/AccordionSection';

const DeviceList = props => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDevices();
    return () => {
      setDevices([]);
    };
  }, []);

  const onDevicePress = async () => {
    props.navigation.navigate('DeviceDetails');
  };

  const getDevices = async () => {
    try {
      setLoading(true);
      const response = await devicesApi.getDeviceList();
      setDevices(response.data.devices);
      console.log(response.data);
    } catch (error) {
      handleApiError(strings.errors.titleDeviceList, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={pageStyle.safeAreaView}>
      <ScrollView contentContainerStyle={pageStyle.scrollView}>
        <View style={pageStyle.container}>
          <AccordionSection title="Devices" isLoading={loading}>
            {devices.map(item => {
              return <DeviceItem device={item} onPress={onDevicePress} key={item.UUID} />;
            })}
          </AccordionSection>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DeviceList;
