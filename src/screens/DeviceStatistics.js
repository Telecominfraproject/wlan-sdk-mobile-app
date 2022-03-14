import React, { useState, useEffect, useCallback, useRef } from 'react';
import { strings } from '../localization/LocalizationStrings';
import { ScrollView, View, SafeAreaView, ActivityIndicator, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectAccessPoint } from '../store/SubscriberInformationSlice';
import { deviceStatisticsApi, handleApiError } from '../api/apiHandler';
import { scrollViewToTop, logStringifyPretty, setSubscriberInformationInterval } from '../Utils';
import { pageItemStyle, pageStyle, primaryColor } from '../AppStyle';

export default function DeviceStatistics(props) {
  // Refs
  const scrollRef = useRef();
  const isMounted = useRef(false);
  // State
  const accessPoint = useSelector(selectAccessPoint);
  const [deviceStatisticsLoading, setDeviceStatisticsLoading] = useState(false);
  const [deviceStatistics, setDeviceStatistics] = useState(null);

  // Keep track of whether the screen is mounted or not so async tasks know to access state or not.
  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  // Refresh the information only anytime there is a navigation change and this has come into focus
  // Need to be careful here as useFocusEffect is also called during re-render so it can result in
  // infinite loops.
  useFocusEffect(
    useCallback(() => {
      scrollViewToTop(scrollRef);

      // Setup the refresh interval and update the MFA at the same time
      async function getDeviceStatisticsWrapper() {
        getDeviceStatistics();
      }
      var intervalId = setSubscriberInformationInterval(getDeviceStatisticsWrapper);

      // Return function of what should be done on 'focus out'
      return () => {
        clearInterval(intervalId);
      };
      // Disable the eslint warning, as we want to change only on navigation changes
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.navigation]),
  );

  const getDeviceStatistics = async () => {
    try {
      if (!deviceStatistics) {
        setDeviceStatisticsLoading(true);
      }

      const response = await deviceStatisticsApi.getStats(accessPoint.macAddress);
      if (!response || !response.data) {
        throw new Error(strings.errors.invalidResponse);
      }

      logStringifyPretty(response.data, response.request.responseURL);

      if (isMounted.current) {
        setDeviceStatistics(response.data);
        setDeviceStatisticsLoading(false);
      }
    } catch (error) {
      // Do not report the error in this case, as it is no longer there and it is just getting state
      if (isMounted.current) {
        handleApiError('Device Statistics', error);
        setDeviceStatisticsLoading(false);
      }
    }
  };

  const getDeviceStatisticsData = () => {
    let data = [];

    if (deviceStatistics) {
      deviceStatistics.external.forEach(item => {
        let datetime = new Date(item.timestamp * 1000);
        data.push({
          label: datetime.toLocaleTimeString(),
          rx: item.rx,
          tx: item.tx,
        });
      });
    }

    return data;
  };

  return (
    <SafeAreaView style={pageStyle.safeAreaView}>
      {deviceStatisticsLoading && (
        <View style={pageItemStyle.loadingContainer}>
          <ActivityIndicator size="large" color={primaryColor} animating={deviceStatisticsLoading} />
        </View>
      )}
      <ScrollView contentContainerStyle={pageStyle.scrollView}>
        <View style={pageStyle.containerPreLogin}>
          <View style={pageItemStyle.container}>
            <Text style={pageItemStyle.description}>{strings.deviceStatistics.description}</Text>
          </View>
          <View style={pageItemStyle.container}></View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
