import React, { useEffect, useState } from 'react';
import { strings } from '../localization/LocalizationStrings';
import { pageStyle, pageItemStyle, primaryColor, whiteColor, blackColor } from '../AppStyle';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Button,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { logStringifyPretty, signOut } from '../Utils';
import { authenticationApi, getCredentials, handleApiError, userManagementApi } from '../api/apiHandler';
import TextInputInPlaceEditing from '../components/TextInputInPlaceEditing';
import AccordionSection from '../components/AccordionSection';

const Profile = props => {
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({});
  const [profile, setProfile] = useState();
  const [policies, setPolicies] = useState({
    passwordPolicy: '',
    passwordPattern: '',
    accessPolicy: '',
  });

  useEffect(() => {
    getCred();
  }, []);

  useEffect(() => {
    if (credentials) {
      getData();
    }
  }, [credentials]);

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
        description: data.description,
        name: data.name,
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

  const changePassword = () => {
    props.navigation.navigate('ResetPassword', {
      userId: credentials.username,
      password: credentials.password,
    });
  };

  const notificationPref = () => {};
  const notificationHistory = () => {};

  const styles = StyleSheet.create({
    section: {
      alignSelf: 'stretch',
      marginVertical: 10,
    },
    item: {
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    label: {
      fontWeight: 'bold',
    },
    input: {
      flex: 3,
      textAlign: 'left',
      fontSize: 16,
    },
    buttonContainer: {
      marginVertical: 10,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignSelf: 'stretch',
    },
    button: {
      padding: 10,
      width: '45%',
      backgroundColor: whiteColor,
      alignItems: 'center',
      // border
      borderWidth: 1,
      borderRadius: 5,
      borderColor: blackColor,
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

          <View style={pageItemStyle.container}>
            <Text style={pageItemStyle.title}>{strings.profile.title}</Text>
          </View>

          {/*     Account Information      */}
          <View style={styles.section}>
            <AccordionSection title={strings.profile.accountInfo} isLoading={loading} disableAccordion={true}>
              {profile && (
                <View style={styles.item}>
                  <Text style={styles.label}>{strings.profile.name}</Text>
                  <TextInputInPlaceEditing
                    style={styles.input}
                    objectKey={'name'}
                    value={profile.name}
                    onSubmit={updateProfile}
                  />
                </View>
              )}

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
            </AccordionSection>
          </View>

          {/*             Buttons               */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={changePassword}>
              <Text>{strings.buttons.changePassword}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={onSignOutPress}>
              <Text>{strings.buttons.signOut}</Text>
            </TouchableOpacity>
          </View>

          {/*        Notifications         */}
          <View style={styles.section}>
            <AccordionSection title={strings.profile.notifications} isLoading={loading} disableAccordion={true}>
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
          </View>

          {/*         App            */}
          <View style={styles.section}>
            <AccordionSection title={strings.profile.app} isLoading={loading} disableAccordion={true}>
              <View style={styles.item}>
                <Text style={styles.label}>{strings.profile.version}</Text>
                <Text style={styles.input}>{'123'}</Text>
              </View>
            </AccordionSection>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
