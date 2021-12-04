import React, { useCallback, useState } from 'react';
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
import { showGeneralMessage, completeSignOut, logStringifyPretty, showGeneralError } from '../Utils';
import { getCredentials, handleApiError, mfaApi } from '../api/apiHandler';
import { selectSubscriberInformation } from '../store/SubscriberInformationSlice';
import { selectSubscriberInformationLoading } from '../store/SubscriberInformationLoadingSlice';
import { displayValue, modifySubscriberInformation } from '../Utils';
import AccordionSection from '../components/AccordionSection';
import ButtonStyled from '../components/ButtonStyled';
import ItemTextWithIcon from '../components/ItemTextWithIcon';
import ItemTextWithLabel from '../components/ItemTextWithLabel';
import ItemTextWithLabelEditable from '../components/ItemTextWithLabelEditable';
import ItemPickerWithLabel from '../components/ItemPickerWithLabel';
import { useFocusEffect } from '@react-navigation/native';
import { SubMfaConfigTypeEnum } from '../api/generated/owUserPortalApi';

const Profile = props => {
  const subscriberInformation = useSelector(selectSubscriberInformation);
  const subscriberInformationLoading = useSelector(selectSubscriberInformationLoading);
  const [mfaValue, setMfaValue] = useState(SubMfaConfigTypeEnum.Disabled);

  useFocusEffect(
    useCallback(() => {
      getMFA();
      // Return function of what should be done on 'focus out'
      return () => {};
    }, []),
  );

  const getMFA = async () => {
    try {
      const response = await mfaApi.getMFS();
      if (response && response.data) {
        logStringifyPretty(response.data, response.request.responseURL);
        // TODO setMfaValue response result
      } else {
        console.log(response);
        console.error('Invalid response from getMFS');
        showGeneralError(strings.errors.titleMfa, strings.errors.invalidResponse);
      }
    } catch (error) {
      handleApiError(strings.errors.titleMfa, error);
    }
  };

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
      let mfaConfig = {
        id: subscriberInformation.id,
        type: mfaValue,
        email: subscriberInformation.userId,
        sms: phone,
      };
      // start validation
      const response = await mfaApi.modifyMFS(true, undefined, undefined, mfaConfig);
      if (response && response.data) {
        logStringifyPretty(response.data, response.request.responseURL);
        showGeneralMessage(response.data.Details);

        // Navigate to the Phone Verification
        props.navigation.navigate('PhoneVerification', { mfaConfig });
      } else {
        console.log(response);
        console.error('Invalid response from modifyMFS');
        showGeneralError(strings.errors.titleMfa, strings.errors.invalidResponse);
      }
    } catch (err) {
      handleApiError(strings.errors.titleSms, err);
    }
  };

  const onMfaChange = async type => {
    // TODO: Need updated API
    try {
      let mfaConfig = {
        id: subscriberInformation.id,
        type,
        email: subscriberInformation.userId,
        sms: subscriberInformation.phoneNumber,
      };
      logStringifyPretty(mfaConfig);

      const response = await mfaApi.modifyMFS(undefined, undefined, undefined, mfaConfig);

      if (response && response.data) {
        logStringifyPretty(response.data, response.request.responseURL);
      } else {
        console.log(response);
        console.error('Invalid response from getMFS');
        showGeneralError(strings.errors.titleMfa, strings.errors.invalidResponse);
        // TODO revert mfaValue to original
      }
    } catch (error) {
      handleApiError(strings.errors.titleMfa, error);
    }
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
      zIndex: 1, // for mfa dropdown
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
                { label: strings.profile.off, value: SubMfaConfigTypeEnum.Disabled },
                { label: strings.profile.email, value: SubMfaConfigTypeEnum.Email },
                { label: strings.profile.sms, value: SubMfaConfigTypeEnum.Sms },
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
