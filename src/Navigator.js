import React from 'react';
import { strings } from './localization/LocalizationStrings';
import { primaryColor, blackColor, grayBackgroundcolor } from './AppStyle';
import { useSelector } from 'react-redux';
import { selectBrandInfo } from './store/BrandInfoSlice';
import { StyleSheet, Image, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import BrandSelector from './screens/BrandSelector';
import Dashboard from './screens/Dashboard';
import DeviceDetails from './screens/DeviceDetails';
import DeviceList from './screens/DeviceList';
import ForgotPassword from './screens/ForgotPassword';
import NavigationHeader from './components/NavigationHeader';
import Network from './screens/Network';
import MFACode from './screens/MFACode';
import PhoneVerification from './screens/PhoneVerification';
import PrivacyPolicy from './screens/PrivacyPolicy';
import Profile from './screens/Profile';
import ResetPassword from './screens/ResetPassword';
import SignIn from './screens/SignIn';
import TermsConditions from './screens/TermsConditions';

const Navigator = () => {
  const brandInfo = useSelector(selectBrandInfo);
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  const DashboardStack = createNativeStackNavigator();
  const NetworkStack = createNativeStackNavigator();
  const DeviceStack = createNativeStackNavigator();
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
        <DeviceStack.Screen
          name="DashboardScreen"
          component={Dashboard}
          options={{ title: strings.navigator.dashboard }}
        />
      </DashboardStack.Navigator>
    );
  }

  function NetworkNavigator() {
    return (
      <NetworkStack.Navigator screenOptions={({ navigation, route }) => NavigationHeader(navigation, route, brandInfo)}>
        <DeviceStack.Screen name="NetworkScreen" component={Network} options={{ title: strings.navigator.network }} />
      </NetworkStack.Navigator>
    );
  }

  function DeviceNavigator() {
    return (
      <DeviceStack.Navigator screenOptions={({ navigation, route }) => NavigationHeader(navigation, route, brandInfo)}>
        <DeviceStack.Screen name="DeviceList" component={DeviceList} options={{ title: strings.navigator.devices }} />
        <DeviceStack.Screen
          name="DeviceDetails"
          component={DeviceDetails}
          options={{ title: strings.navigator.details }}
        />
      </DeviceStack.Navigator>
    );
  }

  function ProfileNavigator() {
    return (
      <ProfileStack.Navigator screenOptions={({ navigation, route }) => NavigationHeader(navigation, route, brandInfo)}>
        <DeviceStack.Screen name="ProfileScreen" component={Profile} options={{ title: strings.navigator.profile }} />
        <DeviceStack.Screen
          name="ChangePassword"
          component={ResetPassword}
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
        }}>
        <Tab.Screen
          name="Dashboard"
          component={DashboardNavigator}
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
          name="Network"
          component={NetworkNavigator}
          options={{
            tabBarIcon: ({ color }) => (
              <Image
                source={require('./assets/wifi-solid.png')}
                style={[componentStyles.tabIcon, { tintColor: color }]}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Devices"
          component={DeviceNavigator}
          options={{
            tabBarIcon: ({ color }) => (
              <Image
                source={require('./assets/laptop-solid.png')}
                style={[componentStyles.tabIcon, { tintColor: color }]}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileNavigator}
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
          name="ResetPassword"
          component={ResetPassword}
          options={{ title: strings.navigator.passwordReset }}
        />
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
          name="MFACode"
          component={MFACode}
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
