import React, { useCallback, useState } from 'react';
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
import { StyleSheet, SafeAreaView, View, Text, ScrollView } from 'react-native';
import { logStringifyPretty, showGeneralMessage, signOut } from '../Utils';
import { emailApi, getCredentials, handleApiError, userManagementApi } from '../api/apiHandler';
import { MfaAuthInfoMethodEnum } from '../api/generated/owSecurityApi';
import { useFocusEffect } from '@react-navigation/native';
import { store } from '../store/Store';
import AccordionSection from '../components/AccordionSection';
import ButtonStyled from '../components/ButtonStyled';
import ItemTextWithIcon from '../components/ItemTextWithIcon';
import ItemTextWithLabel from '../components/ItemTextWithLabel';
import ItemTextWithLabelEditable from '../components/ItemTextWithLabelEditable';
import RadioCheckbox from '../components/RadioCheckbox';

const Profile = props => {
  const state = store.getState();
  const session = state.session.value;
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState();

  // On profile tab focus query the API for the latest profile
  useFocusEffect(
    useCallback(() => {
      getProfile();

      // Return function of what should be done on 'focus out'
      return () => {};
    }, [getProfile]),
  );

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      const response = await userManagementApi.getUsers();
      const userProfile = response.data.users.find(user => user.email === session.username);
      if (userProfile) {
        logStringifyPretty(userProfile, 'getProfile');
        setProfile(userProfile);
      } else {
        handleApiError(strings.errors.titleProfile, strings.errors.userNotFound);
      }
    } catch (error) {
      handleApiError(strings.errors.titleProfile, error);
    } finally {
      setLoading(false);
    }
  }, [session.username]);

  const updateProfile = val => {
    if (profile) {
      updateUser({ ...profile, ...val });
    } else {
      console.error('No profile to update!');
    }
  };

  // Update the user profile information
  const updateUser = async data => {
    try {
      setLoading(true);

      const userInfo = {
        id: data.Id,
        name: data.name,
        userTypeProprietaryInfo: data.userTypeProprietaryInfo,
      };
      const response = await userManagementApi.updateUser(data.Id, undefined, userInfo);
      logStringifyPretty(response.data);
      setProfile(response.data);
    } catch (error) {
      handleApiError(strings.errors.titleUpdate, error);
    } finally {
      setLoading(false);
    }
  };

  const onSignOutPress = async () => {
    signOut(props.navigation);
  };

  const onChangePasswordPress = async () => {
    const credentials = await getCredentials();
    logStringifyPretty(credentials);
    props.navigation.navigate('ResetPassword', {
      userId: credentials.username,
      password: credentials.password,
    });
  };

  // Notifications
  const onNotificationPrefPress = () => {};
  const onNotificationHistoryPress = () => {};

  // MFA Handling
  const onMfaChange = async method => {
    const proprietaryInfo = {
      mfa: {
        enabled: false,
        method: null,
      },
      mobiles: profile.userTypeProprietaryInfo.mobiles,
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

    updateProfile({ userTypeProprietaryInfo: proprietaryInfo });
  };

  // Phone Numbers
  const renderPhoneNumberFields = () => {
    let views = [];

    if (profile) {
      let mobiles = profile.userTypeProprietaryInfo.mobiles;
      if (mobiles.length > 0) {
        views = mobiles.map((mobile, index) => {
          return (
            <ItemTextWithLabelEditable
              label={strings.profile.phone + ' ' + (index + 1)}
              value={mobile.number}
              key={'phone' + index}
              editKey={'phone_' + index}
              placeholder={strings.placeholders.phoneNumber}
              onEdit={phoneInfo => onEditMobile(phoneInfo)}
            />
          );
        });
      }

      // Add a empty field to allow for adding new phone numbers. Currently not supporting deletion
      let phoneIndex = mobiles ? mobiles.length : 0;
      views.push(
        <ItemTextWithLabelEditable
          label={phoneIndex === 0 ? strings.profile.phone : strings.profile.phone + ' ' + (phoneIndex + 1)}
          key={'phone' + phoneIndex}
          editKey={'phone_' + phoneIndex}
          placeholder={strings.placeholders.phoneNumber}
          onEdit={phoneInfo => onEditMobile(phoneInfo)}
        />,
      );
    }

    return views;
  };

  const onEditMobile = async phoneInfo => {
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
      setLoading(true);

      const response = await emailApi.sendATestSMS(true, undefined, undefined, { to: phone });
      logStringifyPretty(response.data);
      showGeneralMessage(strings.messages.codeSent);
      setLoading(false);

      // Navigate to the Phone Verification
      props.navigation.navigate('PhoneVerification', { phone, profile });
    } catch (err) {
      setLoading(false);
      handleApiError(strings.errors.titleSMS, err);
    }
  };

  // Styles
  const styles = StyleSheet.create({
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
  });

  return (
    <SafeAreaView style={pageStyle.safeAreaView}>
      <ScrollView contentContainerStyle={pageStyle.scrollView}>
        <View style={pageStyle.container}>
          {/* Account Information */}
          {!profile ? (
            <AccordionSection
              style={styles.section}
              title={strings.profile.accountInfo}
              isLoading={loading}
              disableAccordion={true}
            />
          ) : (
            <AccordionSection
              style={styles.section}
              title={strings.profile.accountInfo}
              isLoading={loading}
              disableAccordion={true}>
              <ItemTextWithLabelEditable
                key="name"
                label={strings.profile.name}
                value={profile ? profile.name : null}
                editKey="name"
                onEdit={updateProfile}
              />
              <ItemTextWithLabel key="email" label={strings.profile.email} value={session ? session.username : null} />
              {renderPhoneNumberFields()}

              {/* MFA */}
              <View key="mfa" style={styles.item}>
                <Text style={styles.label}>{strings.profile.MFA}</Text>
                {profile.userTypeProprietaryInfo.mfa && (
                  <View>
                    <RadioCheckbox
                      label={strings.profile.off}
                      checked={!profile.userTypeProprietaryInfo.mfa.enabled}
                      onChange={() => onMfaChange()}
                    />
                    <RadioCheckbox
                      label={strings.profile.sms}
                      checked={
                        profile.userTypeProprietaryInfo.mfa.enabled &&
                        profile.userTypeProprietaryInfo.mfa.method === MfaAuthInfoMethodEnum.Sms
                      }
                      onChange={() => onMfaChange(MfaAuthInfoMethodEnum.Sms)}
                    />
                    <RadioCheckbox
                      label={strings.profile.email}
                      checked={
                        profile.userTypeProprietaryInfo.mfa.enabled &&
                        profile.userTypeProprietaryInfo.mfa.method === MfaAuthInfoMethodEnum.Email
                      }
                      onChange={() => onMfaChange(MfaAuthInfoMethodEnum.Email)}
                    />
                  </View>
                )}
              </View>
            </AccordionSection>
          )}

          {/* Buttons */}
          <View style={pageItemStyle.containerButtons}>
            <ButtonStyled
              style={styles.buttonLeft}
              title={strings.buttons.changePassword}
              type="outline"
              onPress={onChangePasswordPress}
            />
            <ButtonStyled
              style={styles.buttonRight}
              title={strings.buttons.signOut}
              type="outline"
              onPress={onSignOutPress}
            />
          </View>

          {/* Notifications */}
          <AccordionSection
            style={styles.section}
            title={strings.profile.notifications}
            isLoading={loading}
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
            style={styles.section}
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
