import React from 'react';
import { store, persistor } from './store/Store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';

import BrandSelector from './screens/BrandSelector';
import SignIn from './screens/SignIn';
import MFACode from './screens/MFACode';
import ForgotPassword from './screens/ForgotPassword';
import ResetPassword from './screens/ResetPassword';
import DeviceList from './screens/DeviceList';
import DeviceDetails from './screens/DeviceDetails';
import Profile from './screens/Profile';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const DeviceStack = createNativeStackNavigator();

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="BrandSelector" component={BrandSelector} options={{ title: 'Select Brand' }} />
            <Stack.Screen name="SignIn" component={SignIn} options={{ title: 'Sign In' }} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ title: 'Forgot Password' }} />
            <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ title: 'Password Reset' }} />
            <Stack.Screen name="MFACode" component={MFACode} options={{ title: 'Multi-factor Authentication' }} />
            <Stack.Screen name="Main" component={TabScreens} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
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
              source={require('./assets/server-solid.png')}
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

function DeviceStackScreens() {
  return (
    <DeviceStack.Navigator>
      <DeviceStack.Screen name="DeviceList" component={DeviceList} options={{ title: 'Devices' }} />
      <DeviceStack.Screen name="DeviceDetails" component={DeviceDetails} options={{ title: 'Details' }} />
    </DeviceStack.Navigator>
  );
}

export default App;
