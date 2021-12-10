import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setBrandInfo } from '../store/BrandInfoSlice';
import { strings } from '../localization/LocalizationStrings';
import { pageStyle, pageItemStyle, primaryColor } from '../AppStyle';
import { SafeAreaView, ScrollView, StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import ItemBrand from '../components/ItemBrand';
import TextInputWithIcon from '../components/TextInputWithIcon';

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
      baseUrlApi: 'https://lindsay.arilia.com:16006',
    },
    {
      id: '14oranges',
      name: '14 Oranges',
      iconUri: 'https://14oranges-ui.arilia.com/assets/14Oranges_Logo.png',
      primaryColor: '#0f5eaa',
      baseUrlApi: 'https://14oranges.arilia.com:16006',
    },
  ]);
  const [filtered, setFiltered] = useState(false);
  const [filteredBrands, setFilteredBrands] = useState();

  const onSearch = searchText => {
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

  const componentStyles = StyleSheet.create({
    containerBrands: {
      flexDirection: 'column',
      flexWrap: 'nowrap',
      justifyContent: 'flex-start',
      alignItems: 'center',
      flex: 0,
      width: '100%',
    },
    containerList: {
      width: '100%',
    },
  });

  return (
    <SafeAreaView style={pageStyle.safeAreaView}>
      <ScrollView contentContainerStyle={pageStyle.scrollView}>
        <View style={pageStyle.containerPreLogin}>
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
                <TextInputWithIcon
                  style={pageItemStyle.inputText}
                  placeholder="Search"
                  onChangeText={search => onSearch(search)}
                  source={require('../assets/search-solid.png')}
                />
              </View>
              <View style={[pageItemStyle.container]}>
                <View style={componentStyles.containerList}>
                  {(filtered ? filteredBrands : brands).map(item => {
                    return <ItemBrand brand={item} key={item.id} onPress={() => onCompanySelect(item)} />;
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
