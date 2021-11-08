import React, { useEffect, useState } from 'react';
import { strings } from '../localization/LocalizationStrings';
import { pageStyle, pageItemStyle, primaryColor } from '../AppStyle';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { logStringifyPretty, signOut } from '../Utils';
import { authenticationApi, emailApi, getCredentials, handleApiError, userManagementApi } from '../api/apiHandler';
import ButtonStyled from '../components/ButtonStyled';
import TextInputInPlaceEditing from '../components/TextInputInPlaceEditing';
import AccordionSection from '../components/AccordionSection';
import RadioCheckbox from '../components/RadioCheckbox';
import { MfaAuthInfoMethodEnum } from '../api/generated/owSecurityApi';

const Profile = props => {
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({});
  const [profile, setProfile] = useState();
  const [policies, setPolicies] = useState({
    passwordPolicy: '',
    passwordPattern: '',
    accessPolicy: '',
  });
  const [mfaOptions, setMfaOptions] = useState({ off: true, sms: false, email: false, voice: false, method: '' });
  const [mobiles, setMobiles] = useState([]);
  const [phone, setPhone] = useState();

  useEffect(() => {
    getCred();
  }, []);

  useEffect(() => {
    if (credentials) {
      getData();
    }
  }, [credentials]); // eslint-disable-line react-hooks/exhaustive-deps

  const getCred = async () => {
    setLoading(true);
    const cred = await getCredentials();
    setCredentials(cred);
    setLoading(false);
  };

  const getData = async () => {
    setLoading(true);
    await Promise.all([getProfile(), getPolicies()]);
    setLoading(false);
  };

  const getProfile = async () => {
    try {
      const response = await userManagementApi.getUsers();
      const user = response.data.users.find(user => user.email === credentials.username);
      if (user) {
        logStringifyPretty(user);
        setProfile(user);
      }
    } catch (error) {
      handleApiError('getProfile Error', error);
    }
  };

  const updateProfile = val => {
    if (profile) {
      let obj = { ...profile, ...val };
      updateUser(obj);
      setProfile(obj);
    }
  };

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
    } catch (error) {
      handleApiError('updateUser Error', error);
    } finally {
      setLoading(false);
    }
  };

  const getPolicies = async () => {
    try {
      const response = await authenticationApi.getAccessToken(
        {
          userId: credentials.username,
          password: credentials.password,
        },
        undefined,
        undefined,
        true,
      );
      logStringifyPretty(response.data);
      setPolicies(response.data);
    } catch (error) {
      handleApiError('Profile Error', error);
    }
  };

  const onSignOutPress = async () => {
    signOut(props.navigation);
  };

  const onChangePassword = () => {
    props.navigation.navigate('ResetPassword', {
      userId: credentials.username,
      password: credentials.password,
    });
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
        options.method = '';
    }
    updateMFA(options);
    setMfaOptions(options);
  };

  const updateMFA = options => {
    const propInfo = {
      mfa: {
        enabled: !options.off,
        method: options.method,
      },
      mobiles: mobiles,
    };
    updateProfile({ userTypeProprietaryInfo: propInfo });
  };

  // Phone Numbers
  const verifyPhone = async () => {
    try {
      const smsInfo = {
        from: '+1 (819) 272-5460',
        to: phone,
        text: '',
      };
      const response = await emailApi.sendATestSMS(true, undefined, undefined, smsInfo);
      logStringifyPretty(response.data);
    } catch (err) {
      handleApiError('verifyPhone', err);
    }
  };

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
              {profile && (
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
              {profile ? (
                <TextInputInPlaceEditing
                  style={styles.input}
                  objectKey={'email'}
                  value={profile.email}
                  onSubmit={updateProfile}
                />
              ) : (
                <Text style={styles.input}>{credentials && credentials.username}</Text>
              )}
            </View>

            {/*        Phone          */}
            <View style={styles.item}>
              <Text style={styles.label}>{strings.profile.phone}</Text>
              <TextInput
                style={[pageItemStyle.inputText, styles.input]}
                autoCapitalize="none"
                keyboardType="phone-pad"
                textContentType="telephoneNumber"
                value={phone}
                onChangeText={text => setPhone(text)}
                onSubmitEditing={verifyPhone}
              />
              <View style={pageItemStyle.containerButton}>
                <ButtonStyled title={strings.buttons.verify} type="filled" onPress={verifyPhone} disabled={!phone} />
              </View>
            </View>

            {/*     MFA       */}
            {profile && (
              <View style={styles.item}>
                <Text style={styles.label}>{strings.profile.MFA}</Text>
                <View>
                  <RadioCheckbox label={strings.profile.off} checked={mfaOptions.off} onChange={() => onChangeMFA()} />
                  <RadioCheckbox
                    label={strings.profile.sms}
                    checked={mfaOptions.sms}
                    onChange={() => onChangeMFA(MfaAuthInfoMethodEnum.Sms)}
                    disabled={mobiles.length === 0}
                  />
                  <RadioCheckbox
                    label={strings.profile.email}
                    checked={mfaOptions.email}
                    onChange={() => onChangeMFA(MfaAuthInfoMethodEnum.Email)}
                  />
                  <RadioCheckbox
                    label={strings.profile.voice}
                    checked={mfaOptions.voice}
                    onChange={() => onChangeMFA(MfaAuthInfoMethodEnum.Voice)}
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
