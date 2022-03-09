import React, { useState, useEffect, useCallback, useRef } from 'react';
import { strings } from '../localization/LocalizationStrings';
import {
  marginTopDefault,
  paddingHorizontalDefault,
  heightCellDefault,
  primaryColor,
  redColor,
  pageStyle,
  pageItemStyle,
  paddingVerticalDefault,
} from '../AppStyle';
import { StyleSheet, SafeAreaView, View, ScrollView, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { completeSignOut, logStringifyPretty, scrollViewToTop } from '../Utils';
import {
  getCredentials,
  handleApiError,
  mfaApi,
  SubMfaConfigTypeEnum,
  subscriberInformationApi,
} from '../api/apiHandler';
import { useSelector } from 'react-redux';
import { selectSubscriberInformationLoading, selectSubscriberInformation } from '../store/SubscriberInformationSlice';
import { displayValue, modifySubscriberInformation, setSubscriberInformationInterval } from '../Utils';
import AccordionSection from '../components/AccordionSection';
import ButtonStyled from '../components/ButtonStyled';
import ItemTextWithLabel from '../components/ItemTextWithLabel';
import ItemTextWithLabelEditable from '../components/ItemTextWithLabelEditable';
import ItemPickerWithLabel from '../components/ItemPickerWithLabel';
import VersionInfo from 'react-native-version-info';

const Profile = props => {
  // The sectionZIndex is used to help with any embedded picker/dropdown. Start with a high enough
  // value that it'll cover each section. The sections further up the view should have higher numbers
  var sectionZIndex = 20;
  // Refs
  const scrollRef = useRef();
  const isMounted = useRef(false);
  // State
  const subscriberInformation = useSelector(selectSubscriberInformation);
  const subscriberInformationLoading = useSelector(selectSubscriberInformationLoading);
  const [mfa, setMfa] = useState();
  const [mfaLoading, setMfaLoading] = useState(false);
  const [mfaType, setMfaType] = useState();

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
      // Make sure to scroll to top
      scrollViewToTop(scrollRef);

      // Setup the refresh interval and update the MFA at the same time
      async function updateMfa() {
        getMFA();
      }

      var intervalId = setSubscriberInformationInterval(updateMfa);

      // Return function of what should be done on 'focus out'
      return () => {
        clearInterval(intervalId);
      };

      // Disable the eslint warning, as we want to change only on navigation changes
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.navigation]),
  );

  const getMFA = async () => {
    try {
      if (!mfa) {
        setMfaLoading(true);
      }

      const response = await mfaApi.getMFS();
      if (!response || !response.data) {
        throw new Error(strings.errors.invalidResponse);
      }

      logStringifyPretty(response.data, response.request.responseURL);
      let type = response.data.type || SubMfaConfigTypeEnum.Disabled;

      // Only update the state if still mounted
      if (isMounted.current) {
        setMfa(response.data);
        setMfaType(type);
      }
    } catch (error) {
      // Do not report the error in this case, as it is no longer there and it is just getting state
      if (isMounted.current) {
        handleApiError(strings.errors.titleMfa, error);
      }
    } finally {
      if (isMounted.current) {
        setMfaLoading(false);
      }
    }
  };

  const onEditUserInformation = async val => {
    try {
      if ('phoneNumber' in val) {
        if (mfaType === SubMfaConfigTypeEnum.Sms && 'phoneNumber' in val) {
          // Cannot change the phone number without updating MFA. Technically it would possible to handle
          // This just simplifies the flow for now.
          throw new Error(strings.errors.cannotChangePhoneMfa);
        }

        // Make sure the phone number has a prefix
        let phoneNumberValidate = val.phoneNumber;
        if (phoneNumberValidate) {
          if (phoneNumberValidate.startsWith('1-')) {
            phoneNumberValidate = '+' + phoneNumberValidate;
          } else if (/^\d{3}-/.test(phoneNumberValidate)) {
            phoneNumberValidate = '+1-' + phoneNumberValidate;
          }
        }

        val.phoneNumber = phoneNumberValidate;
      }

      // Config did not change, so make sure that flag is not set
      await modifySubscriberInformation(val, false);
    } catch (error) {
      handleApiError(strings.errors.titleSettingUpdate, error);
      // Need to throw the error to ensure the caller cleans up
      throw error;
    }
  };

  const onMfaChange = async type => {
    try {
      if (mfa === null || mfa.type === type) {
        return;
      }

      if (type === SubMfaConfigTypeEnum.Sms) {
        // SMS type first validate the phone number
        await startSmsValidation(subscriberInformation.phoneNumber);
      } else {
        // Other types set the MFA type
        let mfaConfig = {
          id: subscriberInformation.id,
          type,
        };

        if (type === SubMfaConfigTypeEnum.Email) {
          // Include email with email MFA
          mfaConfig.email = subscriberInformation.userId;
        }

        const response = await mfaApi.modifyMFS(undefined, undefined, undefined, mfaConfig);
        if (!response || !response.data) {
          throw new Error(strings.errors.invalidResponse);
        }
        console.log('MFA change complete');
      }
    } catch (error) {
      handleApiError(strings.errors.titleMfa, error);
    }
  };

  const startSmsValidation = async phone => {
    try {
      let mfaConfig = {
        id: subscriberInformation.id,
        type: SubMfaConfigTypeEnum.Sms,
        sms: phone,
      };

      const response = await mfaApi.modifyMFS(true, undefined, undefined, mfaConfig);
      if (!response || !response.data) {
        throw new Error(strings.errors.invalidResponse);
      }

      logStringifyPretty(response.data, response.request.responseURL);

      // Navigate to the Phone Verification screen
      if (response.data.Code === 0) {
        props.navigation.navigate('PhoneVerification', { mfaConfig });
      } else {
        throw new Error(strings.errors.invalidResponse);
      }
    } catch (error) {
      handleApiError(strings.errors.titleSmsValidation, error);
    }
  };

  const onChangePasswordPress = async () => {
    const credentials = await getCredentials();
    props.navigation.navigate('ChangePassword', { userId: credentials.username });
  };

  const onSignOutPress = async () => {
    completeSignOut(props.navigation);
  };

  const onRemoveMyAccountPress = async () => {
    Alert.alert(strings.configuration.confirmTitle, strings.profile.confirmRemoveMyAccount, [
      {
        text: strings.buttons.ok,
        onPress: async () => {
          try {
            await subscriberInformationApi.deleteSubscriberInfo();
            completeSignOut(props.navigation);
          } catch (error) {
            handleApiError(strings.errors.titleRemoveUser, error);
          }
        },
      },
      {
        text: strings.buttons.cancel,
      },
    ]);
  };

  // Styles
  const componentStyles = StyleSheet.create({
    section: {
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
    buttonRemoveMyAccount: {
      minHeight: heightCellDefault,
      flex: 1,
    },
  });

  const getVersionString = () => {
    return VersionInfo.appVersion + ' (' + VersionInfo.buildVersion + ')';
  };

  return (
    <SafeAreaView style={pageStyle.safeAreaView}>
      <ScrollView ref={scrollRef} contentContainerStyle={pageStyle.scrollView}>
        <View style={pageStyle.containerPostLogin}>
          <AccordionSection
            style={StyleSheet.flatten([componentStyles.section, { zIndex: sectionZIndex-- }])}
            title={strings.profile.accountInfo}
            isLoading={subscriberInformationLoading}
            disableAccordion={true}>
            <ItemTextWithLabelEditable
              key="firstName"
              label={strings.profile.firstName}
              value={displayValue(subscriberInformation, 'firstName')}
              type="firstName"
              editKey="firstName"
              onEdit={onEditUserInformation}
            />
            <ItemTextWithLabelEditable
              key="lastName"
              label={strings.profile.lastName}
              value={displayValue(subscriberInformation, 'lastName')}
              type="lastName"
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
              type="phone"
              editKey="phoneNumber"
              onEdit={onEditUserInformation}
            />
            <ItemPickerWithLabel
              key="mfa"
              label={strings.profile.mfa}
              value={mfaType}
              setValue={setMfaType}
              loading={mfaLoading}
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

          <View style={pageItemStyle.containerButton}>
            <ButtonStyled
              style={componentStyles.buttonRemoveMyAccount}
              title={strings.buttons.removeMyAccount}
              type="text"
              color={redColor}
              onPress={onRemoveMyAccountPress}
            />
          </View>

          {/* App */}
          <AccordionSection
            style={StyleSheet.flatten([componentStyles.section, { zIndex: sectionZIndex-- }])}
            title={strings.profile.app}
            isLoading={false}
            disableAccordion={true}>
            <ItemTextWithLabel key="version" label={strings.profile.version} value={getVersionString()} />
          </AccordionSection>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
