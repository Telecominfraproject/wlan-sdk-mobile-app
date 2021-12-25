import React, { useMemo, useState } from 'react';
import { marginTopDefault, paddingHorizontalDefault, pageItemStyle, pageStyle } from '../AppStyle';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  selectSubscriberDevices,
  selectSubscriberInformation,
  selectSubscriberInformationLoading,
} from '../store/SubscriberInformationSlice';
import { strings } from '../localization/LocalizationStrings';
import AccordionSection from '../components/AccordionSection';
import ItemPickerWithLabel from '../components/ItemPickerWithLabel';
import { getSubscriberDeviceIndexForMac, logStringifyPretty } from '../Utils';
import ButtonStyled from '../components/ButtonStyled';

export default function AccessTimeRange({ navigation, route }) {
  const { macAddress, description, day, rangeIndex } = route.params;
  let sectionZIndex = 20;
  let pickerZIndex = 20;

  // states
  const [loading, setLoading] = useState(false);
  const [start, setStart] = useState();
  const [end, setEnd] = useState();
  const [range, setRange] = useState();
  const subscriberInformation = useSelector(selectSubscriberInformation);
  const subscriberInformationLoading = useSelector(selectSubscriberInformationLoading);
  const subscriberDevices = useSelector(selectSubscriberDevices);
  const subscriberDeviceIndex = useMemo(
    () => getSubscriberDeviceIndexForMac(subscriberDevices, macAddress),
    [subscriberDevices, macAddress],
  );
  const subscriberDevice = useMemo(() => {
    if (subscriberDevices !== null && subscriberDeviceIndex !== null) {
      return subscriberDevices.devices[subscriberDeviceIndex];
    }
  }, [subscriberDevices, subscriberDeviceIndex]);

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
      let updated = `${start}:00 - ${end}:00`;
      console.log(updated);
      setRange(updated);
    }
  };

  const onCancelPress = () => {
    navigation.goBack();
  };
  const onSubmitPress = () => {
    if (start >= end) {
      console.error('End time must be greater than start time.');
      return;
    }
    // TODO update subscriber device
  };

  // Styles
  const componentStyles = StyleSheet.create({
    sectionAccordion: {
      marginTop: marginTopDefault,
    },
    buttonLeft: {
      marginRight: paddingHorizontalDefault / 2,
      flex: 1,
    },
    buttonRight: {
      marginLeft: paddingHorizontalDefault / 2,
      flex: 1,
    },
  });

  return (
    <SafeAreaView style={pageStyle.safeAreaView}>
      <ScrollView contentContainerStyle={pageStyle.scrollView}>
        <View style={pageStyle.containerPostLogin}>
          <AccordionSection
            style={StyleSheet.flatten([componentStyles.sectionAccordion, { zIndex: sectionZIndex-- }])}
            title={strings.accessSchedule.editRange}
            disableAccordion={true}
            isLoading={loading}>
            <ItemPickerWithLabel
              key="start"
              label={strings.accessSchedule.startTime}
              value={start}
              setValue={setStart}
              items={getTimes()}
              onChangeValue={onEditRange}
              zIndex={pickerZIndex--}
            />
            <ItemPickerWithLabel
              key="end"
              label={strings.accessSchedule.endTime}
              value={end}
              setValue={setEnd}
              items={getTimes()}
              onChangeValue={onEditRange}
              zIndex={pickerZIndex--}
            />
          </AccordionSection>

          <View style={pageItemStyle.containerButtons}>
            <ButtonStyled
              style={componentStyles.buttonLeft}
              title={strings.buttons.cancel}
              type="outline"
              onPress={onCancelPress}
            />
            <ButtonStyled
              style={componentStyles.buttonRight}
              title={rangeIndex && Number.isInteger(rangeIndex) ? strings.buttons.update : strings.buttons.add}
              type="filled"
              onPress={onSubmitPress}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
