import React from 'react';
import { strings } from './localization/LocalizationStrings';
import { primaryColor, blackColor, grayBackgroundcolor } from './AppStyle';
import { StyleSheet, Image, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectBrandInfo } from './store/BrandInfoSlice';
import { selectAccessPoint } from './store/SubscriberInformationSlice';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import AccessSchedule from './screens/AccessSchedule';
import AccessTimeRange from './screens/AccessTimeRange';
import BrandSelector from './screens/BrandSelector';
import ChangePassword from './screens/ChangePassword';
import Configuration from './screens/Configuration';
import Dashboard from './screens/Dashboard';
import DeviceDetails from './screens/DeviceDetails';
import DeviceRegistration from './screens/DeviceRegistration';
import ForgotPassword from './screens/ForgotPassword';
import IpReservationAddEdit from './screens/IpReservationAddEdit';
import NavigationHeader from './components/NavigationHeader';
import Network from './screens/Network';
import NetworkAdd from './screens/NetworkAdd';
import MfaCode from './screens/MfaCode';
import PhoneVerification from './screens/PhoneVerification';
import PrivacyPolicy from './screens/PrivacyPolicy';
import Profile from './screens/Profile';
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import TermsConditions from './screens/TermsConditions';

const Navigator = () => {
  const brandInfo = useSelector(selectBrandInfo);
  const accessPoint = useSelector(selectAccessPoint);

  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  const DeviceRegistrationStack = createNativeStackNavigator();
  const DashboardStack = createNativeStackNavigator();
  const ConfigurationStack = createNativeStackNavigator();
  const NetworkStack = createNativeStackNavigator();
  const ProfileStack = createNativeStackNavigator();

  // Styles
  const componentStyles = StyleSheet.create({
    tabIcon: {
      height: 26,
      width: 26,
    },
  });

  function DashboardNavigator() {
    return (
      <DashboardStack.Navigator
        screenOptions={({ navigation, route }) => NavigationHeader(navigation, route, brandInfo)}>
        <DashboardStack.Screen
          name="DashboardScreen"
          component={Dashboard}
          options={{ title: strings.navigator.dashboard }}
        />
        <DashboardStack.Screen
          name="DeviceRegistration"
          component={DeviceRegistration}
          options={{ title: strings.navigator.deviceRegistration }}
        />
      </DashboardStack.Navigator>
    );
  }

  function DeviceRegistrationNavigator() {
    return (
      <DeviceRegistrationStack.Navigator
        screenOptions={({ navigation, route }) => NavigationHeader(navigation, route, brandInfo)}>
        <DeviceRegistrationStack.Screen
          name="DeviceRegistration"
          component={DeviceRegistration}
          options={{ title: strings.navigator.deviceRegistration }}
        />
      </DeviceRegistrationStack.Navigator>
    );
  }

  function ConfigurationNavigator() {
    return (
      <ConfigurationStack.Navigator
        screenOptions={({ navigation, route }) => NavigationHeader(navigation, route, brandInfo)}>
        <ConfigurationStack.Screen
          name="ConfigurationScreen"
          component={Configuration}
          options={{ title: strings.navigator.configuration }}
        />
        <ConfigurationStack.Screen
          name="IpReservationAddEdit"
          component={IpReservationAddEdit}
          options={{ title: strings.navigator.ipReservation }}
        />
      </ConfigurationStack.Navigator>
    );
  }

  function NetworkNavigator() {
    return (
      <NetworkStack.Navigator screenOptions={({ navigation, route }) => NavigationHeader(navigation, route, brandInfo)}>
        <NetworkStack.Screen name="NetworkScreen" component={Network} options={{ title: strings.navigator.network }} />
        <NetworkStack.Screen
          name="NetworkAdd"
          component={NetworkAdd}
          options={{ title: strings.navigator.networkAdd }}
        />
        <NetworkStack.Screen
          name="DeviceDetails"
          component={DeviceDetails}
          options={{ title: strings.navigator.details }}
        />
        <NetworkStack.Screen
          name="AccessSchedule"
          component={AccessSchedule}
          options={{ title: strings.navigator.accessSchedule }}
        />
        <NetworkStack.Screen
          name="AccessTimeRange"
          component={AccessTimeRange}
          options={{ title: strings.navigator.accessTime }}
        />
      </NetworkStack.Navigator>
    );
  }

  function ProfileNavigator() {
    return (
      <ProfileStack.Navigator screenOptions={({ navigation, route }) => NavigationHeader(navigation, route, brandInfo)}>
        <ProfileStack.Screen name="ProfileScreen" component={Profile} options={{ title: strings.navigator.profile }} />
        <ProfileStack.Screen
          name="ChangePassword"
          component={ChangePassword}
          options={{ title: strings.navigator.changePassword }}
        />
      </ProfileStack.Navigator>
    );
  }

  function TabNavigator() {
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarInactiveTintColor: blackColor,
          tabBarActiveTintColor: primaryColor,
          headerShown: false,
          tabBarHideOnKeyboard: true,
        }}>
        {accessPoint && accessPoint.macAddress && accessPoint.macAddress !== '000000000000' ? (
          <>
            <Tab.Screen
              name="Dashboard"
              component={DashboardNavigator}
              listeners={({ navigation, route }) => ({ tabPress: event => handleTabPress(event, navigation, route) })}
              options={{
                tabBarIcon: ({ color }) => (
                  <Image
                    source={require('./assets/tachometer-alt-solid.png')}
                    style={[componentStyles.tabIcon, { tintColor: color }]}
                  />
                ),
              }}
            />
            <Tab.Screen
              name="Configuration"
              component={ConfigurationNavigator}
              listeners={({ navigation, route }) => ({ tabPress: event => handleTabPress(event, navigation, route) })}
              options={{
                tabBarIcon: ({ color }) => (
                  <Image
                    source={require('./assets/cog-solid.png')}
                    style={[componentStyles.tabIcon, { tintColor: color }]}
                  />
                ),
              }}
            />
            <Tab.Screen
              name="Network"
              component={NetworkNavigator}
              listeners={({ navigation, route }) => ({ tabPress: event => handleTabPress(event, navigation, route) })}
              options={{
                tabBarIcon: ({ color }) => (
                  <Image
                    source={require('./assets/wifi-solid.png')}
                    style={[componentStyles.tabIcon, { tintColor: color }]}
                  />
                ),
              }}
            />
          </>
        ) : (
          <>
            <Tab.Screen
              name="Register"
              component={DeviceRegistrationNavigator}
              listeners={({ navigation, route }) => ({ tabPress: event => handleTabPress(event, navigation, route) })}
              options={{
                tabBarIcon: ({ color }) => (
                  <Image
                    source={require('./assets/cog-solid.png')}
                    style={[componentStyles.tabIcon, { tintColor: color }]}
                  />
                ),
              }}
            />
          </>
        )}
        <Tab.Screen
          name="Profile"
          component={ProfileNavigator}
          listeners={({ navigation, route }) => ({ tabPress: event => handleTabPress(event, navigation, route) })}
          options={{
            tabBarIcon: ({ color }) => (
              <Image
                source={require('./assets/user-solid.png')}
                style={[componentStyles.tabIcon, { tintColor: color }]}
              />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }

  const handleTabPress = (event, navigation, route) => {
    event.preventDefault();

    // Reset to the base navigation on the route when the button is pressed
    navigation.reset({
      index: 0,
      routes: [{ name: route.name }],
    });
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerBackVisible: Platform.OS === 'ios',
          headerStyle: { backgroundColor: grayBackgroundcolor },
          headerShadowVisible: false,
          headerTitleStyle: { fontSize: 16 },
        }}>
        {brandInfo ? (
          <>
            <Stack.Screen name="SignIn" component={SignIn} options={{ title: 'Sign In', headerShown: false }} />
            <Stack.Screen
              name="BrandSelector"
              component={BrandSelector}
              options={{ title: 'Select Brand', headerShown: false }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="BrandSelector"
              component={BrandSelector}
              options={{ title: 'Select Brand', headerShown: false }}
            />
            <Stack.Screen name="SignIn" component={SignIn} options={{ title: 'Sign In', headerShown: false }} />
          </>
        )}
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{ title: strings.navigator.forgotPassword }}
        />
        <Stack.Screen
          name="ChangePasswordForced"
          component={ChangePassword}
          options={{ title: strings.navigator.passwordReset }}
        />
        <Stack.Screen name="SignUp" component={SignUp} options={{ title: strings.navigator.signUp }} />
        <Stack.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicy}
          options={{ title: strings.navigator.privacyPolicy }}
        />
        <Stack.Screen
          name="TermsConditions"
          component={TermsConditions}
          options={{ title: strings.navigator.termsConditions }}
        />
        <Stack.Screen
          name="MfaCode"
          component={MfaCode}
          options={{ title: strings.navigator.multiFactorAuthentication }}
        />
        <Stack.Screen
          name="PhoneVerification"
          component={PhoneVerification}
          options={{ title: strings.navigator.phoneVerification }}
        />
        <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
