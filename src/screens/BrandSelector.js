import React, { Component } from 'react';
import { strings } from '../localization/LocalizationStrings';
import { useStore } from '../Store';
import { pageStyle, pageItemStyle, primaryColor } from '../AppStyle';
import { StyleSheet, View, Text, FlatList, TextInput, ActivityIndicator } from 'react-native';
import { BrandItem } from '../components/BrandItem';

export default class BrandSelector extends Component {
  state = {
    loading: false,
    brands: [
      {
        id: 'openwifi',
        name: 'OpenWifi',
        iconUri: 'https://14oranges-ui.arilia.com/assets/14Oranges_Logo.png',
        primaryColor: '#19255f',
      },
      {
        id: 'openwifigreen',
        name: 'OpenWifi (Green)',
        iconUri: 'https://14oranges-ui.arilia.com/assets/14Oranges_Logo.png',
        primaryColor: '#1a3e1b',
      },
    ],
    filtered: false,
    filteredBrands: [],
  };

  componentDidMount() {
    if (useStore.getState().brandInfo !== null) {
      this.props.navigation.navigate('SignIn');
    }
  }

  render() {
    return (
      <View style={pageStyle.container}>
        <View style={pageItemStyle.container}>
          <Text style={pageItemStyle.title}>{strings.brandSelector.title}</Text>
        </View>
        <View style={pageItemStyle.container}>
          <Text style={pageItemStyle.description}>{strings.brandSelector.description}</Text>
        </View>
        {this.state.loading ? (
          <View style={pageItemStyle.container}>
            <ActivityIndicator size="large" color={primaryColor()} animating={this.state.loading} />
          </View>
        ) : (
          <View style={pageItemStyle.containerBrands}>
            <View style={[pageItemStyle.container, brandingSelectorStyle.containerSearch]}>
              <TextInput
                style={pageItemStyle.inputText}
                placeholder="Search"
                onChangeText={search => this.filterBrands(search)}
              />
            </View>
            <View style={pageItemStyle.container}>
              <FlatList
                style={brandingSelectorStyle.containerList}
                data={this.state.filtered ? this.state.filteredBrands : this.state.brands}
                renderItem={({ item }) => <BrandItem brand={item} onPress={this.onCompanySelect.bind(this, item)} />}
              />
            </View>
          </View>
        )}
      </View>
    );
  }

  filterBrands = searchText => {
    if (searchText) {
      let searchTextLowerCase = searchText.toLowerCase();
      this.setState({ filtered: true });
      this.setState({
        filteredBrands: this.state.brands.filter(b => b.name.toLowerCase().startsWith(searchTextLowerCase)),
      });
    } else {
      this.setState({ filtered: false });
      this.setState({ filteredBrands: [] });
    }
  };

  onCompanySelect = async item => {
    useStore.getState().setBrandInfo(item);

    // Replace to the main screen. Use replace to ensure no back button
    this.props.navigation.navigate('SignIn');
  };
}

const brandingSelectorStyle = StyleSheet.create({
  containerBrands: {
    flexDirection: 'column',
    flexWrap: 'nowrap',
    flex: 0,
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    alignItems: 'center',
  },
  containerSearch: {
    marginBottom: 16,
  },
  containerList: {
    width: '100%',
  },
});
