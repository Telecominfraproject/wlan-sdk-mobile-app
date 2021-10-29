import React from 'react';
import { strings } from '../localization/LocalizationStrings';
import { useDispatch } from 'react-redux';
import { clearSession } from '../store/SessionSlice';
import { pageStyle, pageItemStyle, primaryColor } from '../AppStyle';
import { View, Button } from 'react-native';

const Profile = props => {
  const dispatch = useDispatch();

  const onSignOutPress = async () => {
    // Clear the session information and go back to the start
    dispatch(clearSession());

    props.navigation.replace('BrandSelector');
  };

  return (
    <View style={pageStyle.container}>
      <View style={pageItemStyle.containerButton}>
        <Button title={strings.buttons.signOut} color={primaryColor} onPress={onSignOutPress} />
      </View>
    </View>
  );
};

export default Profile;
