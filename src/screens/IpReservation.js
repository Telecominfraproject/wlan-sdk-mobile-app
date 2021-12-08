import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, SafeAreaView, ActivityIndicator } from 'react-native';
import { updateSubscriberIpReservation, addSubscriberIpReservation } from '../Utils';
import { strings } from '../localization/LocalizationStrings';
import { pageItemStyle, pageStyle, primaryColor, paddingHorizontalDefault, marginTopDefault } from '../AppStyle';
import { useSelector } from 'react-redux';
import { selectCurrentAccessPointId } from '../store/CurrentAccessPointIdSlice';
import { selectSubscriberInformation } from '../store/SubscriberInformationSlice';
import { handleApiError } from '../api/apiHandler';
import ButtonStyled from '../components/ButtonStyled';
import AccordionSection from '../components/AccordionSection';
import ItemTextWithLabelEditable from '../components/ItemTextWithLabelEditable';

export default function IpReservation(props) {
  const reservation = props.route.params ? props.route.params.reservation : null;
  const [loading, setLoading] = useState(false);
  const currentAccessPointId = useSelector(selectCurrentAccessPointId);
  const [ipAddress, setIpAddress] = useState(reservation ? reservation.ipAddress : null);
  const [macAddress, setMacAddress] = useState(reservation ? reservation.macAddress : null);
  const [nickname, setNickname] = useState(reservation ? reservation.nickname : null);
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
      {loading && (
        <View style={pageItemStyle.loadingContainer}>
          <ActivityIndicator size="large" color={primaryColor} animating={loading} />
        </View>
      )}
      <ScrollView contentContainerStyle={pageStyle.scrollView}>
        <View style={pageStyle.containerPostLogin}>
          <AccordionSection
            style={componentStyles.sectionAccordion}
            title={strings.ipReservation.title}
            disableAccordion={true}
            isLoading={false}>
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
