import React, { useEffect, useRef, useState } from 'react';
import { marginTopDefault, paddingHorizontalDefault, pageItemStyle, pageStyle } from '../AppStyle';
import AccordionSection from '../components/AccordionSection';
import { strings } from '../localization/LocalizationStrings';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  selectAccessPoint,
  selectSubscriberInformation,
  selectSubscriberInformationLoading,
} from '../store/SubscriberInformationSlice';
import ItemTextWithLabelEditable from '../components/ItemTextWithLabelEditable';
import ItemColumnsWithValues from '../components/ItemColumnsWithValues';
import ItemPickerWithLabel from '../components/ItemPickerWithLabel';
import ButtonStyled from '../components/ButtonStyled';
import { logStringifyPretty, modifySubscriberInformation } from '../Utils';
import { handleApiError } from '../api/apiHandler';

export default function AccessSchedule({ navigation, route }) {
  const { device, deviceIndex, scheduleIndex } = route.params;
  const isMounted = useRef(false);
  const accessPoint = useSelector(selectAccessPoint);
  const subscriberInformation = useSelector(selectSubscriberInformation);
  const subscriberInformationLoading = useSelector(selectSubscriberInformationLoading);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState();
  const [day, setDay] = useState();
  const [times, setTimes] = useState([]);

  // Keep track of whether the screen is mounted or not so async tasks know to access state or not.
  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    let schedule = device.schedule && device.schedule.schedule && device.schedule.schedule[scheduleIndex];
    if (schedule) {
      setDescription(schedule.description);
      setDay(schedule.day);
      setTimes(schedule.rangeList);
    }
  }, [device, scheduleIndex]);

  const onCancelPress = () => {
    navigation.goBack();
  };

  const onSubmitPress = async () => {
    try {
      setLoading(true);

      // subscriber info json
      let updatedSubscriber = JSON.parse(JSON.stringify(subscriberInformation));

      // subscriber device json
      let subscriberDevice = JSON.parse(JSON.stringify(device));
      let accessTimes = subscriberDevice.schedule;
      let schedule = accessTimes.schedule;

      if (!schedule) {
        console.error('No SubscriberDevice.schedule.schedule found');
        return;
      }

      // update device schedule
      let accessTime = { description, day, rangeList: times };
      if (Number.isInteger(scheduleIndex)) {
        schedule[scheduleIndex] = accessTime;
      } else {
        schedule.push(accessTime);
      }

      // update subscriber info with updated device json
      const accessPointIndex = subscriberInformation.accessPoints.list.findIndex(ap => ap.id === accessPoint.id) || 0;
      if (deviceIndex) {
        updatedSubscriber.accessPoints.list[accessPointIndex].subscriberDevices.devices[deviceIndex] = subscriberDevice;
      } else updatedSubscriber.accessPoints.list[accessPointIndex].subscriberDevices.devices[0] = subscriberDevice;

      logStringifyPretty(updatedSubscriber);
      await modifySubscriberInformation(updatedSubscriber);

      if (isMounted.current) {
        // On success just go back
        navigation.goBack();
      }
    } catch (e) {
      handleApiError(strings.errors.titleAccessScheduler, e);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
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
            style={StyleSheet.flatten([componentStyles.sectionAccordion, { zIndex: 1 }])}
            title={strings.accessSchedule.accessSchedule}
            disableAccordion={true}
            isLoading={loading}>
            <ItemTextWithLabelEditable
              key="description"
              label={strings.accessSchedule.description}
              value={description}
              onEdit={val => setDescription(val)}
            />

            <ItemPickerWithLabel
              key="day"
              label={strings.accessSchedule.day}
              value={day}
              setValue={setDay}
              items={[
                { label: strings.accessSchedule.monday, value: strings.accessSchedule.monday },
                { label: strings.accessSchedule.tuesday, value: strings.accessSchedule.tuesday },
                { label: strings.accessSchedule.wednesday, value: strings.accessSchedule.wednesday },
                { label: strings.accessSchedule.thursday, value: strings.accessSchedule.thursday },
                { label: strings.accessSchedule.friday, value: strings.accessSchedule.friday },
                { label: strings.accessSchedule.saturday, value: strings.accessSchedule.saturday },
                { label: strings.accessSchedule.sunday, value: strings.accessSchedule.sunday },
              ]}
              onChangeValue={() => {
                console.log(day);
              }}
              zIndex={20}
            />
          </AccordionSection>

          <AccordionSection
            style={componentStyles.sectionAccordion}
            title={strings.accessSchedule.accessTimes}
            disableAccordion={true}
            isLoading={subscriberInformationLoading}
            showAdd={true}
            onAddPress={() => {
              navigation.navigate('AccessTimeRange', { day, description, macAddress: device.macAddress });
            }}>
            {times.map((item, index) => {
              let result = [
                <ItemColumnsWithValues
                  key={'range_' + index}
                  type="value"
                  values={[item]}
                  showDelete={true}
                  onDeletePress={() => {}}
                  showEdit={true}
                  onEditPress={() => {}}
                />,
              ];

              if (index === 0) {
                // Add in a header to the start of the array if this is the first index
                result.unshift(
                  <ItemColumnsWithValues
                    key="label"
                    type="label"
                    values={[strings.accessSchedule.ranges]}
                    showDelete={true}
                    showEdit={true}
                  />,
                );
              }

              return result;
            })}
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
              title={scheduleIndex && Number.isInteger(scheduleIndex) ? strings.buttons.update : strings.buttons.add}
              type="filled"
              onPress={onSubmitPress}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
