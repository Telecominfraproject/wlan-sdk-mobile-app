import React from 'react';
import { useSelector } from 'react-redux';
import { selectBrandInfo } from './store/BrandInfoSlice';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, Platform } from 'react-native';

import BrandSelector from './screens/BrandSelector';
import SignIn from './screens/SignIn';
import MFACode from './screens/MFACode';
import ForgotPassword from './screens/ForgotPassword';
import ResetPassword from './screens/ResetPassword';
import PrivacyPolicy from './screens/PrivacyPolicy';
import TermsConditions from './screens/TermsConditions';
import Dashboard from './screens/Dashboard';
import DeviceList from './screens/DeviceList';
import DeviceDetails from './screens/DeviceDetails';
import Network from './screens/Network';
import Profile from './screens/Profile';
import { primaryColor, blackColor, grayBackgroundcolor } from './AppStyle';
import PhoneVerification from './screens/PhoneVerification';
import NavigationHeader from './components/NavigationHeader';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const DashboardStack = createNativeStackNavigator();
const NetworkStack = createNativeStackNavigator();
const DeviceStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

const Navigator = () => {
  const brandInfo = useSelector(selectBrandInfo);

  function DashboardNavigator() {
    return (
      <DashboardStack.Navigator
        screenOptions={({ navigation, route }) => NavigationHeader(navigation, route, brandInfo)}>
        <DeviceStack.Screen name="DashboardScreen" component={Dashboard} options={{ title: 'Dashboard' }} />
      </DashboardStack.Navigator>
    );
  }
  function NetworkNavigator() {
    return (
      <NetworkStack.Navigator screenOptions={({ navigation, route }) => NavigationHeader(navigation, route, brandInfo)}>
        <DeviceStack.Screen name="NetworkScreen" component={Network} options={{ title: 'Network' }} />
      </NetworkStack.Navigator>
    );
  }
  function DeviceNavigator() {
    return (
      <DeviceStack.Navigator screenOptions={({ navigation, route }) => NavigationHeader(navigation, route, brandInfo)}>
        <DeviceStack.Screen name="DeviceList" component={DeviceList} options={{ title: 'Devices' }} />
        <DeviceStack.Screen name="DeviceDetails" component={DeviceDetails} options={{ title: 'Details' }} />
      </DeviceStack.Navigator>
    );
  }
  function ProfileNavigator() {
    return (
      <ProfileStack.Navigator screenOptions={({ navigation, route }) => NavigationHeader(navigation, route, brandInfo)}>
        <DeviceStack.Screen name="ProfileScreen" component={Profile} options={{ title: 'Profile' }} />
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
                style={{ width: 26, height: 26, tintColor: color }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Network"
          component={NetworkNavigator}
          options={{
            tabBarIcon: ({ color }) => (
              <Image source={require('./assets/wifi-solid.png')} style={{ width: 26, height: 26, tintColor: color }} />
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
                style={{ width: 26, height: 26, tintColor: color }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileNavigator}
          options={{
            tabBarIcon: ({ color }) => (
              <Image source={require('./assets/user-solid.png')} style={{ width: 26, height: 26, tintColor: color }} />
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
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ title: 'Forgot Password' }} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ title: 'Password Reset' }} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} options={{ title: 'Privacy Policy' }} />
        <Stack.Screen name="TermsConditions" component={TermsConditions} options={{ title: 'Terms & Conditions' }} />
        <Stack.Screen name="MFACode" component={MFACode} options={{ title: 'Multi-factor Authentication' }} />
        <Stack.Screen
          name="PhoneVerification"
          component={PhoneVerification}
          options={{ title: 'Phone Verification' }}
        />
        <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
