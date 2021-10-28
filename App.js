import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';

import BrandSelector from './src/screens/BrandSelector';
import SignIn from './src/screens/SignIn';
import ForgotPassword from './src/screens/ForgotPassword';
import ResetPassword from './src/screens/ResetPassword';
import DeviceList from './src/screens/DeviceList';
import DeviceDetails from './src/screens/DeviceDetails';
import Settings from './src/screens/Settings';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const DeviceStack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="BrandSelector" component={BrandSelector} options={{ title: 'Select Brand' }} />
        <Stack.Screen name="SignIn" component={SignIn} options={{ title: 'Sign In' }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ title: 'Forgot Password' }} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ title: 'Password Reset' }} />
        <Stack.Screen name="Main" component={TabScreens} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function TabScreens() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Devices"
        component={DeviceStackScreens}
        options={{
          headerShown: false,
          tabBarIcon: ({ tintColor }) => (
            <Image
              source={require('./src/assets/server-solid.png')}
              style={{ width: 26, height: 26, tintColor: tintColor }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          title: 'Settings',
          tabBarIcon: ({ tintColor }) => (
            <Image
              source={require('./src/assets/cog-solid.png')}
              style={{ width: 26, height: 26, tintColor: tintColor }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function DeviceStackScreens() {
  return (
    <DeviceStack.Navigator>
      <DeviceStack.Screen name="DeviceList" component={DeviceList} options={{ title: 'Devices' }} />
      <DeviceStack.Screen name="DeviceDetails" component={DeviceDetails} options={{ title: 'Details' }} />
    </DeviceStack.Navigator>
  );
}

export default App;
