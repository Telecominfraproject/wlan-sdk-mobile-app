import React, { useCallback, useEffect, useState } from 'react';
import { strings } from '../localization/LocalizationStrings';
import { pageStyle, pageItemStyle, primaryColor } from '../AppStyle';
import { StyleSheet, SafeAreaView, View, Text, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { logStringifyPretty, showGeneralMessage, signOut } from '../Utils';
import { emailApi, handleApiError, userManagementApi } from '../api/apiHandler';
import ButtonStyled from '../components/ButtonStyled';
import TextInputInPlaceEditing from '../components/TextInputInPlaceEditing';
import AccordionSection from '../components/AccordionSection';
import RadioCheckbox from '../components/RadioCheckbox';
import { MfaAuthInfoMethodEnum } from '../api/generated/owSecurityApi';
import { useFocusEffect } from '@react-navigation/native';
import { store } from '../store/Store';

const Profile = props => {
  const state = store.getState();
  const session = state.session.value;
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    userTypeProprietaryInfo: { mfa: { enabled: false, method: '' }, mobiles: [] },
  });
  const [mfaOptions, setMfaOptions] = useState({ off: true, sms: false, email: false, voice: false, method: '' });
  const [mobiles, setMobiles] = useState([]);

  // on profile tab focus
  useFocusEffect(
    useCallback(() => {
      // on focus
      getProfile();

      // on focus out
      return () => {};
    }, [getProfile]),
  );

  // profile change updates the phone numbers
  useEffect(() => {
    setMobiles(profile.userTypeProprietaryInfo.mobiles);
  }, [profile.userTypeProprietaryInfo.mobiles]);

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userManagementApi.getUsers();
      const user = response.data.users.find(user => user.email === session.username);
      if (user) {
        logStringifyPretty(user, 'getProfile');
        setProfile(user);
      }
    } catch (error) {
      handleApiError(strings.errors.titleProfile, error);
    } finally {
      setLoading(false);
    }
  }, [session.username]);

  const updateProfile = val => {
    if (profile.Id) {
      let obj = { ...profile, ...val };
      updateUser(obj);
    }
  };

  // call updateUser in api
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
      getProfile();
    } finally {
      setLoading(false);
    }
  };

  const onSignOutPress = async () => {
    signOut(props.navigation);
  };

  const onChangePassword = () => {
    props.navigation.navigate('ResetPassword');
  };

  // Notifications
  const notificationPref = () => {};
  const notificationHistory = () => {};

  // MFA
  const onChangeMFA = method => {
    const { Sms, Email, Voice } = MfaAuthInfoMethodEnum;
    let options = { off: true, sms: false, email: false, voice: false, method: method };
    switch (method) {
      case Sms:
        options.off = false;
        options.sms = true;
        break;
      case Email:
        options.off = false;
        options.email = true;
        break;
      case Voice:
        options.off = false;
        options.voice = true;
        break;
      default:
        options.method = profile.userTypeProprietaryInfo.mfa.method;
    }
    setMfaOptions(options);
  };

  const updateMFAOptions = useCallback(() => {
    if (profile.Id) {
      let mfa = profile.userTypeProprietaryInfo.mfa;
      if (mfa.enabled) {
        onChangeMFA(mfa.method);
      } else {
        onChangeMFA('off');
      }
    }
  }, [profile.Id, profile.userTypeProprietaryInfo.mfa]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // update MFA on profile change
    updateMFAOptions();
  }, [updateMFAOptions]);

  const updateProfileMFA = useCallback(() => {
    if (profile.Id) {
      const propInfo = {
        mfa: {
          enabled: !mfaOptions.off,
          method: mfaOptions.method,
        },
        mobiles: mobiles,
      };
      if (JSON.stringify(profile.userTypeProprietaryInfo) !== JSON.stringify(propInfo)) {
        updateProfile({ userTypeProprietaryInfo: propInfo });
      }
    }
  }, [mfaOptions]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // updates profile on MFA change
    updateProfileMFA();
  }, [updateProfileMFA]);

  // Phone Numbers
  const getPhoneNumbers = () => {
    if (!profile.Id) {
      return;
    }
    if (mobiles.length > 0) {
      return mobiles.map((mobile, index) => (
        <TextInputInPlaceEditing
          key={index}
          style={styles.input}
          value={mobile.number}
          onSubmit={phone => sendSmsCode(phone)}
          disabled={!mfaOptions.sms}
        />
      ));
    } else {
      return (
        <TextInputInPlaceEditing
          style={styles.input}
          placeholder={strings.placeholders.addPhone}
          onSubmit={phone => sendSmsCode(phone)}
          disabled={!mfaOptions.sms}
        />
      );
    }
  };

  const sendSmsCode = async phone => {
    let success = false;
    try {
      setLoading(true);
      const response = await emailApi.sendATestSMS(true, undefined, undefined, { to: phone });
      logStringifyPretty(response.data);
      showGeneralMessage(response.data.Details);
      success = true;
    } catch (err) {
      handleApiError(strings.errors.titleSMS, err);
    } finally {
      setLoading(false);
      if (success) {
        props.navigation.navigate('PhoneVerification', { phone, profile });
      }
    }
  };

  // Styles
  const styles = StyleSheet.create({
    section: {
      marginTop: 10,
    },
    item: {
      paddingVertical: 5,
      paddingHorizontal: 10,
      minHeight: 30,
    },
    label: {
      fontWeight: 'bold',
    },
    input: {
      textAlign: 'left',
      fontSize: 16,
    },
    buttonLeft: {
      marginRight: 5,
      flex: 1,
    },
    buttonRight: {
      marginLeft: 5,
      flex: 1,
    },
  });

  return (
    <SafeAreaView style={pageStyle.safeAreaView}>
      <ScrollView contentContainerStyle={pageStyle.scrollView}>
        <View style={pageStyle.container}>
          {loading && (
            <View style={pageItemStyle.loadingContainer}>
              <ActivityIndicator size="large" color={primaryColor} animating={loading} />
            </View>
          )}

          {/*     Account Information      */}
          <AccordionSection
            style={styles.section}
            title={strings.profile.accountInfo}
            isLoading={loading}
            disableAccordion={true}>
            <View style={styles.item}>
              <Text style={styles.label}>{strings.profile.name}</Text>
              {profile.name && (
                <TextInputInPlaceEditing
                  style={styles.input}
                  objectKey={'name'}
                  value={profile.name}
                  onSubmit={updateProfile}
                />
              )}
            </View>

            <View style={styles.item}>
              <Text style={styles.label}>{strings.profile.email}</Text>
              <Text style={styles.input}>{session.username}</Text>
            </View>

            {/*        Phone          */}
            <View style={styles.item}>
              <Text style={styles.label}>{strings.profile.phone}</Text>
              {getPhoneNumbers()}
            </View>

            {/*     MFA       */}
            {profile.Id && (
              <View style={styles.item}>
                <Text style={styles.label}>{strings.profile.MFA}</Text>
                <View>
                  <RadioCheckbox label={strings.profile.off} checked={mfaOptions.off} onChange={() => onChangeMFA()} />
                  <RadioCheckbox
                    label={strings.profile.sms}
                    checked={mfaOptions.sms}
                    onChange={() => onChangeMFA(MfaAuthInfoMethodEnum.Sms)}
                  />
                  <RadioCheckbox
                    label={strings.profile.email}
                    checked={mfaOptions.email}
                    onChange={() => onChangeMFA(MfaAuthInfoMethodEnum.Email)}
                  />
                </View>
              </View>
            )}
          </AccordionSection>

          {/*             Buttons               */}
          <View style={pageItemStyle.containerButtons}>
            <ButtonStyled
              style={styles.buttonLeft}
              title={strings.buttons.changePassword}
              type="outline"
              onPress={onChangePassword}
            />
            <ButtonStyled
              style={styles.buttonRight}
              title={strings.buttons.signOut}
              type="outline"
              onPress={onSignOutPress}
            />
          </View>

          {/*        Notifications         */}
          <AccordionSection
            style={styles.section}
            title={strings.profile.notifications}
            isLoading={loading}
            disableAccordion={true}>
            <TouchableOpacity onPress={notificationPref}>
              <View style={styles.item}>
                <Text>{strings.profile.notificationPref}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={notificationHistory}>
              <View style={styles.item}>
                <Text>{strings.profile.notificationHistory}</Text>
              </View>
            </TouchableOpacity>
          </AccordionSection>

          {/*         App            */}
          <AccordionSection
            style={styles.section}
            title={strings.profile.app}
            isLoading={loading}
            disableAccordion={true}>
            <View style={styles.item}>
              <Text style={styles.label}>{strings.profile.version}</Text>
              <Text style={styles.input}>{'123'}</Text>
            </View>
          </AccordionSection>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
