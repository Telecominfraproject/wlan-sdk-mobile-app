import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { strings } from '../localization/LocalizationStrings';
import {
  marginTopDefault,
  paddingHorizontalDefault,
  heightCellDefault,
  primaryColor,
  pageStyle,
  pageItemStyle,
  paddingVerticalDefault,
} from '../AppStyle';
import { StyleSheet, SafeAreaView, View, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { showGeneralMessage, completeSignOut, setSubscriberInformationInterval } from '../Utils';
import { getCredentials, handleApiError } from '../api/apiHandler';
import { MfaAuthInfoMethodEnum } from '../api/generated/owSecurityApi';
import { selectSubscriberInformation } from '../store/SubscriberInformationSlice';
import { selectSubscriberInformationLoading } from '../store/SubscriberInformationLoadingSlice';
import { displayValue, modifySubscriberInformation } from '../Utils';
import AccordionSection from '../components/AccordionSection';
import ButtonStyled from '../components/ButtonStyled';
import ItemTextWithIcon from '../components/ItemTextWithIcon';
import ItemTextWithLabel from '../components/ItemTextWithLabel';
import ItemTextWithLabelEditable from '../components/ItemTextWithLabelEditable';
import ItemPickerWithLabel from '../components/ItemPickerWithLabel';

const Profile = props => {
  const subscriberInformation = useSelector(selectSubscriberInformation);
  const subscriberInformationLoading = useSelector(selectSubscriberInformationLoading);
  const [mfaValue, setMfaValue] = useState('off');

  // Refresh the information only anytime there is a navigation change and this has come into focus
  // Need to be careful here as useFocusEffect is also called during re-render so it can result in
  // infinite loops.
  useFocusEffect(
    useCallback(() => {
      var intervalId = setSubscriberInformationInterval(subscriberInformation, null);

      // Return function of what should be done on 'focus out'
      return () => {
        clearInterval(intervalId);
      };
      // Disable the eslint warning, as we want to change only on navigation changes
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.navigation]),
  );

  const onEditUserInformation = async val => {
    try {
      await modifySubscriberInformation(val);
    } catch (error) {
      handleApiError(strings.errors.titleUpdate, error);
      // Need to throw the error to ensure the caller cleans up
      throw error;
    }
  };

  const onEditUserInformationMobile = async phoneInfo => {
    if (phoneInfo) {
      // Phone info will be of the format {'phone_<n>' : "<phone number>"}, need to parse out the values
      // Only expect one, but this will handle multiple
      for (const value of Object.values(phoneInfo)) {
        sendSmsCode(value);
      }
    }
  };

  const sendSmsCode = async phone => {
    try {
      // TODO: Need updated API
      //const response = await emailApi.sendATestSMS(true, undefined, undefined, { to: phone });
      //logStringifyPretty(response.data);
      showGeneralMessage(strings.messages.codeSent);

      // Navigate to the Phone Verification
      props.navigation.navigate('PhoneVerification', { phone });
    } catch (err) {
      handleApiError(strings.errors.titleSms, err);
    }
  };

  const onMfaChange = async method => {
    // TODO: Need updated API
    const proprietaryInfo = {
      mfa: {
        enabled: false,
        method: null,
      },
    };

    switch (method) {
      case MfaAuthInfoMethodEnum.Sms:
      case MfaAuthInfoMethodEnum.Email:
      case MfaAuthInfoMethodEnum.Voice:
        proprietaryInfo.mfa.enabled = true;
        proprietaryInfo.mfa.method = method;
        break;

      default:
        proprietaryInfo.mfa.enabled = false;
        proprietaryInfo.mfa.method = null;
    }

    //onEditUserInformation({ userTypeProprietaryInfo: proprietaryInfo });
  };

  const onChangePasswordPress = async () => {
    const credentials = await getCredentials();
    props.navigation.navigate('ChangePassword', {
      userId: credentials.username,
    });
  };

  const onSignOutPress = async () => {
    completeSignOut(props.navigation);
  };

  // Notifications
  const onNotificationPrefPress = () => {};
  const onNotificationHistoryPress = () => {};

  // Styles
  const componentStyles = StyleSheet.create({
    section: {
      marginTop: marginTopDefault,
    },
    accountSection: {
      marginTop: marginTopDefault,
    },
    item: {
      paddingVertical: paddingVerticalDefault,
      paddingHorizontal: paddingHorizontalDefault,
      minHeight: heightCellDefault,
    },
    label: {
      fontSize: 11,
      color: primaryColor,
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
        <View style={pageStyle.container}>
          <AccordionSection
            style={componentStyles.accountSection}
            title={strings.profile.accountInfo}
            isLoading={subscriberInformationLoading}
            disableAccordion={true}>
            <ItemTextWithLabelEditable
              key="firstName"
              label={strings.profile.firstName}
              value={displayValue(subscriberInformation, 'firstName')}
              editKey="firstName"
              onEdit={onEditUserInformation}
            />
            <ItemTextWithLabelEditable
              key="lastName"
              label={strings.profile.lastName}
              value={displayValue(subscriberInformation, 'lastName')}
              editKey="lastName"
              onEdit={onEditUserInformation}
            />
            <ItemTextWithLabel
              key="email"
              label={strings.profile.email}
              value={displayValue(subscriberInformation, 'userId')}
            />
            <ItemTextWithLabelEditable
              key="phoneNumber"
              label={strings.profile.phone}
              value={displayValue(subscriberInformation, 'phoneNumber')}
              editKey="phoneNumber"
              onEdit={onEditUserInformationMobile}
            />
            <ItemPickerWithLabel
              key="mfa"
              label={strings.profile.mfa}
              value={mfaValue}
              setValue={setMfaValue}
              items={[
                { label: strings.profile.off, value: 'off' },
                { label: strings.profile.email, value: MfaAuthInfoMethodEnum.Email },
                { label: strings.profile.sms, value: MfaAuthInfoMethodEnum.Sms },
              ]}
              onChangeValue={onMfaChange}
            />
          </AccordionSection>

          {/* Buttons */}
          <View style={pageItemStyle.containerButtons}>
            <ButtonStyled
              style={componentStyles.buttonLeft}
              title={strings.buttons.changePassword}
              type="outline"
              onPress={onChangePasswordPress}
            />
            <ButtonStyled
              style={componentStyles.buttonRight}
              title={strings.buttons.signOut}
              type="outline"
              onPress={onSignOutPress}
            />
          </View>

          {/* Notifications */}
          <AccordionSection
            style={componentStyles.section}
            title={strings.profile.notifications}
            isLoading={false}
            disableAccordion={true}>
            <ItemTextWithIcon key="prefs" label={strings.profile.notificationPref} onPress={onNotificationPrefPress} />
            <ItemTextWithIcon
              key="history"
              label={strings.profile.notificationHistory}
              onPress={onNotificationHistoryPress}
            />
          </AccordionSection>

          {/* App */}
          <AccordionSection
            style={componentStyles.section}
            title={strings.profile.app}
            isLoading={false}
            disableAccordion={true}>
            <ItemTextWithLabel key="version" label={strings.profile.version} value="V1.0.0" />
          </AccordionSection>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
