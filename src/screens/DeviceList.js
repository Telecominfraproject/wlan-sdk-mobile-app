import React, {Component} from 'react';
import {strings} from '../localization/LocalizationStrings';
import {page, pageItem} from '../AppStyle';
import {View, Text, Alert, FlatList} from 'react-native';
import {devicesApi} from '../api/apiHandler';

export default class DeviceList extends Component {
  state = {devices: []};

  render() {
    return (
      <View style={page.container}>
        <View style={pageItem.container}>
          <Text>Devices</Text>
          <FlatList
            data={this.state.devices}
            renderItem={({item}) => <Text onPress={this.onDevicePress}>{item.compatible}</Text>}
          />
        </View>
      </View>
    );
  }

  onDevicePress = async () => {
    this.props.navigation.navigate('DeviceDetails');
  };

  componentDidMount = () => {
    this.getDevices();
  };

  getDevices = async () => {
    try {
      const response = await devicesApi.getDeviceList();
      this.setState({devices: response.data.devices});
    } catch (error) {
      console.warn(error);
      Alert.alert(strings.errors.errorTitle, strings.formatString(strings.errors.deviceListError, error));
    }
  };
}
