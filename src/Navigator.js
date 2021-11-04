import React from 'react';
import { useSelector } from 'react-redux';
import { selectBrandInfo } from './store/BrandInfoSlice';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';

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
import { primaryColor } from './AppStyle';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const DeviceStack = createNativeStackNavigator();

const Navigator = props => {
  const brandInfo = useSelector(selectBrandInfo);

  function DeviceStackScreens() {
    return (
      <DeviceStack.Navigator>
        <DeviceStack.Screen name="DeviceList" component={DeviceList} options={{ title: 'Devices' }} />
        <DeviceStack.Screen name="DeviceDetails" component={DeviceDetails} options={{ title: 'Details' }} />
      </DeviceStack.Navigator>
    );
  }

  function TabScreens() {
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: primaryColor,
        }}>
        <Tab.Screen
          name="Dashboard"
          component={Dashboard}
          options={{
            tabBarIcon: ({ tintColor }) => (
              <Image
                source={require('./assets/tachometer-alt-solid.png')}
                style={{ width: 26, height: 26, tintColor: tintColor }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Network"
          component={Network}
          options={{
            tabBarIcon: ({ tintColor }) => (
              <Image
                source={require('./assets/wifi-solid.png')}
                style={{ width: 26, height: 26, tintColor: tintColor }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Devices"
          component={DeviceStackScreens}
          options={{
            headerShown: false,
            tabBarIcon: ({ tintColor }) => (
              <Image
                source={require('./assets/laptop-solid.png')}
                style={{ width: 26, height: 26, tintColor: tintColor }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            title: 'Profile',
            tabBarIcon: ({ tintColor }) => (
              <Image
                source={require('./assets/user-solid.png')}
                style={{ width: 26, height: 26, tintColor: tintColor }}
              />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {brandInfo ? (
          <>
            <Stack.Screen name="SignIn" component={SignIn} options={{ title: 'Sign In' }} />
            <Stack.Screen name="BrandSelector" component={BrandSelector} options={{ title: 'Select Brand' }} />
          </>
        ) : (
          <>
            <Stack.Screen name="BrandSelector" component={BrandSelector} options={{ title: 'Select Brand' }} />
            <Stack.Screen name="SignIn" component={SignIn} options={{ title: 'Sign In' }} />
          </>
        )}
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ title: 'Forgot Password' }} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ title: 'Password Reset' }} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} options={{ title: 'Privacy Policy' }} />
        <Stack.Screen name="TermsConditions" component={TermsConditions} options={{ title: 'Terms & Conditions' }} />
        <Stack.Screen name="MFACode" component={MFACode} options={{ title: 'Multi-factor Authentication' }} />
        <Stack.Screen name="Main" component={TabScreens} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
