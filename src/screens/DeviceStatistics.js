import React, { useState, useEffect, useCallback, useRef } from 'react';
import { strings } from '../localization/LocalizationStrings';
import { StyleSheet, ScrollView, View, SafeAreaView, ActivityIndicator, Text, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectAccessPoint } from '../store/SubscriberInformationSlice';
import { deviceStatisticsApi, handleApiError } from '../api/apiHandler';
import { scrollViewToTop, logStringifyPretty, setSubscriberInformationInterval, formatBytes } from '../Utils';
import {
  pageItemStyle,
  pageStyle,
  primaryColor,
  blackColor,
  whiteColor,
  borderRadiusDefault,
  paddingHorizontalDefault,
  marginTopDefault,
  cellHeightDefault,
} from '../AppStyle';
import { VictoryChart, VictoryBar, VictoryTheme, VictoryTooltip, VictoryAxis } from 'victory-native';

export default function DeviceStatistics(props) {
  // Refs
  const scrollRef = useRef();
  const isMounted = useRef(false);
  const errorReported = useRef(false);
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

      // Setup the refresh interval and update the device statistics at the same time
      let intervalId = setSubscriberInformationInterval(getDeviceStatistics);

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
        // Clear the error reported flag
        errorReported.current = false;
      }
    } catch (error) {
      // Do not report the error in this case, as it is no longer there and it is just getting state
      if (isMounted.current) {
        // Only report the first error
        if (!errorReported.current) {
          handleApiError(strings.errors.titleDeviceStatistics, error);
          errorReported.current = true;
        }
        setDeviceStatisticsLoading(false);
      }
    }
  };

  const getDeviceStatisticsData = () => {
    if (deviceStatistics) {
      return deviceStatistics.external;
    }

    return [];
  };

  function formatTime(timestamp) {
    let datetime = new Date(timestamp * 1000);
    if (datetime) {
      let timeString = datetime.toLocaleTimeString();

      // Remove seconds from the time if it matches one of expected patterns
      let timeRegex = new RegExp(/^(\d)?\d:\d\d:\d\d/);
      if (timeString && timeRegex.test(timeString)) {
        return timeString.replace(/:\d\d($| )/, ' ').trim();
      } else {
        return timeString;
      }
    }

    return '-';
  }

  const getTickValues = key => {
    if (deviceStatistics && deviceStatistics.external) {
      let max = 0;
      deviceStatistics.external.forEach(item => {
        if (item[key] > max) {
          max = item[key];
        }
      });

      // Calculate the best gap size based on 1024
      let tickCount = 6;
      let gap = Math.round(max / 1024 / tickCount);
      let gapSize = gap * 1024;
      let tickValues = [];

      for (let i = 0; i < tickCount; i++) {
        tickValues.push(gapSize * (i + 1));
      }

      return tickValues;
    }

    return [];
  };

  const componentStyles = StyleSheet.create({
    containerChart: {
      width: '100%',
      marginTop: marginTopDefault,
      backgroundColor: whiteColor,
      borderRadius: borderRadiusDefault,
    },
    headerChart: {
      height: cellHeightDefault,
      width: '100%',
      // Layout
      flexDirection: 'row',
      flexWrap: 'nowrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: paddingHorizontalDefault,
      // Visual
      backgroundColor: primaryColor,
      borderTopLeftRadius: borderRadiusDefault,
      borderTopRightRadius: borderRadiusDefault,
    },
    headerChartText: {
      fontSize: 12,
      textTransform: 'uppercase',
      color: whiteColor,
    },
    chartPadding: {
      top: marginTopDefault,
      left: 60,
      bottom: 60,
      right: 20,
    },
    chartStyle: {
      data: { fill: primaryColor },
      labels: { fill: primaryColor },
    },
    axisXStyle: {
      axis: { stroke: blackColor, strokeWidth: 1 },
      ticks: { stroke: blackColor, strokeWidth: 1 },
      tickLabels: { fill: blackColor, angle: 90, dx: 15, dy: -5 },
      grid: { stroke: 'none' },
    },
    axisYStyle: {
      axis: { stroke: blackColor, strokeWidth: 1 },
      ticks: { stroke: blackColor, strokeWidth: 1 },
      tickLabels: { fill: blackColor },
      grid: { stroke: 'none' },
    },
  });

  return (
    <SafeAreaView style={pageStyle.safeAreaView}>
      {deviceStatisticsLoading && (
        <View style={pageItemStyle.loadingContainer}>
          <ActivityIndicator size="large" color={primaryColor} animating={deviceStatisticsLoading} />
        </View>
      )}
      <ScrollView contentContainerStyle={pageStyle.scrollView}>
        <View style={pageStyle.containerPostLogin}>
          <View style={componentStyles.containerChart}>
            <View style={componentStyles.headerChart}>
              <Text style={componentStyles.headerChartText}>{strings.deviceStatistics.titleExternalDataReceive}</Text>
            </View>
            <VictoryChart
              padding={componentStyles.chartPadding}
              domainPadding={{ x: [0, paddingHorizontalDefault] }}
              width={Dimensions.get('window').width - paddingHorizontalDefault * 4}
              height={Dimensions.get('window').height / 3}
              theme={VictoryTheme.material}>
              <VictoryBar
                style={componentStyles.chartStyle}
                data={getDeviceStatisticsData()}
                alignment="start"
                barRatio={0.95}
                x="timestamp"
                y="rx"
                labelComponent={<VictoryTooltip renderInPortal={false} />}
              />
              <VictoryAxis style={componentStyles.axisXStyle} fixLabelOverlap={true} tickFormat={t => formatTime(t)} />
              <VictoryAxis
                style={componentStyles.axisYStyle}
                dependentAxis
                crossAxis={false}
                tickValues={getTickValues('rx')}
                tickFormat={t => formatBytes(t, 0)}
              />
            </VictoryChart>
          </View>
          <View style={[componentStyles.containerChart]}>
            <View style={componentStyles.headerChart}>
              <Text style={componentStyles.headerChartText}>{strings.deviceStatistics.titleExternalDataTransmit}</Text>
            </View>
            <VictoryChart
              padding={componentStyles.chartPadding}
              domainPadding={{ x: [0, paddingHorizontalDefault] }}
              width={Dimensions.get('window').width - paddingHorizontalDefault * 4}
              height={Dimensions.get('window').height / 3}
              theme={VictoryTheme.material}>
              <VictoryBar
                style={componentStyles.chartStyle}
                data={getDeviceStatisticsData()}
                alignment="start"
                barRatio={0.95}
                x="timestamp"
                y="tx"
                labelComponent={<VictoryTooltip renderInPortal={false} />}
              />
              <VictoryAxis style={componentStyles.axisXStyle} fixLabelOverlap={true} tickFormat={t => formatTime(t)} />
              <VictoryAxis
                style={componentStyles.axisYStyle}
                dependentAxis
                crossAxis={false}
                tickValues={getTickValues('tx')}
                tickFormat={t => formatBytes(t, 0)}
              />
            </VictoryChart>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
