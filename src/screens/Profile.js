import React, { useEffect, useState } from 'react';
import { strings } from '../localization/LocalizationStrings';
import { pageStyle, pageItemStyle, primaryColor } from '../AppStyle';
import {
  StyleSheet,
  View,
  Button,
  Text,
  ActivityIndicator,
  Linking,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { logStringifyPretty, signOut } from '../Utils';
import { authenticationApi, getCredentials, handleApiError, userManagementApi } from '../api/apiHandler';
import TextInputInPlaceEditing from '../components/TextInputInPlaceEditing';

const Profile = props => {
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState();
  const [profile, setProfile] = useState({
    name: '',
    role: '',
    description: '',
    phone: '',
  });
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
      logStringifyPretty(user);
      setProfile(user);
    } catch (error) {
      handleApiError('Profile Error', error);
    }
  };

  const updateProfile = val => {
    let obj = { ...profile, ...val };
    updateUser(obj);
    setProfile(obj);
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

  const openPasswordPolicy = async () => {
    const url = policies.passwordPolicy;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
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

  return (
    <ScrollView>
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
        <View style={pageItemStyle.container}>
          <Text style={styles.header}>{strings.profile.accountInfo}</Text>
        </View>

        <View style={pageItemStyle.container}>
          <Text style={styles.label}>{strings.profile.name}</Text>
          <TextInputInPlaceEditing style={styles.input} label={'name'} value={profile.name} onSubmit={updateProfile} />
        </View>
        <View style={pageItemStyle.container}>
          <Text style={styles.label}>{strings.profile.email}</Text>
          <TextInputInPlaceEditing
            style={styles.input}
            label={'email'}
            value={profile.email}
            onSubmit={updateProfile}
          />
        </View>

        <View style={pageItemStyle.containerButton}>
          <Button title={strings.buttons.changePassword} color={primaryColor} onPress={changePassword} />
        </View>
        <View style={pageItemStyle.containerButton}>
          <Button title={strings.buttons.signOut} color={primaryColor} onPress={onSignOutPress} />
        </View>

        {/*        Notifications         */}
        <View style={pageItemStyle.container}>
          <Text style={styles.header}>{strings.profile.notifications}</Text>
        </View>
        <View style={pageItemStyle.container}>
          <TouchableOpacity onPress={notificationPref}>
            <View style={styles.line}>
              <Text>{strings.profile.notificationPref}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={notificationHistory}>
            <View style={styles.line}>
              <Text>{strings.profile.notificationHistory}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/*         App            */}
        <View style={pageItemStyle.container}>
          <Text style={styles.header}>{strings.profile.app}</Text>
        </View>
        <View style={pageItemStyle.container}>
          <View style={styles.line}>
            <Text style={styles.label}>{strings.profile.version}</Text>
            <Text style={styles.info}>{'123'}</Text>
          </View>
        </View>

        {/* <View style={pageItemStyle.containerButton}>
        <Text style={[pageItemStyle.buttonText, primaryColorStyle]} onPress={openPasswordPolicy}>
          {strings.buttons.passwordPolicy}
        </Text>
      </View>*/}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  section: {},
  header: {},
  line: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  input: {
    flex: 3,
  },
  label: {
    flex: 1,
  },
  info: {},
});

export default Profile;
