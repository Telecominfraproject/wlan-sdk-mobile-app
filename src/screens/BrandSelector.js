import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setBrandInfo } from '../store/BrandInfoSlice';
import { strings } from '../localization/LocalizationStrings';
import { pageStyle, pageItemStyle, primaryColor } from '../AppStyle';
import { SafeAreaView, ScrollView, StyleSheet, View, Text, TextInput, ActivityIndicator } from 'react-native';
import BrandItem from '../components/BrandItem';

const BrandSelector = props => {
  const dispatch = useDispatch();
  // Currently the following state does not change, but the expectation is that this information
  // will come from an API so it is being left as is for this development
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([
    {
      id: 'lindsay',
      name: 'Lindsay Broadband',
      iconUri: 'https://lindsaybb.arilia.com/assets/LindsayBB_Logo.png',
      primaryColor: '#f16b1f',
      baseUrlSecurityApi: 'https://lindsay.arilia.com:16001',
    },
    {
      id: '14oranges',
      name: '14 Oranges',
      iconUri: 'https://14oranges-ui.arilia.com/assets/14Oranges_Logo.png',
      primaryColor: '#0f5eaa',
      baseUrlSecurityApi: 'https://14oranges.arilia.com:16001',
    },
  ]);
  const [filtered, setFiltered] = useState(false);
  const [filteredBrands, setFilteredBrands] = useState();

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
    // Save the brand information on selection
    dispatch(setBrandInfo(item));

    // Start the navigation on signin
    props.navigation.reset({
      index: 0,
      routes: [{ name: 'SignIn' }],
    });
  };

  const brandingSelectorStyle = StyleSheet.create({
    containerBrands: {
      flexDirection: 'column',
      flexWrap: 'nowrap',
      flex: 0,
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '100%',
    },
    containerList: {
      width: '100%',
    },
  });

  return (
    <SafeAreaView style={pageStyle.safeAreaView}>
      <ScrollView contentContainerStyle={pageStyle.scrollView}>
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
            <>
              <View style={[pageItemStyle.container]}>
                <TextInput
                  style={pageItemStyle.inputText}
                  placeholder="Search"
                  onChangeText={search => filterBrands(search)}
                />
              </View>
              <View style={[pageItemStyle.container]}>
                <View style={brandingSelectorStyle.containerList}>
                  {(filtered ? filteredBrands : brands).map(item => {
                    return <BrandItem brand={item} key={item.id} onPress={() => onCompanySelect(item)} />;
                  })}
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BrandSelector;
