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
import ItemPickerWithLabel from '../components/ItemPickerWithLabel';
import ButtonStyled from '../components/ButtonStyled';
import { logStringifyPretty, modifySubscriberInformation, showGeneralError } from '../Utils';
import { handleApiError } from '../api/apiHandler';
import ItemTimeRange from '../components/ItemTimeRange';

export default function AccessSchedule({ navigation, route }) {
  let sectionZIndex = 20;
  let rangeZIndex = 100;
  const { device, deviceIndex, scheduleIndex } = route.params;
  // TODO: test data
  /*const { deviceIndex, scheduleIndex = 1 } = route.params;
  const device = {
    description: 'string',
    firstContact: 0,
    group: 'string',
    icon: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    ip: 'string',
    lastContact: 0,
    macAddress: '80:35:c1:56:7c:97',
    manufacturer: 'string',
    name: 'ABC Phone',
    schedule: {
      description: 'Parental Controls',
      created: 0,
      modified: 0,
      schedule: [
        {
          description: 'Friday Schedule',
          day: 'Friday',
          rangeList: ['800-1200', '1300-2400'],
        },
        {
          description: 'Saturday Schedule',
          day: 'Saturday',
          rangeList: ['1000-2400'],
        },
      ],
    },
    suspended: true,
  };*/
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onAddTime = () => {
    let updatedTimes = [...times];
    updatedTimes.push('0-100');
    setTimes(updatedTimes);
  };

  const onEditTime = (index, time) => {
    let updatedTimes = [...times];
    updatedTimes[index] = time;
    setTimes(updatedTimes);
  };

  const onDeleteTime = index => {
    let updatedTimes = [...times];
    updatedTimes.splice(index, 1);
    setTimes(updatedTimes);
  };

  const onCancelPress = () => {
    navigation.goBack();
  };

  const onSubmitPress = async () => {
    if (!validSchedule()) return;

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

  const validSchedule = () => {
    if (!description || !day) {
      showGeneralError(strings.errors.titleAccessScheduler, strings.errors.emptyFields);
      return false;
    } else if (!validateAccessTimes()) {
      showGeneralError(strings.errors.titleAccessScheduler, strings.errors.invalidAccessTime);
      return false;
    } else return true;
  };

  const validateAccessTimes = () => {
    return times.every(time => {
      let temp = time.split('-');
      return Number(temp[0]) < Number(temp[1]);
    });
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
                { label: strings.accessSchedule.sunday, value: strings.accessSchedule.sunday },
                { label: strings.accessSchedule.monday, value: strings.accessSchedule.monday },
                { label: strings.accessSchedule.tuesday, value: strings.accessSchedule.tuesday },
                { label: strings.accessSchedule.wednesday, value: strings.accessSchedule.wednesday },
                { label: strings.accessSchedule.thursday, value: strings.accessSchedule.thursday },
                { label: strings.accessSchedule.friday, value: strings.accessSchedule.friday },
                { label: strings.accessSchedule.saturday, value: strings.accessSchedule.saturday },
              ]}
              onChangeValue={() => {
                console.log(day);
              }}
              zIndex={20}
            />
          </AccordionSection>

          <AccordionSection
            style={StyleSheet.flatten([componentStyles.sectionAccordion, { zIndex: sectionZIndex-- }])}
            title={strings.accessSchedule.accessTimes}
            disableAccordion={true}
            isLoading={subscriberInformationLoading}
            showAdd={true}
            onAddPress={onAddTime}>
            {times.map((time, index) => (
              <ItemTimeRange
                key={'range_' + index}
                range={time}
                showEdit={true}
                onEditTime={value => onEditTime(index, value)}
                showDelete={true}
                onDeletePress={() => onDeleteTime(index)}
                zIndex={rangeZIndex--}
              />
            ))}
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
              title={Number.isInteger(scheduleIndex) ? strings.buttons.update : strings.buttons.add}
              type="filled"
              onPress={onSubmitPress}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
