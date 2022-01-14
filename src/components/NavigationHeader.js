import React from 'react';
import { Image, Platform, Pressable, StyleSheet, View } from 'react-native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { grayDarkColor, whiteColor, paddingHorizontalDefault } from '../AppStyle';

export default function NavigationHeader(navigation, route, brandInfo) {
  const componentStyles = StyleSheet.create({
    containerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    button: {
      height: 30,
      width: 30,
      resizeMode: 'contain',
    },
    logo: {
      height: 30,
      width: '100%',
      maxWidth: 100,
      resizeMode: 'contain',
      marginHorizontal: paddingHorizontalDefault / 2,
    },
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
