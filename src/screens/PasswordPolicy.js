import React from 'react';
import { WebView } from 'react-native-webview';
import { useSelector } from 'react-redux';
import { selectBrandInfo } from '../store/BrandInfoSlice';

export default function PasswordPolicy(props) {
  // State
  const brandInfo = useSelector(selectBrandInfo);

  return <WebView source={{ uri: brandInfo.password_policy }} />;
}
