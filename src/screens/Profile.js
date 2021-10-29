import React from 'react';
import { strings } from '../localization/LocalizationStrings';
import { pageStyle, pageItemStyle, primaryColor } from '../AppStyle';
import { View, Button } from 'react-native';
import { signOut } from '../Utils';

const Profile = props => {
  const onSignOutPress = async () => {
    signOut(props.navigation);
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
