import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, SafeAreaView, TextInput, ActivityIndicator } from 'react-native';
import { updateSubscriberIpReservation, addSubscriberIpReservation } from '../Utils';
import { strings } from '../localization/LocalizationStrings';
import { pageItemStyle, pageStyle, primaryColor, paddingHorizontalDefault } from '../AppStyle';
import { useSelector } from 'react-redux';
import { selectCurrentAccessPointId } from '../store/CurrentAccessPointIdSlice';
import { selectSubscriberInformation } from '../store/SubscriberInformationSlice';
import { handleApiError } from '../api/apiHandler';
import ButtonStyled from '../components/ButtonStyled';

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
          <TextInput
            style={pageItemStyle.inputText}
            placeholder={strings.placeholders.ipAddress}
            value={ipAddress}
            onChangeText={text => setIpAddress(text)}
            autoCapitalize="none"
          />
          <TextInput
            style={pageItemStyle.inputText}
            placeholder={strings.placeholders.macAddress}
            value={macAddress}
            onChangeText={text => setMacAddress(text)}
            autoCapitalize="none"
          />
          <TextInput
            style={pageItemStyle.inputText}
            placeholder={strings.placeholders.nickname}
            value={nickname}
            onChangeText={text => setNickname(text)}
          />

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
