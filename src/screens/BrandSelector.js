import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectBrandInfo, setBrandInfo } from '../store/BrandInfoSlice';
import { strings } from '../localization/LocalizationStrings';
import { pageStyle, pageItemStyle, primaryColor } from '../AppStyle';
import { StyleSheet, View, Text, FlatList, TextInput, ActivityIndicator } from 'react-native';
import BrandItem from '../components/BrandItem';

const BrandSelector = props => {
  const dispatch = useDispatch();
  const brandInfo = useSelector(selectBrandInfo);
  // Currently this following state does not change, but the expectation is that this information
  // will come from an API so it is being left as is for this development
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([
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
  ]);
  const [filtered, setFiltered] = useState(false);
  const [filteredBrands, setFilteredBrands] = useState();

  useEffect(() => {
    if (brandInfo !== null) {
      props.navigation.navigate('SignIn');
    }
    // No dependencies as this is only to run once on mount. There are plenty of
    // hacks around this eslint warning, but disabling it makes the most sense.
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filterBrands = searchText => {
    if (searchText) {
      let searchTextLowerCase = searchText.toLowerCase();
      setFiltered(true);
      setFilteredBrands(brands.filter(b => b.name.toLowerCase().startsWith(searchTextLowerCase)));
    } else {
      setFiltered(false);
      setFilteredBrands([]);
    }
  };

  const onCompanySelect = async item => {
    // Save the brand information
    await dispatch(setBrandInfo(item));

    props.navigation.navigate('SignIn');
  };

  return (
    <View style={pageStyle.container}>
      <View style={pageItemStyle.container}>
        <Text style={pageItemStyle.title}>{strings.brandSelector.title}</Text>
      </View>
      <View style={pageItemStyle.container}>
        <Text style={pageItemStyle.description}>{strings.brandSelector.description}</Text>
      </View>
      {loading ? (
        <View style={pageItemStyle.container}>
          <ActivityIndicator size="large" color={primaryColor} animating={loading} />
        </View>
      ) : (
        <View style={pageItemStyle.containerBrands}>
          <View style={[pageItemStyle.container, brandingSelectorStyle.containerSearch]}>
            <TextInput
              style={pageItemStyle.inputText}
              placeholder="Search"
              onChangeText={search => filterBrands(search)}
            />
          </View>
          <View style={pageItemStyle.container}>
            <FlatList
              style={brandingSelectorStyle.containerList}
              data={filtered ? filteredBrands : brands}
              renderItem={({ item }) => <BrandItem brand={item} onPress={() => onCompanySelect(item)} />}
            />
          </View>
        </View>
      )}
    </View>
  );
};

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

export default BrandSelector;
