import Config from 'react-native-config';
import axios from 'axios';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { strings } from '../localization/LocalizationStrings';
import { pageStyle, pageItemStyle, primaryColor } from '../AppStyle';
import { SafeAreaView, ScrollView, StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { handleApiError } from '../api/apiHandler';
import { scrollViewToTop } from '../Utils';
import { useDispatch } from 'react-redux';
import { setBrandInfo } from '../store/BrandInfoSlice';
import ItemBrand from '../components/ItemBrand';
import TextInputWithIcon from '../components/TextInputWithIcon';

export default function BrandSelector(props) {
  const dispatch = useDispatch();
  // Refs
  const scrollRef = useRef();
  const isMounted = useRef(false);
  // State
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [filtered, setFiltered] = useState(false);
  const [filteredBrands, setFilteredBrands] = useState();

  // Keep track of whether the screen is mounted or not so async tasks know if they should access state
  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  // Refresh the information only anytime there is a navigation change and this has come into focus
  // Need to be careful here as useFocusEffect is also called during re-render so it can result in
  // infinite loops.
  useFocusEffect(
    useCallback(() => {
      // Make sure to scroll to top
      scrollViewToTop(scrollRef);

      // Get the latest brand information
      getBrands();

      // Disable the eslint warning, as we want to change only on navigation changes
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.navigation]),
  );

  const getBrands = async () => {
    try {
      if (!brands) {
        setLoading(true);
      }

      let response = await axios({
        method: 'get',
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          Expires: '0',
        },
        url: Config.TIP_REGISTRY_URL,
      });

      if (isMounted.current) {
        let registry = response.data.registry;

        if (registry) {
          setBrands(registry);
        } else {
          setBrands([]);
        }

        setLoading(false);
      }
    } catch (error) {
      if (isMounted.current) {
        handleApiError(strings.errors.titleBrandSelection, error, props.navigation);
        setLoading(false);
      }
    }
  };

  const onSearch = searchText => {
    if (searchText && brands) {
      let searchTextLowerCase = searchText.toLowerCase();
      setFiltered(true);
      setFilteredBrands(brands.filter(b => b.org_name.toLowerCase().startsWith(searchTextLowerCase)));
    } else {
      setFiltered(false);
      setFilteredBrands([]);
    }
  };

  const onCompanySelect = async item => {
    // Save the brand information on selection
    dispatch(setBrandInfo(item));

    // Reset the navigation so it starts on SignIn
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
                    return <ItemBrand brand={item} key={item.org_name} onPress={() => onCompanySelect(item)} />;
                  })}
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
