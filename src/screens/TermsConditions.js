import React from 'react';
import { WebView } from 'react-native-webview';
import { useSelector } from 'react-redux';
import { selectBrandInfo } from '../store/BrandInfoSlice';

const TermsConditions = props => {
  // State
  const brandInfo = useSelector(selectBrandInfo);

  return <WebView source={{ uri: brandInfo.access_policy }} />;
};

export default TermsConditions;
