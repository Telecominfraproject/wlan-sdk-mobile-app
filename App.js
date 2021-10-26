import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image} from 'react-native';

import SignIn from './src/screens/SignIn';
import ForgotPassword from './src/screens/ForgotPassword';
import DeviceList from './src/screens/DeviceList';
import DeviceDetails from './src/screens/DeviceDetails';
import Settings from './src/screens/Settings';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const DeviceStack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="Main" component={TabScreens} />
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
          tabBarIcon: ({tintColor}) => (
            <Image
              source={require('./src/assets/server-solid.png')}
              style={{width: 26, height: 26, tintColor: tintColor}}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: ({tintColor}) => (
            <Image
              source={require('./src/assets/cog-solid.png')}
              style={{width: 26, height: 26, tintColor: tintColor}}
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
      <DeviceStack.Screen name="DeviceList" component={DeviceList} />
      <DeviceStack.Screen name="DeviceDetails" component={DeviceDetails} />
    </DeviceStack.Navigator>
  );
}

export default App;
