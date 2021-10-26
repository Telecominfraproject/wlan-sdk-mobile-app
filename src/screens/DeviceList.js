import React, {Component} from 'react';
import {strings} from '../localization/LocalizationStrings';
import {pageStyle, pageItemStyle} from '../AppStyle';
import {View, Text, FlatList} from 'react-native';
import {devicesApi, handleApiError} from '../api/apiHandler';
import {DeviceItem} from '../components/DeviceItem';

export default class DeviceList extends Component {
  state = {devices: []};

  render() {
    return (
      <View style={pageStyle.container}>
        <View style={pageItemStyle.container}>
          <Text style={{fontSize: 24, fontWeight: 'bold'}}>Devices</Text>
        </View>
        <View style={pageItemStyle.container}>
          <FlatList
            data={this.state.devices}
            renderItem={({item}) => <DeviceItem device={item} onPress={this.onDevicePress} />}
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
      console.log(response.data);
    } catch (error) {
      handleApiError(strings.errors.deviceListTitle, error);
    }
  };
}
