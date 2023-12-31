import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, ScrollView, View, SafeAreaView } from 'react-native';
import { strings } from '../localization/LocalizationStrings';
import { pageItemStyle, pageStyle, paddingHorizontalDefault, marginTopDefault } from '../AppStyle';
import { useSelector } from 'react-redux';
import { selectCurrentAccessPointId, selectIpReservations } from '../store/SubscriberInformationSlice';
import { handleApiError } from '../api/apiHandler';
import { modifySubscriberIpReservation, addSubscriberIpReservation } from '../Utils';
import AccordionSection from '../components/AccordionSection';
import ButtonStyled from '../components/ButtonStyled';
import ItemTextWithLabelEditable from '../components/ItemTextWithLabelEditable';

export default function IpReservationAddEdit(props) {
  // The sectionZIndex is used to help with any embedded picker/dropdown. Start with a high enough
  // value that it'll cover each section. The sections further up the view should have higher numbers
  var sectionZIndex = 20;
  // Refs
  const scrollRef = useRef();
  const isMounted = useRef(false);
  // Params
  const reservationIndex = props.route.params ? props.route.params.reservationIndex : null;
  // States
  const currentAccessPointId = useSelector(selectCurrentAccessPointId);
  const ipReservations = useSelector(selectIpReservations);
  const reservation =
    reservationIndex !== null && ipReservations && ipReservations.reservations
      ? ipReservations.reservations[reservationIndex]
      : null;
  const [loading, setLoading] = useState(false);
  const [ipAddress, setIpAddress] = useState(reservation ? reservation.ipAddress : null);
  const [macAddress, setMacAddress] = useState(reservation ? reservation.macAddress : null);
  const [nickname, setNickname] = useState(reservation ? reservation.nickname : null);

  // Keep track of whether the screen is mounted or not so async tasks know to access state or not.
  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

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

      if (reservationIndex !== null) {
        await modifySubscriberIpReservation(currentAccessPointId, reservationIndex, reservationJsonObject);
      } else {
        await addSubscriberIpReservation(currentAccessPointId, reservationJsonObject);
      }

      if (isMounted.current) {
        // On success just go back
        props.navigation.goBack();
      }
    } catch (error) {
      if (isMounted.current) {
        setLoading(false);
        handleApiError(strings.errors.titleIpReservationModify, error, props.navigation);
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
      <ScrollView ref={scrollRef} contentContainerStyle={pageStyle.scrollView}>
        <View style={pageStyle.containerPostLogin}>
          <AccordionSection
            style={StyleSheet.flatten([componentStyles.sectionAccordion, { zIndex: sectionZIndex-- }])}
            title={strings.ipReservation.title}
            disableAccordion={true}
            isLoading={loading}>
            <ItemTextWithLabelEditable
              key="ipAddress"
              label={strings.placeholders.ipAddressV4V6}
              value={ipAddress}
              placeholder={strings.messages.empty}
              type="ipV4|ipV6"
              onEdit={setIpAddress}
            />
            <ItemTextWithLabelEditable
              key="macAddress"
              label={strings.placeholders.macAddress}
              value={macAddress}
              placeholder={strings.messages.empty}
              type="macAllowSeparators"
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
