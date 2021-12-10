import React, { useState, useRef } from 'react';
import { StyleSheet, ScrollView, View, SafeAreaView } from 'react-native';
import { strings } from '../localization/LocalizationStrings';
import { pageItemStyle, pageStyle, paddingHorizontalDefault, marginTopDefault } from '../AppStyle';
import { useSelector } from 'react-redux';
import { selectCurrentAccessPointId, selectSubscriberInformation } from '../store/SubscriberInformationSlice';
import { handleApiError } from '../api/apiHandler';
import { updateSubscriberIpReservation, addSubscriberIpReservation } from '../Utils';
import AccordionSection from '../components/AccordionSection';
import ButtonStyled from '../components/ButtonStyled';
import ItemTextWithLabelEditable from '../components/ItemTextWithLabelEditable';

export default function IpReservationAddEdit(props) {
  const reservation = props.route.params ? props.route.params.reservation : null;
  // The sectionZIndex is used to help with any embedded picker/dropdown. Start with a high enough
  // value that it'll cover each section. The sections further up the view should have higher numbers
  var sectionZIndex = 20;
  // Need to use refs so that the async tasks can have proper access to these state changes
  const scrollRef = useRef();
  // States
  const [loading, setLoading] = useState(false);
  const [ipAddress, setIpAddress] = useState(reservation ? reservation.ipAddress : null);
  const [macAddress, setMacAddress] = useState(reservation ? reservation.macAddress : null);
  const [nickname, setNickname] = useState(reservation ? reservation.nickname : null);
  const currentAccessPointId = useSelector(selectCurrentAccessPointId);
  const subscriberInformation = useSelector(selectSubscriberInformation);

  const onCancelPress = () => {
    props.navigation.goBack();
  };

  const onSubmitPress = async () => {
    try {
      let reservationJsonObject = {
        ipAddress: ipAddress,
        macAddress: macAddress,
        nickname: nickname,
      };

      setLoading(true);

      if (reservation) {
        await updateSubscriberIpReservation(
          subscriberInformation,
          currentAccessPointId,
          ipAddress,
          reservationJsonObject,
        );
      } else {
        await addSubscriberIpReservation(subscriberInformation, currentAccessPointId, reservationJsonObject);
      }

      // On success just go back
      props.navigation.goBack();
    } catch (error) {
      setLoading(false);

      handleApiError(strings.errors.titleIpReservation, error);
      // Need to throw the error to ensure the caller cleans up
      throw error;
    } finally {
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
      <ScrollView ref={scrollRef} contentContainerStyle={pageStyle.scrollView}>
        <View style={pageStyle.containerPostLogin}>
          <AccordionSection
            style={StyleSheet.flatten([componentStyles.sectionAccordion, { zIndex: sectionZIndex-- }])}
            title={strings.ipReservation.title}
            disableAccordion={true}
            isLoading={loading}>
            <ItemTextWithLabelEditable
              key="ipAddress"
              label={strings.placeholders.ipAddress}
              type="ipv4"
              value={ipAddress}
              placeholder={strings.messages.empty}
              onEdit={setIpAddress}
            />
            <ItemTextWithLabelEditable
              key="macAddress"
              label={strings.placeholders.macAddress}
              type="mac"
              value={macAddress}
              placeholder={strings.messages.empty}
              onEdit={setMacAddress}
            />
            <ItemTextWithLabelEditable
              key="nickname"
              label={strings.placeholders.nickname}
              value={nickname}
              placeholder={strings.messages.empty}
              onEdit={setNickname}
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
              title={reservation ? strings.buttons.update : strings.buttons.add}
              type="filled"
              onPress={onSubmitPress}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
