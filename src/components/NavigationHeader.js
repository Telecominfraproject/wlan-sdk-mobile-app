import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { grayDarkColor, whiteColor } from '../AppStyle';

export default function NavigationHeader(navigation, route, brandInfo) {
  const styles = StyleSheet.create({
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
      <View style={styles.containerLeft}>
        {canGoBack && (
          <Pressable onPress={() => navigation.goBack()}>
            <Image style={styles.button} source={require('../assets/chevron_left_white.png')} />
          </Pressable>
        )}
        {brandInfo && <Image style={styles.logo} source={{ uri: brandInfo.iconUri }} />}
      </View>
    ),
  };
}
