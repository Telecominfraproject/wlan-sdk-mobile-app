import React from 'react';
import { Image, Platform, Pressable, StyleSheet, View } from 'react-native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { grayDarkColor, whiteColor } from '../AppStyle';

export default function NavigationHeader(navigation, route, brandInfo) {
  const componentStyles = StyleSheet.create({
    containerLeft: { flexDirection: 'row', alignItems: 'center' },
    button: { width: 30, height: 30, resizeMode: 'contain' },
    logo: { resizeMode: 'contain', width: 70, height: 50, marginHorizontal: 5 },
  });

  return {
    headerStyle: { backgroundColor: grayDarkColor },
    headerTitle: getFocusedRouteNameFromRoute(route),
    headerTitleAlign: 'center',
    headerTitleStyle: { color: whiteColor },
    headerLeft: ({ canGoBack }) => (
      <View style={componentStyles.containerLeft}>
        {Platform.OS === 'ios' && canGoBack && (
          <Pressable onPress={() => navigation.goBack()}>
            <Image style={componentStyles.button} source={require('../assets/chevron-left-white.png')} />
          </Pressable>
        )}
        {brandInfo && <Image style={componentStyles.logo} source={{ uri: brandInfo.iconUri }} />}
      </View>
    ),
  };
}
